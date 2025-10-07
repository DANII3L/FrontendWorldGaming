/**
 * Utilidades para manejo de archivos
 */

export interface FileValidationOptions {
  maxSize?: number; // en bytes
  allowedTypes?: string[]; // MIME types
  maxWidth?: number; // para imágenes
  maxHeight?: number; // para imágenes
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Convierte un archivo a base64
 * @param file - Archivo a convertir
 * @returns Promise con el string base64
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convierte múltiples archivos a base64
 * @param files - Array de archivos
 * @returns Promise con array de strings base64
 */
export const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(convertFileToBase64));
};

/**
 * Valida un archivo según las opciones proporcionadas
 * @param file - Archivo a validar
 * @param options - Opciones de validación
 * @returns Resultado de la validación
 */
export const validateFile = (file: File, options: FileValidationOptions = {}): FileValidationResult => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB por defecto
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth = 2048,
    maxHeight = 2048
  } = options;

  // Validar tamaño
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo permitido: ${formatFileSize(maxSize)}`
    };
  }

  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Valida y convierte un archivo a base64
 * @param file - Archivo a procesar
 * @param options - Opciones de validación
 * @returns Promise con el resultado
 */
export const validateAndConvertFile = async (
  file: File, 
  options: FileValidationOptions = {}
): Promise<{ isValid: boolean; data?: string; error?: string }> => {
  const validation = validateFile(file, options);
  
  if (!validation.isValid) {
    return { isValid: false, error: validation.error };
  }

  try {
    const base64 = await convertFileToBase64(file);
    return { isValid: true, data: base64 };
  } catch (error) {
    return { isValid: false, error: 'Error al convertir el archivo' };
  };
};

/**
 * Formatea el tamaño de un archivo en bytes a formato legible
 * @param bytes - Tamaño en bytes
 * @returns String formateado
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obtiene la extensión de un archivo
 * @param filename - Nombre del archivo
 * @returns Extensión del archivo
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Genera un nombre de archivo único
 * @param originalName - Nombre original del archivo
 * @param prefix - Prefijo opcional
 * @returns Nombre único del archivo
 */
export const generateUniqueFileName = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  const baseName = originalName.replace(`.${extension}`, '');
  
  return `${prefix ? `${prefix}_` : ''}${baseName}_${timestamp}_${random}.${extension}`;
};

/**
 * Crea un handler para upload de archivos con validación
 * @param options - Opciones de validación
 * @param onSuccess - Callback cuando el archivo es válido
 * @param onError - Callback cuando hay error
 * @returns Handler para el evento change
 */
export const createFileUploadHandler = (
  options: FileValidationOptions = {},
  onSuccess: (file: File, base64: string) => void,
  onError: (error: string) => void
) => {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    const result = await validateAndConvertFile(file, options);
    
    if (result.isValid && result.data) {
      onSuccess(file, result.data);
    } else {
      onError(result.error || 'Error desconocido');
    }
  };
};

/**
 * Convierte base64 a Blob
 * @param base64 - String base64
 * @param mimeType - Tipo MIME del archivo
 * @returns Blob del archivo
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Descarga un archivo desde base64
 * @param base64 - String base64
 * @param filename - Nombre del archivo
 * @param mimeType - Tipo MIME del archivo
 */
export const downloadFromBase64 = (base64: string, filename: string, mimeType: string = 'image/png'): void => {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
