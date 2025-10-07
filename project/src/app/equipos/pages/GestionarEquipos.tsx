import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomSelect } from '../../shared/components/ui';
import {
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  Trophy,
  Gamepad2,
  Star,
  Calendar,
  Target,
  TrendingUp,
  X,
  User
} from 'lucide-react';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';

interface Player {
  id: string;
  name: string;
  role: string;
  experience: number;
}

interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
}

interface Team {
  id: string;
  name: string;
  description: string;
  logo?: string;
  image: string;
  captains: {
    gameId: string;
    gameName: string;
    captainName: string;
  }[];
  players: {
    titulares: Player[];
    suplentes: Player[];
  };
  gameRequirements: GameRequirement[];
  isActive: boolean;
  createdAt: string;
  totalMatches: number;
  wins: number;
  losses: number;
}

const GestionarEquipos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'name'
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  // Detectar si se debe mostrar el modal de unirse a equipo
  useEffect(() => {
    if (location.state?.showJoinModal) {
      setShowJoinModal(true);
      // Limpiar el estado para evitar que se muestre en futuras navegaciones
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Mock de equipos
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'ESTRAL ESPORTS',
      description: 'Equipo profesional de esports con experiencia en múltiples juegos',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      captains: [
        { gameId: '1', gameName: 'League of Legends', captainName: 'Alex Rodriguez' },
        { gameId: '2', gameName: 'Valorant', captainName: 'Sarah Chen' }
      ],
      players: {
        titulares: [
          { id: '1', name: 'Alex Rodriguez', role: 'Captain', experience: 5 },
          { id: '2', name: 'Sarah Chen', role: 'Player', experience: 3 },
          { id: '3', name: 'Carlos Garcia', role: 'Player', experience: 4 },
          { id: '4', name: 'Lisa Thompson', role: 'Player', experience: 2 },
          { id: '5', name: 'Juan Lopez', role: 'Player', experience: 6 }
        ],
        suplentes: [
          { id: '6', name: 'Emma Williams', role: 'Player', experience: 3 },
          { id: '7', name: 'Diego Perez', role: 'Player', experience: 4 }
        ]
      },
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends', titulares: 5, suplentes: 2, totalPlayers: 7 },
        { gameId: '2', gameName: 'Valorant', titulares: 5, suplentes: 2, totalPlayers: 7 }
      ],
      isActive: true,
      createdAt: '2024-01-15',
      totalMatches: 25,
      wins: 18,
      losses: 7
    },
    {
      id: '2',
      name: 'TIMBERS ESPORTS',
      description: 'Equipo emergente con gran potencial en FPS',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      captains: [
        { gameId: '2', gameName: 'Valorant', captainName: 'Sophie Taylor' },
        { gameId: '3', gameName: 'CS:GO', captainName: 'Mike Johnson' }
      ],
      players: {
        titulares: [
          { id: '8', name: 'Sophie Taylor', role: 'Captain', experience: 4 },
          { id: '9', name: 'Mike Johnson', role: 'Player', experience: 3 },
          { id: '10', name: 'Anna Davis', role: 'Player', experience: 2 },
          { id: '11', name: 'Roberto Hernandez', role: 'Player', experience: 5 },
          { id: '12', name: 'Rachel Clark', role: 'Player', experience: 3 }
        ],
        suplentes: [
          { id: '13', name: 'James Wilson', role: 'Player', experience: 2 }
        ]
      },
      gameRequirements: [
        { gameId: '2', gameName: 'Valorant', titulares: 5, suplentes: 1, totalPlayers: 6 },
        { gameId: '3', gameName: 'CS:GO', titulares: 5, suplentes: 1, totalPlayers: 6 }
      ],
      isActive: true,
      createdAt: '2024-02-20',
      totalMatches: 18,
      wins: 12,
      losses: 6
    },
    {
      id: '3',
      name: 'PIXEL ESPORTS',
      description: 'Equipo especializado en juegos de estrategia',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      captains: [
        { gameId: '4', gameName: 'Rocket League', captainName: 'Emma Williams' }
      ],
      players: {
        titulares: [
          { id: '14', name: 'Emma Williams', role: 'Captain', experience: 6 },
          { id: '15', name: 'Lucas White', role: 'Player', experience: 4 },
          { id: '16', name: 'Natalie Anderson', role: 'Player', experience: 3 }
        ],
        suplentes: [
          { id: '17', name: 'David Martinez', role: 'Player', experience: 2 }
        ]
      },
      gameRequirements: [
        { gameId: '4', gameName: 'Rocket League', titulares: 3, suplentes: 1, totalPlayers: 4 }
      ],
      isActive: false,
      createdAt: '2024-03-10',
      totalMatches: 12,
      wins: 8,
      losses: 4
    }
  ]);

  // Filtrar equipos
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      team.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'active' && team.isActive) ||
      (filters.status === 'inactive' && !team.isActive);
    return matchesSearch && matchesStatus;
  });

  // Ordenar equipos
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'matches':
        return b.totalMatches - a.totalMatches;
      case 'wins':
        return b.wins - a.wins;
      default:
        return 0;
    }
  });

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const getWinRate = (wins: number, total: number) => {
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  };

  const openTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
    // Al abrir el modal, seleccionar el primer juego automáticamente
    if (team.gameRequirements.length > 0) {
      setSelectedGame(team.gameRequirements[0].gameId);
    } else {
      setSelectedGame('all');
    }
  };

  const closeTeamDetails = () => {
    setShowDetailsModal(false);
    setSelectedTeam(null);
    setActiveTab('general');
    setSelectedGame('all');
  };



  // Función para renderizar la card personalizada
  const renderTeamCard = (team: Team) => (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
      {/* Imagen de fondo con overlay - pegada a los bordes */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={team.image}
          alt="Team background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Badges en la imagen - Específicos para equipos */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {/* Badge de estado del equipo */}
          <div className={`px-2 sm:px-3 py-1 rounded-full font-bold text-xs ${team.isActive
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
            }`}>
            {team.isActive ? 'ACTIVO' : 'INACTIVO'}
          </div>

          {/* Badge de nivel del equipo */}
          <div className="px-2 sm:px-3 py-1 rounded-full font-bold text-xs bg-white/20 text-white backdrop-blur-sm">
            {team.totalMatches > 20 ? 'PROFESIONAL' : team.totalMatches > 10 ? 'SEMI-PRO' : 'AMATEUR'}
          </div>

          {/* Badge de juegos */}
          <div className="px-2 sm:px-3 py-1 rounded-full font-bold text-xs bg-purple-500 text-white">
            {team.gameRequirements.length} JUEGO{team.gameRequirements.length !== 1 ? 'S' : ''}
          </div>
        </div>

        {/* Badge de estadísticas - Responsive */}
        <div className="absolute top-3 right-3 bg-gray-800/80 text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs backdrop-blur-sm">
          {getWinRate(team.wins, team.totalMatches)}% WR
        </div>
      </div>

      <div className="relative p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Título y juego */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1">{team.name}</h3>
            <p className="text-white/80 text-xs sm:text-sm">Equipo de Esports</p>
          </div>

          {/* Detalles del equipo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3 sm:mb-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
              <span className="text-white/60">{team.players.titulares.length + team.players.suplentes.length} jugadores</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
              <span className="text-white/60">{team.totalMatches} partidos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
              <span className="text-white/60">{team.createdAt}</span>
            </div>
          </div>

          {/* Estadísticas del equipo */}
          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Rendimiento</span>
              <span className="text-white/60">{team.wins}W - {team.losses}L</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
              <div className="bg-green-400 h-1.5 sm:h-2 rounded-full" style={{ width: `${getWinRate(team.wins, team.totalMatches)}%` }}></div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-auto">
            <div className="flex space-x-1 sm:space-x-2 mb-2">
              <button
                onClick={() => openTeamDetails(team)}
                className="flex-1 bg-gray-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Ver Detalles</span>
                <span className="sm:hidden">Ver</span>
              </button>
              <button
                onClick={() => console.log('Editar equipo:', team.id)}
                className="bg-blue-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
                title="Editar equipo"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => deleteTeam(team.id)}
                className="bg-red-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center"
                title="Eliminar equipo"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="text-right">
              <span className="text-white/60 text-xs">Creado: {team.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-transparent p-6">
      <style>{`
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      <div className="max-w-7xl mx-auto">

                 {/* Modal de Unirse a Equipo */}
         {showJoinModal && (
           <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
             <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/30 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
               {/* Header del Modal */}
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                     <Users className="w-8 h-8 text-white" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-white mb-1">Unirse a un Equipo</h2>
                     <p className="text-white/60 text-sm">Explora equipos disponibles y solicita unirte</p>
                   </div>
                 </div>
                 <button
                   onClick={() => setShowJoinModal(false)}
                   className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>

               {/* Filtros para equipos */}
               <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg mb-6">
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                   <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                     <div className="flex-1 relative">
                       <input
                         type="text"
                         placeholder="Buscar equipos..."
                         className="w-full pl-4 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                       />
                     </div>
                     <div className="flex items-center space-x-2">
                       <CustomSelect
                         options={[
                           { value: '', label: 'Todos los juegos' },
                           { value: 'lol', label: 'League of Legends' },
                           { value: 'valorant', label: 'Valorant' },
                           { value: 'csgo', label: 'CS:GO' },
                           { value: 'dota', label: 'Dota 2' }
                         ]}
                         value=""
                         onChange={() => {}}
                         placeholder="Todos los juegos"
                         className="min-w-[150px]"
                       />
                     </div>
                   </div>
                 </div>
               </div>

               {/* Lista de equipos disponibles */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                 {teams.filter(team => team.isActive).map((team) => (
                   <div key={team.id} className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-200">
                     <div className="flex items-center space-x-3 mb-3">
                       <img
                         src={team.image}
                         alt={team.name}
                         className="w-12 h-12 rounded-lg object-cover"
                       />
                       <div className="flex-1">
                         <h3 className="text-white font-semibold">{team.name}</h3>
                         <p className="text-white/60 text-sm">{team.gameRequirements.length} juegos</p>
                       </div>
                       <div className="text-right">
                         <div className="text-green-400 font-semibold">{getWinRate(team.wins, team.totalMatches)}%</div>
                         <div className="text-white/40 text-xs">Win Rate</div>
                       </div>
                     </div>
                     <p className="text-white/80 text-sm mb-3 line-clamp-2">{team.description}</p>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2 text-xs text-white/60">
                         <Users className="w-3 h-3" />
                         <span>{team.players.titulares.length + team.players.suplentes.length} jugadores</span>
                       </div>
                       <button
                         onClick={() => {
                           // Aquí iría la lógica para solicitar unirse al equipo
                           console.log('Solicitar unirse a:', team.name);
                           setShowJoinModal(false);
                         }}
                         className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm font-medium"
                       >
                         Solicitar Unirse
                       </button>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="flex justify-end mt-6 space-x-3">
                 <button
                   onClick={() => setShowJoinModal(false)}
                   className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                 >
                   <X className="w-4 h-4" />
                   <span>Cerrar</span>
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Modal de Detalles del Equipo */}
         {showDetailsModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/30 rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={selectedTeam.image}
                      alt="Team logo"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${selectedTeam.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedTeam.name}</h2>
                    <p className="text-white/60 text-sm mb-2">{selectedTeam.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-white/40">ID: {selectedTeam.id}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/40">Creado: {selectedTeam.createdAt}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeTeamDetails}
                  className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Pestañas */}
              <div className="flex space-x-1 mb-6 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'general'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Información General</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('players');
                    // Al cambiar a la pestaña de jugadores, seleccionar el primer juego automáticamente
                    if (selectedTeam && selectedTeam.gameRequirements.length > 0) {
                      setSelectedGame(selectedTeam.gameRequirements[0].gameId);
                    } else {
                      setSelectedGame('all');
                    }
                  }}
                  className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'players'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Jugadores por Juego</span>
                </button>
              </div>

              {/* Contenido de las pestañas */}
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información General */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span>Información General</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${selectedTeam.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-white/60">Estado:</span>
                          </div>
                          <span className={`font-semibold ${selectedTeam.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedTeam.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="text-white/60">Fecha de Creación:</span>
                          </div>
                          <span className="text-white font-medium">{selectedTeam.createdAt}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Gamepad2 className="w-4 h-4 text-yellow-400" />
                            <span className="text-white/60">Total de Juegos:</span>
                          </div>
                          <span className="text-blue-400 font-semibold text-lg">{selectedTeam.gameRequirements.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span>Estadísticas de Torneo</span>
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-3xl font-bold text-white mb-1">{selectedTeam.totalMatches}</div>
                          <div className="text-white/60 text-sm font-medium">Partidos</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <div className="text-3xl font-bold text-green-400 mb-1">{selectedTeam.wins}</div>
                          <div className="text-white/60 text-sm font-medium">Victorias</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                          <div className="text-3xl font-bold text-purple-400 mb-1">{getWinRate(selectedTeam.wins, selectedTeam.totalMatches)}%</div>
                          <div className="text-white/60 text-sm font-medium">Win Rate</div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Derrotas:</span>
                          <span className="text-red-400 font-semibold">{selectedTeam.losses}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Juegos y Capitanes */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Gamepad2 className="w-5 h-5 text-yellow-400" />
                        <span>Juegos y Capitanes</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedTeam.gameRequirements.map((game, index) => {
                          const captain = selectedTeam.captains.find(c => c.gameId === game.gameId);
                          return (
                            <div key={index} className="bg-gradient-to-br from-white/8 to-white/12 rounded-lg p-4 border border-white/15 shadow-md">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-bold text-lg">{game.gameName}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
                                    {game.titulares}T
                                  </span>
                                  <span className="text-white/40">+</span>
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                                    {game.suplentes}S
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Star className="w-4 h-4 text-blue-400" />
                                    <span className="text-white/60 text-sm">Capitán:</span>
                                  </div>
                                  <div className="text-blue-400 font-semibold">{captain?.captainName || 'No asignado'}</div>
                                </div>
                                <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    <span className="text-white/60 text-sm">Total:</span>
                                  </div>
                                  <div className="text-purple-400 font-semibold text-lg">{game.totalPlayers}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'players' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Jugadores por Juego</h3>

                    {/* Selector de Juego */}
                    <div className="flex items-center space-x-3">
                      <label className="text-white/60 text-sm font-medium">Juego seleccionado:</label>
                      <CustomSelect
                        options={selectedTeam.gameRequirements.map((game) => ({
                          value: game.gameId,
                          label: game.gameName
                        }))}
                        value={selectedGame}
                        onChange={(value) => setSelectedGame(value)}
                        placeholder="Seleccionar juego..."
                        className="min-w-[150px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedTeam.gameRequirements
                      .filter(game => game.gameId === selectedGame)
                      .length > 0 ? (
                      selectedTeam.gameRequirements
                        .filter(game => game.gameId === selectedGame)
                        .map((game, index) => {
                          const captain = selectedTeam.captains.find(c => c.gameId === game.gameId);
                          return (
                            <div key={index} className="bg-gradient-to-br from-white/10 to-white/15 rounded-lg p-4 border border-white/20 shadow-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold text-white">{game.gameName}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-400 font-semibold">{game.titulares}T</span>
                                  <span className="text-white/40">+</span>
                                  <span className="text-blue-400 font-semibold">{game.suplentes}S</span>
                                </div>
                              </div>

                              {/* Capitán */}
                              <div className="mb-4 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                <div className="flex items-center justify-between">
                                  <span className="text-white/60 text-sm">Capitán:</span>
                                  <span className="text-blue-400 font-semibold">{captain?.captainName || 'No asignado'}</span>
                                </div>
                              </div>

                              {/* Titulares */}
                              <div className="mb-4">
                                <h5 className="text-green-400 font-semibold mb-2 flex items-center">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                  Titulares ({game.titulares})
                                </h5>
                                <div className="space-y-2">
                                  {selectedTeam.players.titulares.slice(0, game.titulares).map((player, playerIndex) => (
                                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                      <div>
                                        <div className="text-white font-medium">{player.name}</div>
                                        <div className="text-white/60 text-xs">{player.role}</div>
                                      </div>
                                      <div className="text-white/60 text-sm">{player.experience} años exp.</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Suplentes */}
                              <div>
                                <h5 className="text-blue-400 font-semibold mb-2 flex items-center">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                  Suplentes ({game.suplentes})
                                </h5>
                                <div className="space-y-2">
                                  {selectedTeam.players.suplentes.slice(0, game.suplentes).map((player, playerIndex) => (
                                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                      <div>
                                        <div className="text-white font-medium">{player.name}</div>
                                        <div className="text-white/60 text-xs">{player.role}</div>
                                      </div>
                                      <div className="text-white/60 text-sm">{player.experience} años exp.</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <div className="text-white/60 text-lg">No se encontró información para este juego</div>
                        <div className="text-white/40 text-sm mt-2">Selecciona otro juego de la lista</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={closeTeamDetails}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cerrar</span>
                </button>
                <button
                  onClick={() => console.log('Editar equipo:', selectedTeam.id)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Equipo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Equipos */}
        <DynamicCardList
          apiEndpoint=""
          mockData={sortedTeams}
          title="Equipos profesionales"
          subtitle="Lista de equipos profesionales"
          newButtonText="Crear Equipo"
          newButtonLink="/worldGaming/equipos/crear"
          newButtonState={{ from: '/worldGaming/equipos' }}
          renderCard={renderTeamCard}
          filters={[
            {
              type: 'search',
              key: 'search',
              placeholder: 'Buscar equipos...'
            },
            {
              type: 'select',
              key: 'status',
              placeholder: 'Todos los estados',
              options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ]
            },
            {
              type: 'select',
              key: 'sortBy',
              placeholder: 'Ordenar por',
              options: [
                { value: 'name', label: 'Ordenar por nombre' },
                { value: 'created', label: 'Ordenar por fecha' },
                { value: 'matches', label: 'Ordenar por partidos' },
                { value: 'wins', label: 'Ordenar por victorias' }
              ]
            }
          ]}
          className="space-y-6"
        />
      </div>
    </div>
  );
};

export default GestionarEquipos;
