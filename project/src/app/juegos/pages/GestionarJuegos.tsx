import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import { useConfirmation } from '../../shared/contexts/ConfirmationContext';

interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  maxPlayers: number;
  palette: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    light: string;
  };
  icon: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const GestionarJuegos: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm } = useConfirmation();

  // Mock data - En producción esto vendría de una API
  const mockGames: Game[] = [
    {
      id: '1',
      name: 'League of Legends',
      description: 'MOBA competitivo con más de 150 campeones únicos',
      category: 'MOBA',
      difficulty: 'Avanzado',
      maxPlayers: 10,
      palette: {
        primary: '#0A1428',
        secondary: '#C89B3C',
        tertiary: '#1E2328',
        accent: '#F0E6D2',
        light: '#FFFFFF'
      },
      icon: '⚔️',
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-20'
    },
    {
      id: '2',
      name: 'Valorant',
      description: 'FPS táctico 5v5 con agentes con habilidades únicas',
      category: 'FPS',
      difficulty: 'Intermedio',
      maxPlayers: 10,
      palette: {
        primary: '#0F1419',
        secondary: '#FF4655',
        tertiary: '#53212B',
        accent: '#7C3AED',
        light: '#F8FAFC'
      },
      icon: '🎯',
      isActive: true,
      createdAt: '2024-02-01',
      updatedAt: '2024-03-18'
    },
    {
      id: '3',
      name: 'Counter-Strike 2',
      description: 'FPS clásico de terroristas vs contra-terroristas',
      category: 'FPS',
      difficulty: 'Profesional',
      maxPlayers: 10,
      palette: {
        primary: '#1B1B1B',
        secondary: '#F7931E',
        tertiary: '#2D2D2D',
        accent: '#4A90E2',
        light: '#FFFFFF'
      },
      icon: '🔥',
      isActive: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-03-15'
    },
    {
      id: '4',
      name: 'Fortnite',
      description: 'Battle Royale con construcción y eventos especiales',
      category: 'Battle Royale',
      difficulty: 'Intermedio',
      maxPlayers: 100,
      palette: {
        primary: '#1A1A2E',
        secondary: '#16213E',
        tertiary: '#0F3460',
        accent: '#E94560',
        light: '#F8F9FA'
      },
      icon: '🏆',
      isActive: true,
      createdAt: '2024-02-15',
      updatedAt: '2024-03-22'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    const loadGames = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGames(mockGames);
      setLoading(false);
    };

    loadGames();
  }, []);

  const handleToggleStatus = (gameId: string) => {
    setGames(prev => prev.map(game =>
      game.id === gameId ? { ...game, isActive: !game.isActive } : game
    ));
  };

  const handleDeleteGame = async (gameId: string) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Juego',
      message: '¿Estás seguro de que quieres eliminar este juego? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });
    
    if (confirmed) {
      setGames(prev => prev.filter(game => game.id !== gameId));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Profesional': return 'text-orange-500';
      case 'Avanzado': return 'text-orange-400';
      case 'Intermedio': return 'text-teal-400';
      case 'Principiante': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const renderGameCard = (game: Game) => (
    <div
      className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:border-white/30 transition-all duration-300 group"
      style={{
        background: `linear-gradient(135deg, ${game.palette.primary}20, ${game.palette.secondary}20)`
      }}
    >
      {/* Header del juego */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{game.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-slate-300 transition-colors">
              {game.name}
            </h3>
            <p className="text-white/60 text-sm">{game.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleStatus(game.id)}
            className={`p-1 rounded transition-colors duration-200 ${game.isActive
                ? 'text-green-400 hover:text-green-300'
                : 'text-red-400 hover:text-red-300'
              }`}
            title={game.isActive ? 'Desactivar juego' : 'Activar juego'}
          >
            {game.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-white/70 text-sm mb-4 line-clamp-2">
        {game.description}
      </p>

      {/* Información del juego */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Dificultad:</span>
          <span className={`font-medium ${getDifficultyColor(game.difficulty)}`}>
            {game.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Jugadores:</span>
          <span className="text-white font-medium">{game.maxPlayers}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Estado:</span>
          <span className={`font-medium ${game.isActive ? 'text-green-400' : 'text-red-400'}`}>
            {game.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Paleta de colores */}
      <div className="mb-4">
        <p className="text-white/60 text-xs mb-2">Paleta de colores:</p>
        <div className="flex space-x-1">
          {Object.values(game.palette).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded border border-white/20"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-white/10 my-4"></div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={() => window.location.href = `/worldGaming/juegos/editar/${game.id}`}
          className="flex-1 bg-blue-500/20 text-blue-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Edit className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">Editar</span>
        </button>
        <button
          onClick={() => handleDeleteGame(game.id)}
          className="bg-red-500/20 text-red-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );

  const categories = ['MOBA', 'FPS', 'Battle Royale', 'RPG', 'Estrategia', 'Deportes', 'Carreras', 'Lucha', 'Simulación', 'Otros'];

  return (
    <div className="space-y-6">
      <DynamicCardList
        title="Gestionar Juegos"
        subtitle="Administra los juegos de la plataforma"
        apiEndpoint="/api/games"
        cardFields={[
          { label: 'Nombre', key: 'name' },
          { label: 'Categoría', key: 'category' },
          { label: 'Estado', key: 'isActive' },
          { label: 'Dificultad', key: 'difficulty' }
        ]}
        mockData={games}
        renderCard={renderGameCard}
        isLoading={loading}
        newButtonText="Crear Juego"
        newButtonLink="/worldGaming/juegos/crear"
        filters={[
          {
            type: 'search',
            key: 'search',
            placeholder: 'Buscar juegos...'
          },
          {
            type: 'select',
            key: 'category',
            placeholder: 'Todas las categorías',
            options: categories.map(cat => ({ value: cat, label: cat }))
          },
          {
            type: 'select',
            key: 'status',
            placeholder: 'Todos los estados',
            options: [
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' }
            ]
          }
        ]}
      />
    </div>
  );
};

export default GestionarJuegos;
