import React, { useState } from 'react';
import { Trophy, Users, Calendar, Star, Play, Zap, Edit, Trash2, GitBranch, X, Bell, TrendingUp } from 'lucide-react';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import { useConfirmation } from '../../shared/contexts/ConfirmationContext';
import TournamentBracket from '../components/TournamentBracket';
import StandingsTable from '../components/StandingsTable';
import BracketVisualChart from '../components/BracketVisualChart';
import TeamStatsSidebar from '../components/TeamStatsSidebar';
import { useNotificationCenter } from '../../shared/contexts/NotificationCenterContext';
import { useNotificationModal } from '../../shared/contexts/NotificationModalContext';

interface Tournament {
  id: number;
  name: string;
  game: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  entryFee: number;
  category: string;
  image: string;
  phase?: 'initial' | 'final';
}

const TorneosPage: React.FC = () => {
  const { showConfirm } = useConfirmation();
  const { addNotification } = useNotificationCenter();
  const { openNotificationModal } = useNotificationModal();
  const [showBracketModal, setShowBracketModal] = useState(false);
  const [selectedTournamentForBracket, setSelectedTournamentForBracket] = useState<Tournament | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedTournamentForChart, setSelectedTournamentForChart] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTeamForSidebar, setSelectedTeamForSidebar] = useState<string>('');

  const handleTeamClick = (participant: any) => {
    console.log('=== DEBUG: Team clicked in TorneoPage ===');
    console.log('Participant:', participant);
    setShowSidebar(true);
    setSelectedTeamForSidebar(participant.name);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSelectedTeamForSidebar('');
  };
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "FPS Championship 2025",
      game: "Counter-Strike 2",
      prize: "$10,000",
      participants: 128,
      maxParticipants: 256,
      startDate: "2025-01-15",
      endDate: "2025-01-20",
      status: "upcoming",
      difficulty: "expert",
      entryFee: 50,
      category: "FPS",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      phase: "initial"
    },
    {
      id: 2,
      name: "RPG Master Tournament",
      game: "World of Warcraft",
      prize: "$5,000",
      participants: 64,
      maxParticipants: 128,
      startDate: "2025-01-22",
      endDate: "2025-01-25",
      status: "upcoming",
      difficulty: "intermediate",
      entryFee: 25,
      category: "RPG",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      phase: "initial"
    },
    {
      id: 3,
      name: "Strategy Wars",
      game: "League of Legends",
      prize: "$15,000",
      participants: 256,
      maxParticipants: 512,
      startDate: "2025-01-10",
      endDate: "2025-01-18",
      status: "active",
      difficulty: "expert",
      entryFee: 75,
      category: "MOBA",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      phase: "final"
    },
    {
      id: 4,
      name: "Battle Royale Elite",
      game: "Fortnite",
      prize: "$8,000",
      participants: 512,
      maxParticipants: 1024,
      startDate: "2025-01-05",
      endDate: "2025-01-12",
      status: "completed",
      difficulty: "beginner",
      entryFee: 15,
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      phase: "final"
    },
    {
      id: 5,
      name: "Speed Runner Challenge",
      game: "Valorant",
      prize: "$12,000",
      participants: 96,
      maxParticipants: 128,
      startDate: "2025-01-28",
      endDate: "2025-02-02",
      status: "upcoming",
      difficulty: "intermediate",
      entryFee: 40,
      category: "FPS",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      phase: "initial"
    },
    {
      id: 6,
      name: "Card Game Masters",
      game: "Hearthstone",
      prize: "$6,000",
      participants: 32,
      maxParticipants: 64,
      startDate: "2025-01-30",
      endDate: "2025-02-01",
      status: "upcoming",
      difficulty: "beginner",
      entryFee: 20,
      category: "Card Game",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      phase: "initial"
    }
  ]);

  const handleDeleteTournament = async (tournamentId: number) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Torneo',
      message: '¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      setTournaments(prev => prev.filter(tournament => tournament.id !== tournamentId));
    }
  };

  const handleEditTournament = (tournamentId: number) => {
    // Aquí iría la navegación a la página de edición
    console.log('Editar torneo:', tournamentId);
    window.location.href = `/worldGaming/torneos/editar/${tournamentId}`;
  };

  const handleTestNotification = () => {
    addNotification({
      type: 'tournament',
      title: 'Nuevo Torneo Disponible',
      message: 'Se ha creado un nuevo torneo de CS2. ¡Inscríbete ahora!',
      priority: 'high',
      action: {
        label: 'Ver Torneo',
        url: '/torneos/nuevo'
      }
    });
  };

  const handleOpenNotificationModal = () => {
    openNotificationModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'initial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'final': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'initial': return 'FASE INICIAL';
      case 'final': return 'FASE FINAL';
      default: return 'FASE DESCONOCIDA';
    }
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer hover:border-white/20 relative">
      {/* Imagen del torneo */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={tournament.image}
          alt={tournament.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tournament.status)}`}>
              {getStatusText(tournament.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tournament.difficulty)}`}>
              {tournament.difficulty.toUpperCase()}
            </span>
          </div>
          {tournament.phase && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPhaseColor(tournament.phase)}`}>
              {getPhaseText(tournament.phase)}
            </span>
          )}
        </div>

        {/* Premio */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-lg font-bold text-sm border border-slate-500/30">
          {tournament.prize}
        </div>

        {/* Botones flotantes para Ver Bracket y Gráfico - Solo en la imagen */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedTournamentForBracket(tournament);
                setShowBracketModal(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-110 transform"
            >
              <GitBranch className="w-6 h-6" />
              <span className="text-sm font-bold">Bracket</span>
            </button>
            <button
              onClick={() => {
                setSelectedTournamentForChart(tournament);
                setShowChartModal(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl hover:scale-110 transform"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-bold">Gráfico</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">
          {tournament.name}
        </h3>
        <p className="text-white/60 text-sm mb-4">{tournament.game}</p>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-300" />
            <span className="text-white/80 text-sm">
              {tournament.participants}/{tournament.maxParticipants}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span className="text-white/80 text-sm">
              {new Date(tournament.startDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Progreso de participantes */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Participantes</span>
            <span>{Math.round((tournament.participants / tournament.maxParticipants) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
            />
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Botones de acción */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
              <Play className="w-4 h-4" />
              <span>Unirse</span>
            </button>
            <button
              onClick={() => handleEditTournament(tournament.id)}
              className="bg-blue-500/20 text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => handleDeleteTournament(tournament.id)}
              className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">Entrada:</span>
            <span className="text-white font-semibold">${tournament.entryFee}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const filters = [
    {
      type: 'search' as const,
      key: 'name',
      placeholder: 'Buscar torneos...'
    },
    {
      type: 'select' as const,
      key: 'category',
      placeholder: 'Categoría',
      options: [
        { value: 'FPS', label: 'FPS' },
        { value: 'RPG', label: 'RPG' },
        { value: 'MOBA', label: 'MOBA' },
        { value: 'Battle Royale', label: 'Battle Royale' },
        { value: 'Card Game', label: 'Card Game' }
      ]
    },
    {
      type: 'select' as const,
      key: 'status',
      placeholder: 'Estado',
      options: [
        { value: 'upcoming', label: 'Próximos' },
        { value: 'active', label: 'Activos' },
        { value: 'completed', label: 'Completados' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* DynamicCardList */}
      <DynamicCardList
        apiEndpoint=""
        cardFields={[]}
        filters={filters}
        pagination={true}
        itemsPerPageOptions={[6, 12, 18]}
        className=""
        mockData={tournaments}
        renderCard={renderTournamentCard}
        title="Torneos"
        subtitle="Compite con los mejores jugadores del mundo"
        newButtonText="Crear Torneo"
        newButtonLink="/worldGaming/torneos/crear"
      />

      {/* Botones de prueba de notificaciones */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handleTestNotification}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Bell className="h-5 w-5" />
          Probar Notificación
        </button>
        <button
          onClick={handleOpenNotificationModal}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Bell className="h-5 w-5" />
          Abrir Centro de Notificaciones
        </button>
      </div>

      {/* Estadísticas generales */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-slate-300" />
            <div>
              <p className="text-white/60 text-sm">Total Torneos</p>
              <p className="text-white text-2xl font-bold">{tournaments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-slate-300" />
            <div>
              <p className="text-white/60 text-sm">Participantes</p>
              <p className="text-white text-2xl font-bold">
                {tournaments.reduce((sum, t) => sum + t.participants, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-slate-300" />
            <div>
              <p className="text-white/60 text-sm">Premio Total</p>
              <p className="text-white text-2xl font-bold">$56,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-slate-300" />
            <div>
              <p className="text-white/60 text-sm">Activos</p>
              <p className="text-white text-2xl font-bold">
                {tournaments.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Bracket */}
      {showBracketModal && selectedTournamentForBracket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Bracket del Torneo</h2>
                <p className="text-white/80 mt-1">{selectedTournamentForBracket.name}</p>
              </div>
              <button
                onClick={() => setShowBracketModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <TournamentBracket
                tournamentId={selectedTournamentForBracket.id.toString()}
                tournamentName={selectedTournamentForBracket.name}
                format="single_elimination"
                participants={[
                  'Estral Esports', 'Timbers Esports', 'Atheris Esports', 'Pixel Esports',
                  'Chivas Esports', 'Infinity Esports', 'Mexico Esports Team'
                ]}
                                  matches={[
                    {
                      id: '1',
                      round: 1,
                      matchNumber: 1,
                      player1: 'Estral Esports',
                      player2: 'Timbers Esports',
                      player1Score: 16,
                      player2Score: 14,
                      status: 'completed',
                      winner: 'Estral Esports',
                      scheduledTime: '2024-03-15 14:00',
                      duration: '45 min'
                    },
                    {
                      id: '2',
                      round: 1,
                      matchNumber: 2,
                      player1: 'Atheris Esports',
                      player2: 'Pixel Esports',
                      player1Score: 0,
                      player2Score: 0,
                      status: 'pending',
                      winner: '',
                      scheduledTime: '2024-03-15 16:00',
                      duration: '45 min'
                    },
                    {
                      id: '3',
                      round: 2,
                      matchNumber: 1,
                      player1: 'Estral Esports',
                      player2: 'TBD',
                      player1Score: 0,
                      player2Score: 0,
                      status: 'pending',
                      winner: '',
                      scheduledTime: '2024-03-16 14:00',
                      duration: '45 min'
                    }
                  ]}
                onMatchUpdate={(matchId: string, winner: string, scores: { player1: number, player2: number }) => {
                  console.log('Match updated:', matchId, winner, scores);
                  // Aquí se actualizaría el resultado en la base de datos
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal del Gráfico */}
      {showChartModal && selectedTournamentForChart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowChartModal(false)}>
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Gráfico del Torneo</h2>
                <p className="text-white/80 mt-1">{selectedTournamentForChart.name}</p>
              </div>
              <button
                onClick={() => setShowChartModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('standings')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === 'standings'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tabla de Calificaciones</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bracket')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === 'bracket'
                  ? 'text-white border-b-2 border-green-500 bg-green-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Gráfico de Fase Final</span>
                </div>
              </button>
            </div>

            <div className="p-6 overflow-auto h-[calc(90vh-200px)]">
              {activeTab === 'standings' ? (
                <StandingsTable
                  participants={[
                    { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' },
                    { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' },
                    { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' },
                    { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' },
                    { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' },
                    { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' },
                    { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }
                  ]}
                  standings={[
                    { participant: { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' }, position: 1, points: 14, matchesPlayed: 6, perfectWins: 3, wins: 2, draws: 1, losses: 0, mapDifference: 8, roundDifference: 35 },
                    { participant: { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' }, position: 2, points: 10, matchesPlayed: 6, perfectWins: 2, wins: 1, draws: 2, losses: 1, mapDifference: 4, roundDifference: 15 },
                    { participant: { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' }, position: 3, points: 7, matchesPlayed: 6, perfectWins: 0, wins: 3, draws: 1, losses: 2, mapDifference: 0, roundDifference: 0 },
                    { participant: { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' }, position: 4, points: 6, matchesPlayed: 6, perfectWins: 1, wins: 0, draws: 3, losses: 2, mapDifference: 0, roundDifference: 1 },
                    { participant: { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' }, position: 5, points: 6, matchesPlayed: 6, perfectWins: 0, wins: 1, draws: 4, losses: 1, mapDifference: 0, roundDifference: -1 },
                    { participant: { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' }, position: 6, points: 4, matchesPlayed: 6, perfectWins: 1, wins: 0, draws: 1, losses: 4, mapDifference: -5, roundDifference: -17 },
                    { participant: { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }, position: 7, points: 2, matchesPlayed: 6, perfectWins: 0, wins: 0, draws: 2, losses: 4, mapDifference: -7, roundDifference: -33 }
                  ]}
                  tournamentName={selectedTournamentForChart.name}
                  onClose={() => setShowChartModal(false)}
                  isEmbedded={true}
                  onTeamClick={handleTeamClick}
                />
              ) : (
                <BracketVisualChart
                  participants={[
                    { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' },
                    { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' },
                    { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' },
                    { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' },
                    { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' },
                    { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' },
                    { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }
                  ]}
                  configuredMatches={[
                    {
                      id: '1',
                      round: 1,
                      matchNumber: 1,
                      player1: 'Estral Esports',
                      player2: 'Timbers Esports',
                      scheduledTime: '2024-03-15 14:00'
                    },
                    {
                      id: '2',
                      round: 1,
                      matchNumber: 2,
                      player1: 'Atheris Esports',
                      player2: 'Pixel Esports',
                      scheduledTime: '2024-03-15 16:00'
                    }
                  ]}
                  tournamentName={selectedTournamentForChart.name}
                  format="single_elimination"
                  onSaveConfiguration={(matches) => console.log('Configuration saved:', matches)}
                  onClose={() => setShowChartModal(false)}
                  isEmbedded={true}
                  currentPhase="final"
                  onPhaseChange={(phase) => console.log('Phase changed to:', phase)}
                  isReadOnly={true}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barra lateral de estadísticas de equipos */}
      {showSidebar && (
        <TeamStatsSidebar
          isOpen={showSidebar}
          onClose={handleCloseSidebar}
          tournamentName={selectedTournamentForChart?.name || 'Torneo'}
          initialTeam={selectedTeamForSidebar}
          showBackButton={false}
        />
      )}
    </div>
  );
};

export default TorneosPage;