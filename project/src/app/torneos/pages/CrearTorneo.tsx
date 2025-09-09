import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Target,
  Save,
  X,
  Upload,
  Trash2,
  Gamepad2,
  Clock,
  Award,
  Plus
} from 'lucide-react';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';

interface TournamentForm {
  name: string;
  game: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  maxParticipants: number;
  entryFee: number;
  prize: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  image?: File;
  rules: string[];
  isActive: boolean;
}

const CrearTorneo: React.FC = () => {
  const [formData, setFormData] = useState<TournamentForm>({
    name: '',
    game: '',
    description: '',
    category: '',
    difficulty: 'intermediate',
    maxParticipants: 64,
    entryFee: 25,
    prize: '$1,000',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    rules: [],
    isActive: true
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<string>('');

  const categories = [
    'FPS', 'MOBA', 'RPG', 'Battle Royale', 'Card Game', 'Estrategia',
    'Deportes', 'Carreras', 'Lucha', 'Simulación', 'Otros'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'expert', label: 'Experto' }
  ];

  const games = [
    'Counter-Strike 2', 'League of Legends', 'Valorant', 'Fortnite',
    'World of Warcraft', 'Hearthstone', 'Dota 2', 'Overwatch 2',
    'Rocket League', 'FIFA 24', 'Call of Duty', 'Apex Legends'
  ];

  // Configuración de campos para DynamicForm
  const formFields: IFieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre del Torneo',
      type: 'text',
      required: true,
      placeholder: 'Ej: FPS Championship 2025',
      maxLength: 100
    },
    {
      name: 'game',
      label: 'Juego',
      type: 'select',
      required: true,
      options: games.map(game => ({ value: game, label: game }))
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Describe el torneo, reglas especiales, formato...',
      maxLength: 500,
      colSpan: 2
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
      options: difficulties
    },
    {
      name: 'maxParticipants',
      label: 'Máximo de Participantes',
      type: 'number',
      required: true,
      placeholder: '64'
    },
    {
      name: 'entryFee',
      label: 'Costo de Entrada ($)',
      type: 'number',
      required: true,
      placeholder: '25'
    },
    {
      name: 'prize',
      label: 'Premio',
      type: 'text',
      required: true,
      placeholder: '$1,000'
    },
    {
      name: 'startDate',
      label: 'Fecha de Inicio',
      type: 'date',
      required: true
    },
    {
      name: 'endDate',
      label: 'Fecha de Fin',
      type: 'date',
      required: true
    },

  ];

  const handleInputChange = (field: keyof TournamentForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      // Dividir por comas y limpiar cada regla
      const rulesToAdd = newRule
        .split(',')
        .map(rule => rule.trim())
        .filter(rule => rule.length > 0);
      
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, ...rulesToAdd]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRule();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormValuesChange = (values: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      name: values.name || '',
      game: values.game || '',
      description: values.description || '',
      category: values.category || '',
      difficulty: values.difficulty || 'intermediate',
      maxParticipants: values.maxParticipants || 64,
      entryFee: values.entryFee || 25,
      prize: values.prize || '$1,000',
      startDate: values.startDate || '',
      endDate: values.endDate || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guardando torneo:', formData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'PRÓXIMO';
      case 'active': return 'ACTIVO';
      case 'completed': return 'COMPLETADO';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Crear Nuevo Torneo</h1>
          <p className="text-white/80 mt-1">Configura un nuevo torneo para la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulario - 2 columnas */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>

            <DynamicForm
              fields={formFields}
              initialValues={{
                name: formData.name,
                game: formData.game,
                description: formData.description,
                category: formData.category,
                difficulty: formData.difficulty,
                maxParticipants: formData.maxParticipants,
                entryFee: formData.entryFee,
                prize: formData.prize,
                startDate: formData.startDate,
                endDate: formData.endDate
              }}
              onValuesChange={handleFormValuesChange}
              className="p-0"
            />
          </div>

          {/* Reglas del Torneo */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Reglas del Torneo</h2>
            
                         {/* Input para agregar nueva regla */}
             <div className="space-y-2 mb-4">
               <div className="flex gap-2">
                 <input
                   type="text"
                   value={newRule}
                   onChange={(e) => setNewRule(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Agregar regla(s)... (separar múltiples reglas con comas)"
                   className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                 />
                 <button
                   onClick={handleAddRule}
                   disabled={!newRule.trim()}
                   className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:bg-gray-500/20 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                 >
                   <Plus className="h-4 w-4" />
                   <span>Agregar</span>
                 </button>
               </div>
               <p className="text-white/50 text-xs">
                 💡 Ejemplo: "No usar hacks, Respetar a otros jugadores, No abandonar partidas"
               </p>
             </div>

            {/* Lista de reglas */}
            {formData.rules.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white/80 text-sm font-medium">Reglas actuales:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm"
                    >
                      <span className="truncate max-w-xs">{rule}</span>
                      <button
                        onClick={() => handleRemoveRule(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay reglas */}
            {formData.rules.length === 0 && (
              <div className="text-center py-4">
                <p className="text-white/60 text-sm">No hay reglas agregadas. Agrega la primera regla arriba.</p>
              </div>
            )}
          </div>

          {/* Imagen del Torneo */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Imagen del Torneo</h2>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="tournament-image-upload"
              />
              <label htmlFor="tournament-image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {imagePreview ? 'Cambiar imagen' : 'Haz clic para subir una imagen'}
                </p>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3 flex items-center space-x-3">
                <img
                  src={imagePreview}
                  alt="Tournament preview"
                  className="w-16 h-16 object-cover rounded-lg border border-white/20"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    handleInputChange('image', undefined);
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Eliminar</span>
                </button>
              </div>
            )}
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
                Torneo activo (visible para los usuarios)
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
              <span>Guardar Torneo</span>
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

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                {/* Imagen del torneo */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imagePreview || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"}
                    alt="Tournament preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(formData.status)}`}>
                      {getStatusText(formData.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(formData.difficulty)}`}>
                      {formData.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Premio */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-lg font-bold text-sm border border-slate-500/30">
                    {formData.prize || '$1,000'}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {formData.name || 'Nombre del Torneo'}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">{formData.game || 'Juego'}</p>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-300" />
                      <span className="text-white/80 text-sm">
                        0/{formData.maxParticipants || 64}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      <span className="text-white/80 text-sm">
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Fecha por definir'}
                      </span>
                    </div>
                  </div>

                  {/* Progreso de participantes */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Participantes</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-2 rounded-full transition-all duration-300" style={{ width: '0%' }} />
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Entrada:</span>
                      <span className="text-white font-semibold">${formData.entryFee || 25}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del torneo */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Detalles del Torneo</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Categoría:</span>
                  <span className="text-white text-sm">{formData.category || 'No definida'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Dificultad:</span>
                  <span className={`text-sm px-2 py-1 rounded ${getDifficultyColor(formData.difficulty)}`}>
                    {formData.difficulty || 'Intermedio'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Estado:</span>
                  <span className={`text-sm px-2 py-1 rounded border ${getStatusColor(formData.status)}`}>
                    {getStatusText(formData.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Fecha fin:</span>
                  <span className="text-white text-sm">
                    {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'No definida'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Reglas:</span>
                  <span className="text-white text-sm">
                    {formData.rules.length > 0 ? `${formData.rules.length} regla${formData.rules.length !== 1 ? 's' : ''}` : 'Sin reglas'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTorneo;
