import React, { useState, useRef } from 'react';
import { X, Upload, File, Image, FileText, Video, Music } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File, preview: string) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  description?: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  accept = '*/*',
  multiple = false,
  title = 'Seleccionar archivo',
  description = 'Arrastra y suelta archivos aquí o haz clic para seleccionar'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-green-500" />;
      case 'text':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (accept === '*/*') return true;
      return file.type.match(accept.replace('*', '.*'));
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const fileData = { file, preview };
        
        if (multiple) {
          setSelectedFiles(prev => [...prev, fileData]);
        } else {
          setSelectedFiles([fileData]);
        }
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleConfirm = () => {
    if (selectedFiles.length > 0) {
      if (multiple) {
        selectedFiles.forEach(({ file, preview }) => {
          onFileSelect(file, preview);
        });
      } else {
        const { file, preview } = selectedFiles[0];
        onFileSelect(file, preview);
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setDragActive(false);
    onClose();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-orange-primary bg-orange-50'
                : 'border-border-color hover:border-orange-primary hover:bg-orange-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-primary font-medium mb-2">
              Arrastra y suelta archivos aquí
            </p>
            <p className="text-text-secondary text-sm">
              o haz clic para seleccionar archivos
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Archivos seleccionados ({selectedFiles.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedFiles.map((fileData, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border-color"
                  >
                    {getFileIcon(fileData.file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {fileData.file.type.startsWith('image/') && (
                      <img
                        src={fileData.preview}
                        alt="preview"
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border-color">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedFiles.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-orange-primary to-red-primary text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {multiple ? 'Seleccionar archivos' : 'Seleccionar archivo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal; 