import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, X, Gamepad2 } from 'lucide-react';
import { useAutoNavigation } from '../routes/AutoNavigation';
import { useAuth } from '../../auth/AuthContext';
import { useColorPalette } from '../contexts/ColorPaletteContext';
import { useGame } from '../contexts/GameContext';
import { getAvailableGames } from '../services/paletteService';

interface DynamicSidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Game {
  id: string;
  name: string;
  icon: string;
}

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

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { setGamePalette, isLoading } = useColorPalette();
  const { selectedGame, setSelectedGame } = useGame();
  
  // Usar la navegación automática
  const navigationItems = useAutoNavigation();
  
  // Estado para controlar qué submenús están abiertos
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);

  const isActive = (path: string) => {
    // Para rutas padre, solo activar si estamos exactamente en esa ruta
    // NO activar si estamos en una subruta
    if (path.includes('/inventario') || path.includes('/usuarios')) {
      return location.pathname === path;
    }
    // Para rutas hijas, activar si es exactamente la ruta
    return location.pathname === path;
  };

  const handleRouteClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleSubmenu = (itemHref: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set<string>();
      // Si el submenú actual está abierto, lo cerramos
      if (prev.has(itemHref)) {
        return newSet; // Devolvemos un set vacío
      } else {
        // Si está cerrado, lo abrimos y cerramos todos los demás
        newSet.add(itemHref);
        return newSet;
      }
    });
  };

  const hasActiveChild = (item: any) => {
    return item.children?.some((child: any) => isActive(child.href));
  };

  // Cargar juegos disponibles
  useEffect(() => {
    const loadGames = async () => {
      try {
        const availableGames = await getAvailableGames();
        const gamesWithIcons = availableGames.map(game => ({
          ...game,
          icon: gameIcons[game.id] || '🎮'
        }));
        setGames(gamesWithIcons);
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
    setIsGameSelectorOpen(false);
  };

  // Cerrar selector de juegos cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.game-selector')) {
        setIsGameSelectorOpen(false);
      }
    };

    if (isGameSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGameSelectorOpen]);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/98 to-black/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h2 className="text-3xl font-bold text-white tracking-wider">NAVEGACIÓN</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white/80 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegación Dinámica */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative group">
                  <button
                    onClick={() => {
                      if (item.children && item.children.length > 0) {
                        toggleSubmenu(item.href);
                      } else {
                        handleRouteClick(item.href);
                      }
                    }}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02] flex items-center justify-between ${
                      isActive(item.href) || hasActiveChild(item)
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className="w-6 h-6" />
                      <span>{item.name.toUpperCase()}</span>
                    </div>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openSubmenus.has(item.href) ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </button>
                  
                  {/* Submenú desplegable */}
                  {item.children && item.children.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSubmenus.has(item.href) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((childItem) => (
                          <button
                            key={childItem.href}
                            onClick={() => handleRouteClick(childItem.href)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 text-lg font-semibold tracking-wide hover:scale-[1.02] flex items-center space-x-3 ${
                              isActive(childItem.href)
                                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                                : 'text-white/80 hover:bg-white/5'
                            }`}
                          >
                            {childItem.icon && <childItem.icon className="w-5 h-5" />}
                            <span>{childItem.name.toUpperCase()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Separador */}
            <div className="my-12 border-t border-white/20"></div>

            {/* Información del Usuario */}
            <div className="space-y-1">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6 px-6">CUENTA</h3>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Usuario Autenticado</p>
                    <p className="text-white/60 text-sm">Sesión activa</p>
                  </div>
                </div>
              </div>
              
              {/* Botón de Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left text-white hover:bg-red-500/20 p-4 rounded-2xl transition-all duration-300 text-lg font-bold tracking-wide hover:scale-[1.02] mt-4 flex items-center space-x-3"
              >
                <LogOut className="w-5 h-5" />
                <span>CERRAR SESIÓN</span>
              </button>
            </div>
          </div>

          {/* Footer del Sidebar */}
          <div className="p-8 border-t border-white/10">
            <div className="flex items-center justify-between text-white/40 text-sm font-medium">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                <span className="tracking-wide">ESPAÑOL</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="tracking-wide">CONFIGURACIÓN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicSidebar;
