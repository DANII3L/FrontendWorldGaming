import React, { useState, useEffect } from 'react';
import { useColorPalette } from '../../shared/contexts/ColorPaletteContext';
import { useGame } from '../../shared/contexts/GameContext';
import { getAvailableGames } from '../../shared/services/paletteService';
import { Loader2, Zap, Target, Crown, Flame, Sparkles } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  players: string;
  difficulty: string;
}

const gameData: Record<string, Omit<Game, 'id' | 'name' | 'icon'>> = {
  'gta-vi': {
    description: 'Mundo abierto épico',
    players: '2.5M+',
    difficulty: 'EXTREMO'
  },
  'valorant': {
    description: 'Táctico FPS competitivo',
    players: '1.8M+',
    difficulty: 'ALTO'
  },
  'csgo': {
    description: 'Clásico shooter táctico',
    players: '3.2M+',
    difficulty: 'PRO'
  },
  'fortnite': {
    description: 'Battle Royale épico',
    players: '4.5M+',
    difficulty: 'MEDIO'
  },
  'lol': {
    description: 'MOBA estratégico',
    players: '2.8M+',
    difficulty: 'ALTO'
  },
  'overwatch': {
    description: 'Hero shooter dinámico',
    players: '1.5M+',
    difficulty: 'MEDIO'
  },
  'dota2': {
    description: 'MOBA complejo',
    players: '1.2M+',
    difficulty: 'EXTREMO'
  },
  'rainbow6': {
    description: 'Táctico de precisión',
    players: '900K+',
    difficulty: 'ALTO'
  }
};

const gameIcons: Record<string, string> = {
  'gta-vi': '🎮',
  'valorant': '🎯',
  'csgo': '🔫',
  'fortnite': '🏗️',
  'lol': '⚔️',
  'overwatch': '🛡️',
  'dota2': '⚔️',
  'rainbow6': '🔫'
};

const GameSelector: React.FC = () => {
  const { setGamePalette, isLoading } = useColorPalette();
  const { selectedGame, setSelectedGame } = useGame();
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const availableGames = await getAvailableGames();
        const gamesWithData = availableGames.map(game => ({
          ...game,
          icon: gameIcons[game.id] || '🎮',
          ...gameData[game.id]
        }));
        setGames(gamesWithData);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, []);

  const handleGameSelect = async (gameId: string) => {
    await setGamePalette(gameId);
    setSelectedGame(gameId);
    setIsExpanded(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EXTREMO': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'PRO': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'ALTO': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'MEDIO': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default: return 'text-green-400 border-green-400/30 bg-green-400/10';
    }
  };

  if (loadingGames) {
    return (
      <div className="fixed top-24 right-6 z-50">
        <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-orange-400/30 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-medium">Inicializando universo gaming...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentGame = games.find(g => g.id === selectedGame);

  return (
    <div className="fixed top-24 right-6 z-50">
      {/* Contenedor principal */}
      <div className="relative">
        {/* Efectos de partículas de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
        
        {/* Contenido principal */}
        <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header con efecto gaming */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wider">
                    UNIVERSO GAMING
                  </h3>
                  <p className="text-white/60 text-xs">Selecciona tu dimensión</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Target className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Juego actual destacado */}
          {currentGame && (
            <div className="p-6 border-b border-white/10">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-500/30">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="text-3xl">{currentGame.icon}</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm">{currentGame.name}</h4>
                    <p className="text-white/70 text-xs">{currentGame.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-orange-400 text-xs font-medium">{currentGame.players} jugadores</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(currentGame.difficulty)}`}>
                        {currentGame.difficulty}
                      </span>
                    </div>
                  </div>
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </div>
          )}

                     {/* Lista de juegos */}
           <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="p-4 space-y-2 max-h-64 overflow-y-auto" style={{
               scrollbarWidth: 'thin',
               scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
             }}>
              {games.map((game, index) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                  disabled={isLoading}
                                     className={`w-full relative group transition-all duration-300 transform ${
                     hoveredGame === game.id ? 'scale-105' : 'scale-100'
                   }`}
                   style={{ 
                     animationDelay: `${index * 100}ms`
                   }}
                >
                  {/* Efecto de hover */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    hoveredGame === game.id 
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}></div>
                  
                  {/* Contenido del botón */}
                  <div className="relative p-4 rounded-xl flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {game.icon}
                      </span>
                      {hoveredGame === game.id && (
                        <div className="absolute -inset-2 bg-orange-400/20 rounded-full animate-ping"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-bold text-sm group-hover:text-orange-400 transition-colors">
                        {game.name}
                      </h4>
                      <p className="text-white/60 text-xs">{game.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-orange-400 text-xs font-medium">{game.players}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {hoveredGame === game.id && (
                        <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                      )}
                      {selectedGame === game.id && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer con estadísticas */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Total: {games.length} universos</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </span>
            </div>
          </div>
                 </div>
       </div>

       
     </div>
   );
 };

export default GameSelector; 