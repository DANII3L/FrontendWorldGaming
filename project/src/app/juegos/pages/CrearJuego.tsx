import React, { useState } from 'react';
import {
  Gamepad2,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  Users,
  Star,
  Shield,
  Minus
} from 'lucide-react';
import DynamicForm, { FormField } from '../../shared/components/ui/DynamicForm';

interface GameForm {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  maxPlayers: number;
  titulares: number;
  suplentes: number;
  palette: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    light: string;
  };
  icon: string;
  logo?: File;
  isActive: boolean;
}

const CrearJuego: React.FC = () => {
  const [formData, setFormData] = useState<GameForm>({
    name: '',
    description: '',
    category: '',
    difficulty: 'Intermedio',
    maxPlayers: 10,
    titulares: 5,
    suplentes: 2,
    palette: {
      primary: '#0A1128',
      secondary: '#001F54',
      tertiary: '#034078',
      accent: '#1282A2',
      light: '#FEFCFB'
    },
    icon: '🎮',
    isActive: true
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedColorField, setSelectedColorField] = useState<keyof GameForm['palette'] | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);

  const categories = [
    'MOBA', 'FPS', 'Battle Royale', 'RPG', 'Estrategia',
    'Deportes', 'Carreras', 'Lucha', 'Simulación', 'Otros'
  ];

  const difficulties = ['Principiante', 'Intermedio', 'Avanzado', 'Profesional'];

  // Configuración de campos para DynamicForm
  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre del Juego',
      type: 'text',
      required: true,
      placeholder: 'Ej: League of Legends'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Describe el juego...'
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: categories.map(cat => ({ value: cat, label: cat }))
    },
    {
      name: 'difficulty',
      label: 'Dificultad',
      type: 'select',
      required: true,
      options: difficulties.map(diff => ({ value: diff, label: diff }))
    },
    {
      name: 'maxPlayers',
      label: 'Máximo de Jugadores',
      type: 'number',
      required: true,
      placeholder: '10'
    }
  ];

  const presetPalettes = [
    {
      name: 'Clásico Gaming',
      colors: {
        primary: '#0A1128',
        secondary: '#001F54',
        tertiary: '#034078',
        accent: '#1282A2',
        light: '#FEFCFB'
      }
    },
    {
      name: 'Valorant',
      colors: {
        primary: '#0F1419',
        secondary: '#FF4655',
        tertiary: '#53212B',
        accent: '#7C3AED',
        light: '#F8FAFC'
      }
    },
    {
      name: 'CS:GO',
      colors: {
        primary: '#1B1B1B',
        secondary: '#F7931E',
        tertiary: '#2D2D2D',
        accent: '#4A90E2',
        light: '#FFFFFF'
      }
    },
    {
      name: 'Fortnite',
      colors: {
        primary: '#1A1A2E',
        secondary: '#16213E',
        tertiary: '#0F3460',
        accent: '#E94560',
        light: '#F8F9FA'
      }
    },
    {
      name: 'League of Legends',
      colors: {
        primary: '#0A1428',
        secondary: '#C89B3C',
        tertiary: '#1E2328',
        accent: '#F0E6D2',
        light: '#FFFFFF'
      }
    }
  ];

  const gameIcons = [
    '🎮', '⚔️', '🏆', '🎯', '🔥', '⚡', '💎', '🌟', '🎪', '🎲',
    '🏁', '🥊', '🏈', '⚽', '🏀', '🎾', '🏓', '🎯', '🎨', '🎭'
  ];

  const handleInputChange = (field: keyof GameForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaletteChange = (field: keyof GameForm['palette'], value: string) => {
    setFormData(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPresetPalette = (palette: typeof presetPalettes[0]) => {
    setFormData(prev => ({
      ...prev,
      palette: palette.colors
    }));
  };

  const openColorModal = (field: keyof GameForm['palette']) => {
    setSelectedColorField(field);
    setShowColorModal(true);
  };

  const closeColorModal = () => {
    setShowColorModal(false);
    setSelectedColorField(null);
  };

  const selectColor = (color: string) => {
    if (selectedColorField) {
      handlePaletteChange(selectedColorField, color);
    }
    closeColorModal();
  };

  const handleFormSubmit = (values: Record<string, any>) => {
    // Actualizar el formData con los valores del DynamicForm
    setFormData(prev => ({
      ...prev,
      name: values.name || '',
      description: values.description || '',
      category: values.category || '',
      difficulty: values.difficulty || 'Intermedio',
      maxPlayers: values.maxPlayers || 10,
      titulares: values.titulares || 5,
      suplentes: values.suplentes || 2
    }));

    // Aquí iría la lógica para guardar el juego
    console.log('Guardando juego:', { ...formData, ...values });
  };

  const handleFormValuesChange = (name: string, value: any) => {
    // Actualizar el formData en tiempo real con los cambios del DynamicForm
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el juego
    console.log('Guardando juego:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Crear Nuevo Juego</h1>
          <p className="text-white/80 mt-1">Configura un nuevo juego para la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulario - 2 columnas */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>

            <DynamicForm
              fields={formFields}
              values={{
                name: formData.name,
                description: formData.description,
                category: formData.category,
                difficulty: formData.difficulty,
                maxPlayers: formData.maxPlayers,
                titulares: formData.titulares,
                suplentes: formData.suplentes
              }}
              onChange={handleFormValuesChange}
              onSubmit={() => {}}
              className="p-0"
            />
          </div>

          {/* Configuración de Jugadores */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Configuración de Jugadores</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jugadores Titulares */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Jugadores Titulares</h3>
                    <p className="text-white/60 text-sm">Jugadores que participarán en los partidos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleInputChange('titulares', Math.max(1, formData.titulares - 1))}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-bold text-yellow-400">{formData.titulares}</span>
                    <p className="text-white/60 text-sm">titulares</p>
                  </div>
                  
                  <button
                    onClick={() => handleInputChange('titulares', formData.titulares + 1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Jugadores Suplentes */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Jugadores Suplentes</h3>
                    <p className="text-white/60 text-sm">Jugadores de respaldo para el equipo</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleInputChange('suplentes', Math.max(0, formData.suplentes - 1))}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-bold text-blue-400">{formData.suplentes}</span>
                    <p className="text-white/60 text-sm">suplentes</p>
                  </div>
                  
                  <button
                    onClick={() => handleInputChange('suplentes', formData.suplentes + 1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Resumen de Configuración</h3>
                  <p className="text-white/60 text-sm">Total de jugadores requeridos por equipo</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formData.titulares + formData.suplentes}</div>
                  <p className="text-white/60 text-sm">jugadores total</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center">
                  <span className="text-yellow-400 font-bold">{formData.titulares}</span>
                  <p className="text-white/60 text-xs">Titulares</p>
                </div>
                <div className="text-center">
                  <span className="text-blue-400 font-bold">{formData.suplentes}</span>
                  <p className="text-white/60 text-xs">Suplentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Paleta de Colores */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Paleta de Colores</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Paletas Predefinidas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {presetPalettes.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPresetPalette(preset)}
                      className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex space-x-1">
                          {Object.values(preset.colors).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded border border-white/20"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80 text-xs">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.palette).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-white/80 text-sm font-medium mb-2 capitalize">
                      {key}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openColorModal(key as keyof GameForm['palette'])}
                        className="w-12 h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors flex items-center justify-center"
                        style={{ backgroundColor: value }}
                      >
                        <div className="w-8 h-6 rounded border border-white/30" style={{ backgroundColor: value }} />
                      </button>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handlePaletteChange(key as keyof GameForm['palette'], e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Icono y Logo */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Icono y Logo</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Icono del Juego
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {gameIcons.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('icon', icon)}
                      className={`p-2 text-2xl rounded-lg border transition-all duration-200 ${formData.icon === icon
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Logo del Juego (Opcional)
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">
                      {logoPreview ? 'Cambiar logo' : 'Haz clic para subir un logo'}
                    </p>
                  </label>
                </div>
                {logoPreview && (
                  <div className="mt-3 flex items-center space-x-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded-lg border border-white/20"
                    />
                    <button
                      onClick={() => {
                        setLogoPreview(null);
                        handleInputChange('logo', undefined);
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Estado</h2>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <label htmlFor="isActive" className="text-white/80">
                Juego activo (visible para los usuarios)
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Juego</span>
            </button>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>

        {/* Vista Previa - Siempre visible */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Vista Previa</h2>

              <div
                className="p-6 rounded-2xl border border-white/20 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${formData.palette.primary}, ${formData.palette.secondary})`
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{formData.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {formData.name || 'Nombre del Juego'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {formData.category || 'Categoría'} • {formData.difficulty}
                    </p>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">
                  {formData.description || 'Descripción del juego...'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <Gamepad2 className="h-4 w-4" />
                    <span>Máx {formData.maxPlayers} jugadores</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-white/80 text-sm">
                      {formData.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Muestra de Colores */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Paleta de Colores</h3>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.palette).map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-12 rounded-lg border border-white/20 mb-2"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-white/60 text-xs capitalize">{key}</p>
                    <p className="text-white/40 text-xs font-mono">{color}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Colores */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Seleccionar Color - {selectedColorField ? selectedColorField.charAt(0).toUpperCase() + selectedColorField.slice(1) : ''}
              </h3>
              <button
                onClick={closeColorModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2 mb-4">
              {[
                '#0A1128', '#001F54', '#034078', '#1282A2', '#FEFCFB',
                '#FF4655', '#7C3AED', '#F7931E', '#4A90E2', '#E94560',
                '#C89B3C', '#F0E6D2', '#1E2328', '#53212B', '#2D2D2D',
                '#16213E', '#0F3460', '#F8F9FA', '#FFFFFF', '#000000',
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
                '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
                '#A9CCE3', '#FAD7A0', '#D5A6BD', '#A2D9CE', '#F9E79F'
              ].map((color, index) => (
                <button
                  key={index}
                  onClick={() => selectColor(color)}
                  className={`w-10 h-10 rounded border-2 transition-all duration-200 hover:scale-110 ${selectedColorField && formData.palette[selectedColorField] === color
                      ? 'border-white shadow-lg scale-110'
                      : 'border-white/20 hover:border-white/40'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="w-12 h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors flex items-center justify-center"
                style={{ backgroundColor: selectedColorField ? (formData.palette[selectedColorField] || '#000000') : '#000000' }}
              >
                <div className="w-8 h-6 rounded border border-white/30" style={{ backgroundColor: selectedColorField ? (formData.palette[selectedColorField] || '#000000') : '#000000' }} />
              </button>
              <input
                type="text"
                value={selectedColorField ? (formData.palette[selectedColorField] || '') : ''}
                onChange={(e) => selectColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearJuego;
