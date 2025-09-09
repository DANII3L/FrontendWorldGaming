import React, { useState, useEffect } from 'react';
import {
    Trophy,
    Users,
    Calendar,
    Crown,
    Target,
    Clock,
    MapPin,
    DollarSign,
    TrendingUp,
    GitBranch,
    X
} from 'lucide-react';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import TournamentDetailsModal from '../components/TournamentDetailsModal';
import TournamentBracket from '../components/TournamentBracket';
import StandingsTable from '../components/StandingsTable';
import BracketVisualChart from '../components/BracketVisualChart';
import TeamStatsSidebar from '../components/TeamStatsSidebar';

interface Tournament {
    id: string;
    name: string;
    game: string;
    startDate: string;
    endDate: string;
    participants: number;
    maxParticipants: number;
    prize: string;
    status: 'active' | 'upcoming' | 'completed';
    myRank?: number;
    myScore?: number;
    myProgress?: number;
    registrationDate: string;
    category: string;
    difficulty: string;
    location: string;
    description: string;
    phase?: 'initial' | 'final';
}

const MisTorneosPage: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showBracketModal, setShowBracketModal] = useState(false);
    const [selectedTournamentForBracket, setSelectedTournamentForBracket] = useState<Tournament | null>(null);
    const [showChartModal, setShowChartModal] = useState(false);
    const [selectedTournamentForChart, setSelectedTournamentForChart] = useState<Tournament | null>(null);
    const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedTeamForSidebar, setSelectedTeamForSidebar] = useState<string>('');

    const handleTeamClick = (participant: any) => {
        setShowSidebar(true);
        setSelectedTeamForSidebar(participant.name);
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false);
        setSelectedTeamForSidebar('');
    };

    useEffect(() => {
        const loadTournaments = async () => {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockTournaments: Tournament[] = [
                {
                    id: '1',
                    name: 'Liga de Campeones 2024',
                    game: 'League of Legends',
                    startDate: '2024-03-15',
                    endDate: '2024-04-15',
                    participants: 128,
                    maxParticipants: 256,
                    prize: '$50,000',
                    status: 'active',
                    myRank: 15,
                    myScore: 2450,
                    myProgress: 75,
                    registrationDate: '2024-02-20',
                    category: 'MOBA',
                    difficulty: 'Avanzado',
                    location: 'Online',
                    description: 'Torneo oficial de League of Legends con premios increíbles',
                    phase: 'final'
                },
                {
                    id: '2',
                    name: 'Battle Royale Championship',
                    game: 'Fortnite',
                    startDate: '2024-03-20',
                    endDate: '2024-03-25',
                    participants: 89,
                    maxParticipants: 100,
                    prize: '$25,000',
                    status: 'upcoming',
                    myRank: 8,
                    myScore: 1890,
                    myProgress: 60,
                    registrationDate: '2024-03-01',
                    category: 'Battle Royale',
                    difficulty: 'Intermedio',
                    location: 'Online',
                    description: 'Competición intensa de Fortnite con eliminatorias diarias',
                    phase: 'initial'
                },
                {
                    id: '3',
                    name: 'CS:GO Pro League',
                    game: 'Counter-Strike 2',
                    startDate: '2024-02-10',
                    endDate: '2024-03-10',
                    participants: 64,
                    maxParticipants: 64,
                    prize: '$75,000',
                    status: 'completed',
                    myRank: 3,
                    myScore: 3200,
                    myProgress: 100,
                    registrationDate: '2024-01-15',
                    category: 'FPS',
                    difficulty: 'Profesional',
                    location: 'Madrid, España',
                    description: 'Liga profesional de Counter-Strike con los mejores equipos',
                    phase: 'final'
                },
                {
                    id: '4',
                    name: 'Valorant Masters',
                    game: 'Valorant',
                    startDate: '2024-04-01',
                    endDate: '2024-04-30',
                    participants: 156,
                    maxParticipants: 200,
                    prize: '$40,000',
                    status: 'upcoming',
                    myRank: 22,
                    myScore: 2100,
                    myProgress: 45,
                    registrationDate: '2024-03-10',
                    category: 'FPS Táctico',
                    difficulty: 'Avanzado',
                    location: 'Barcelona, España',
                    description: 'Masters de Valorant con formato de eliminación directa',
                    phase: 'initial'
                },
                {
                    id: '5',
                    name: 'Rocket League Cup',
                    game: 'Rocket League',
                    startDate: '2024-03-25',
                    endDate: '2024-04-05',
                    participants: 45,
                    maxParticipants: 64,
                    prize: '$15,000',
                    status: 'active',
                    myRank: 5,
                    myScore: 1780,
                    myProgress: 85,
                    registrationDate: '2024-03-05',
                    category: 'Deportes',
                    difficulty: 'Intermedio',
                    location: 'Online',
                    description: 'Copa de Rocket League con partidas emocionantes',
                    phase: 'final'
                },
                {
                    id: '6',
                    name: 'Dota 2 International Qualifiers',
                    game: 'Dota 2',
                    startDate: '2024-05-01',
                    endDate: '2024-06-01',
                    participants: 200,
                    maxParticipants: 512,
                    prize: '$100,000',
                    status: 'upcoming',
                    myRank: 67,
                    myScore: 1650,
                    myProgress: 30,
                    registrationDate: '2024-04-01',
                    category: 'MOBA',
                    difficulty: 'Profesional',
                    location: 'Online',
                    description: 'Clasificatorias para el International de Dota 2',
                    phase: 'initial'
                }
            ];

            setTournaments(mockTournaments);
            setLoading(false);
        };

        loadTournaments();
    }, []);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'En Progreso';
            case 'upcoming':
                return 'Próximo';
            case 'completed':
                return 'Completado';
            default:
                return 'Desconocido';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Profesional':
                return 'text-orange-500';
            case 'Avanzado':
                return 'text-orange-400';
            case 'Intermedio':
                return 'text-teal-400';
            case 'Principiante':
                return 'text-green-400';
            default:
                return 'text-gray-400';
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
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 group relative overflow-hidden">
            {/* Imagen de fondo con botones flotantes */}
            <div className="relative h-48 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

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

            <div className="relative p-4 sm:p-6">
                {/* Badges de estado y fase */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div className={`px-3 py-1 rounded-lg font-bold text-xs ${tournament.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                        tournament.status === 'upcoming' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                            'bg-gradient-to-r from-blue-300 to-blue-400 text-white'
                        }`}>
                        {getStatusText(tournament.status)}
                    </div>
                    {tournament.phase && (
                        <div className={`px-3 py-1 rounded-lg font-bold text-xs border ${getPhaseColor(tournament.phase)}`}>
                            {getPhaseText(tournament.phase)}
                        </div>
                    )}
                </div>

                {/* Badge de ranking */}
                {tournament.myRank && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-3 py-1 rounded-lg font-bold text-xs border border-yellow-500/30 z-10">
                        #{tournament.myRank}
                    </div>
                )}

                <div className="pt-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors truncate">
                                {tournament.name}
                            </h3>
                            <p className="text-white/70 text-xs sm:text-sm mb-2 line-clamp-2">{tournament.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-white/60 text-xs sm:text-sm">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="truncate">{tournament.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className={`truncate ${getDifficultyColor(tournament.difficulty)}`}>{tournament.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas del usuario */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
                        {tournament.myScore && (
                            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white/60 text-xs mb-1 truncate">Mi Puntuación</p>
                                        <p className="text-white font-semibold text-xs sm:text-sm truncate">{tournament.myScore}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tournament.myProgress && (
                            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white/60 text-xs mb-1 truncate">Progreso</p>
                                        <p className="text-white font-semibold text-xs sm:text-sm truncate">{tournament.myProgress}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-white/60 text-xs mb-1 truncate">Participantes</p>
                                    <p className="text-white font-semibold text-xs sm:text-sm truncate">{tournament.participants}/{tournament.maxParticipants}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-white/60 text-xs mb-1 truncate">Premio</p>
                                    <p className="text-white font-semibold text-xs sm:text-sm truncate">{tournament.prize}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    {tournament.myProgress && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-white/60 text-xs mb-2">
                                <span>Progreso del torneo</span>
                                <span>{tournament.myProgress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${tournament.myProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Fechas */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-white/60 text-xs sm:text-sm mb-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">Inicio: {new Date(tournament.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">Fin: {new Date(tournament.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => openTournamentDetails(tournament)}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base"
                            >
                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">Ver Detalles</span>
                            </button>
                            <button className="bg-gray-700/50 text-white/90 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/30 flex items-center justify-center">
                                <Crown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const openTournamentDetails = (tournament: Tournament) => {
        setSelectedTournament(tournament);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTournament(null);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <style>{`
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                `}</style>
            <DynamicCardList
                title="Mis Torneos"
                subtitle="Torneos en los que estás participando"
                apiEndpoint="/api/tournaments/my"
                cardFields={[
                    { label: 'Nombre', key: 'name' },
                    { label: 'Juego', key: 'game' },
                    { label: 'Estado', key: 'status' },
                    { label: 'Progreso', key: 'myProgress' }
                ]}
                mockData={tournaments}
                renderCard={renderTournamentCard}
                isLoading={loading}
                filters={[
                    {
                        type: 'search',
                        key: 'search',
                        placeholder: 'Buscar mis torneos...'
                    },
                    {
                        type: 'select',
                        key: 'status',
                        options: [
                            { value: 'active', label: 'En Progreso' },
                            { value: 'upcoming', label: 'Próximos' },
                            { value: 'completed', label: 'Completados' }
                        ]
                    }
                ]}
            />

            {/* Modal de detalles del torneo */}
            <TournamentDetailsModal
                tournament={selectedTournament}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

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
                                tournamentId={selectedTournamentForBracket.id}
                                tournamentName={selectedTournamentForBracket.name}
                                format="single_elimination"
                                participants={[
                                    'Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta',
                                    'Team Echo', 'Team Foxtrot', 'Team Golf', 'Team Hotel'
                                ]}
                                matches={[
                                    {
                                        id: '1',
                                        round: 1,
                                        matchNumber: 1,
                                        player1: 'Team Alpha',
                                        player2: 'Team Beta',
                                        player1Score: 16,
                                        player2Score: 14,
                                        status: 'completed',
                                        winner: 'Team Alpha',
                                        scheduledTime: '2024-03-15 14:00',
                                        duration: '45 min'
                                    },
                                    {
                                        id: '2',
                                        round: 1,
                                        matchNumber: 2,
                                        player1: 'Team Gamma',
                                        player2: 'Team Delta',
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
                                        player1: 'Team Alpha',
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
                                <>
                                    {console.log('=== DEBUG: About to render StandingsTable ===')}
                                    {console.log('handleTeamClick function:', handleTeamClick)}
                                    {console.log('handleTeamClick type:', typeof handleTeamClick)}
                                    {console.log('handleTeamClick exists:', !!handleTeamClick)}
                                    <StandingsTable
                                        participants={[
                                            { id: '1', name: 'Team Alpha', team: 'Alpha Gaming', seed: 1, icon: '⚡' },
                                            { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' },
                                            { id: '3', name: 'Team Gamma', team: 'Gamma Pro', seed: 3, icon: '⚔️' },
                                            { id: '4', name: 'Team Delta', team: 'Delta Elite', seed: 4, icon: '🛡️' },
                                            { id: '5', name: 'Team Echo', team: 'Echo Warriors', seed: 5, icon: '🎯' },
                                            { id: '6', name: 'Team Foxtrot', team: 'Foxtrot Legends', seed: 6, icon: '🏆' },
                                            { id: '7', name: 'Team Golf', team: 'Golf Masters', seed: 7, icon: '⚜️' },
                                            { id: '8', name: 'Team Hotel', team: 'Hotel Champions', seed: 8, icon: '👑' }
                                        ]}
                                        standings={[
                                            { participant: { id: '1', name: 'Team Alpha', team: 'Alpha Gaming', seed: 1, icon: '⚡' }, position: 1, points: 25, matchesPlayed: 8, perfectWins: 8, wins: 8, losses: 0, draws: 0, mapDifference: 16, roundDifference: 24 },
                                            { participant: { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' }, position: 2, points: 22, matchesPlayed: 8, perfectWins: 7, wins: 7, losses: 1, draws: 0, mapDifference: 11, roundDifference: 21 },
                                            { participant: { id: '3', name: 'Team Gamma', team: 'Gamma Pro', seed: 3, icon: '⚔️' }, position: 3, points: 19, matchesPlayed: 8, perfectWins: 6, wins: 6, losses: 2, draws: 0, mapDifference: 6, roundDifference: 18 },
                                            { participant: { id: '4', name: 'Team Delta', team: 'Delta Elite', seed: 4, icon: '🛡️' }, position: 4, points: 16, matchesPlayed: 8, perfectWins: 5, wins: 5, losses: 3, draws: 0, mapDifference: 1, roundDifference: 15 },
                                            { participant: { id: '5', name: 'Team Echo', team: 'Echo Warriors', seed: 5, icon: '🎯' }, position: 5, points: 13, matchesPlayed: 8, perfectWins: 4, wins: 4, losses: 4, draws: 0, mapDifference: -4, roundDifference: 12 },
                                            { participant: { id: '6', name: 'Team Foxtrot', team: 'Foxtrot Legends', seed: 6, icon: '🏆' }, position: 6, points: 10, matchesPlayed: 8, perfectWins: 3, wins: 3, losses: 5, draws: 0, mapDifference: -9, roundDifference: 9 },
                                            { participant: { id: '7', name: 'Team Golf', team: 'Golf Masters', seed: 7, icon: '⚜️' }, position: 7, points: 7, matchesPlayed: 8, perfectWins: 2, wins: 2, losses: 6, draws: 0, mapDifference: -14, roundDifference: 6 },
                                            { participant: { id: '8', name: 'Team Hotel', team: 'Hotel Champions', seed: 8, icon: '👑' }, position: 8, points: 4, matchesPlayed: 8, perfectWins: 1, wins: 1, losses: 7, draws: 0, mapDifference: -19, roundDifference: 3 }
                                        ]}
                                        tournamentName={selectedTournamentForChart.name}
                                        onClose={() => setShowChartModal(false)}
                                        isEmbedded={true}
                                        onTeamClick={(participant) => {
                                            console.log('=== DEBUG: onTeamClick called from prop ===');
                                            console.log('Participant from prop:', participant);
                                            handleTeamClick(participant);
                                        }}
                                    />
                                </>
                            ) : (
                                <BracketVisualChart
                                    participants={[
                                        { id: '1', name: 'Team Alpha', team: 'Alpha Gaming', seed: 1, icon: '⚡' },
                                        { id: '2', name: 'Team Beta', team: 'Beta Esports', seed: 2, icon: '🔥' },
                                        { id: '3', name: 'Team Gamma', team: 'Gamma Pro', seed: 3, icon: '⚔️' },
                                        { id: '4', name: 'Team Delta', team: 'Delta Elite', seed: 4, icon: '🛡️' },
                                        { id: '5', name: 'Team Echo', team: 'Echo Warriors', seed: 5, icon: '🎯' },
                                        { id: '6', name: 'Team Foxtrot', team: 'Foxtrot Legends', seed: 6, icon: '🏆' },
                                        { id: '7', name: 'Team Golf', team: 'Golf Masters', seed: 7, icon: '⚜️' },
                                        { id: '8', name: 'Team Hotel', team: 'Hotel Champions', seed: 8, icon: '👑' }
                                    ]}
                                    configuredMatches={[
                                        {
                                            id: '1',    
                                            round: 1,
                                            matchNumber: 1,
                                            player1: 'Team Alpha',
                                            player2: 'Team Beta',
                                            scheduledTime: '2024-03-15 14:00'
                                        },
                                        {
                                            id: '2',
                                            round: 1,
                                            matchNumber: 2,
                                            player1: 'Team Gamma',
                                            player2: 'Team Delta',
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

export default MisTorneosPage;
