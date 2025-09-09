import React, { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Save,
  Plus,
  Trash2,
  Trophy,
  Shield,
} from 'lucide-react';
import DynamicForm, { FormField } from '../../shared/components/ui/DynamicForm';
import GameRequirements from '../components/GameRequirements';
import TeamRosterManager from '../components/TeamRosterManager';

interface Player {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: number;
  isAvailable: boolean;
}

interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
}

interface TeamForm {
  name: string;
  description: string;
  logo?: File;
  logoPreview?: string;
  captain: string;
  gameRequirements: GameRequirement[];
  isActive: boolean;
}

interface TeamRoster {
  gameId: string;
  gameName: string;
  titulares: Player[];
  suplentes: Player[];
}

const CrearEquipo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<TeamForm>({
    name: '',
    description: '',
    captain: '',
    gameRequirements: [],
    isActive: true
  });

  const [teamRoster, setTeamRoster] = useState<TeamRoster[]>([]);
  const [showGameRequirements, setShowGameRequirements] = useState(false);
  const [showRosterManager, setShowRosterManager] = useState(false);
  const [availableGames, setAvailableGames] = useState([
    { id: '1', name: 'League of Legends', defaultTitulares: 5, defaultSuplentes: 2 },
    { id: '2', name: 'Valorant', defaultTitulares: 5, defaultSuplentes: 2 },
    { id: '3', name: 'CS:GO', defaultTitulares: 5, defaultSuplentes: 2 },
    { id: '4', name: 'Rocket League', defaultTitulares: 3, defaultSuplentes: 1 },
    { id: '5', name: 'FIFA', defaultTitulares: 1, defaultSuplentes: 1 },
  ]);

  // Mock de jugadores disponibles
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([
    { id: '1', name: 'Alex Rodriguez', email: 'alex@email.com', role: 'Captain', experience: 5, isAvailable: true },
    { id: '2', name: 'Sarah Chen', email: 'sarah@email.com', role: 'Player', experience: 3, isAvailable: true },
    { id: '3', name: 'Carlos Garcia', email: 'carlos@email.com', role: 'Player', experience: 4, isAvailable: true },
    { id: '4', name: 'Lisa Thompson', email: 'lisa@email.com', role: 'Player', experience: 2, isAvailable: true },
    { id: '5', name: 'Juan Lopez', email: 'juan@email.com', role: 'Player', experience: 6, isAvailable: true },
    { id: '6', name: 'Emma Williams', email: 'emma@email.com', role: 'Player', experience: 3, isAvailable: true },
    { id: '7', name: 'Diego Perez', email: 'diego@email.com', role: 'Player', experience: 4, isAvailable: true },
    { id: '8', name: 'Sophie Taylor', email: 'sophie@email.com', role: 'Player', experience: 2, isAvailable: true },
  ]);

  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre del Equipo',
      type: 'text',
      required: true,
      placeholder: 'Ej: Estral Esports'
    },
    {
      name: 'description',
      label: 'Descripción del Equipo',
      type: 'textarea',
      required: true,
      placeholder: 'Describe tu equipo...'
    },
    {
      name: 'captain',
      label: 'Capitán del Equipo',
      type: 'select',
      required: true,
      options: availablePlayers.map(player => ({ value: player.id, label: player.name }))
    }
  ];

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addGameRequirement = () => {
    setShowGameRequirements(true);
  };

  const handleGameRequirementSave = (requirements: GameRequirement[]) => {
    setFormData(prev => ({
      ...prev,
      gameRequirements: requirements
    }));
    setShowGameRequirements(false);
  };

  const removeGameRequirement = (gameId: string) => {
    setFormData(prev => ({
      ...prev,
      gameRequirements: prev.gameRequirements.filter(req => req.gameId !== gameId)
    }));
  };

  const handleRosterSave = (roster: TeamRoster[]) => {
    setTeamRoster(roster);
    setShowRosterManager(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Equipo creado:', formData);
    // Aquí iría la lógica para guardar el equipo
    // Después de guardar exitosamente, navegar de vuelta a la pantalla de origen
    const returnPath = location.state?.from || '/worldGaming/equipos';
    navigate(returnPath);
  };

  const handleCancel = () => {
    // Navegar de vuelta a la pantalla de origen
    const returnPath = location.state?.from || '/worldGaming/equipos';
    navigate(returnPath);
  };

  const getTotalPlayers = () => {
    return teamRoster.reduce((total, gameRoster) => 
      total + gameRoster.titulares.length + gameRoster.suplentes.length, 0
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Crear Nuevo Equipo</h1>
              <p className="text-white/60">Configura tu equipo para competir en torneos</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Crear Equipo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Información del Equipo</span>
              </h2>
              
              <div className="w-full">
                <DynamicForm
                  fields={formFields}
                  values={formData}
                  onChange={handleInputChange}
                  onSubmit={() => {}}
                />
              </div>

              {/* Logo del Equipo */}
              <div className="mt-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Logo del Equipo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                    {formData.logoPreview ? (
                      <img src={formData.logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Users className="w-8 h-8 text-white/40" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Subir Logo
                  </label>
                </div>
              </div>
            </div>

            {/* Requisitos de Juegos */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Requisitos de Juegos</span>
                </h2>
                <button
                  onClick={addGameRequirement}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Juego</span>
                </button>
              </div>

              {formData.gameRequirements.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p>No hay juegos configurados</p>
                  <p className="text-sm">Agrega los juegos en los que competirá tu equipo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.gameRequirements.map((req) => (
                    <div key={req.gameId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{req.gameName}</h3>
                          <p className="text-white/60 text-sm">
                            {req.titulares} titulares • {req.suplentes} suplentes • {req.totalPlayers} total
                          </p>
                        </div>
                        <button
                          onClick={() => removeGameRequirement(req.gameId)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel de Gestión */}
          <div className="space-y-6">
            {/* Estadísticas del Equipo */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Estadísticas</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Total Jugadores:</span>
                  <span className="text-white font-bold">{getTotalPlayers()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Juegos Configurados:</span>
                  <span className="text-purple-400 font-bold">{formData.gameRequirements.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Equipos Completos:</span>
                  <span className="text-green-400 font-bold">
                    {teamRoster.filter(gameRoster => {
                      const gameRequirement = formData.gameRequirements.find(g => g.gameId === gameRoster.gameId);
                      if (!gameRequirement) return false;
                      return (gameRoster.titulares.length + gameRoster.suplentes.length) === gameRequirement.totalPlayers;
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Gestión de Roster */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Gestión de Roster</span>
                </h2>
                <button
                  onClick={() => setShowRosterManager(true)}
                  disabled={formData.gameRequirements.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    formData.gameRequirements.length > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Gestionar Jugadores</span>
                </button>
              </div>

              {formData.gameRequirements.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p>Primero configura los juegos del equipo</p>
                  <p className="text-sm">Luego podrás gestionar los jugadores</p>
                </div>
              ) : teamRoster.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p>No hay jugadores asignados</p>
                  <p className="text-sm">Haz clic en "Gestionar Jugadores" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamRoster.map((gameRoster) => {
                    const gameRequirement = formData.gameRequirements.find(g => g.gameId === gameRoster.gameId);
                    if (!gameRequirement) return null;
                    
                    const totalAssigned = gameRoster.titulares.length + gameRoster.suplentes.length;
                    const isComplete = totalAssigned === gameRequirement.totalPlayers;
                    
                    return (
                      <div key={gameRoster.gameId} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-sm">{gameRoster.gameName}</h3>
                            <p className="text-white/60 text-xs">
                              {totalAssigned} de {gameRequirement.totalPlayers} jugadores
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isComplete 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {isComplete ? 'Completo' : 'Incompleto'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showGameRequirements && (
        <GameRequirements
          isOpen={showGameRequirements}
          onClose={() => setShowGameRequirements(false)}
          onSave={handleGameRequirementSave}
          currentRequirements={formData.gameRequirements}
          availableGames={availableGames}
        />
      )}

      {showRosterManager && (
        <TeamRosterManager
          isOpen={showRosterManager}
          onClose={() => setShowRosterManager(false)}
          onSave={handleRosterSave}
          gameRequirements={formData.gameRequirements}
          availablePlayers={availablePlayers}
          currentRoster={teamRoster}
        />
      )}
    </div>
  );
};

export default CrearEquipo;
