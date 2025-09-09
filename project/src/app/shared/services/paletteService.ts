// Interfaz para la respuesta de la API
interface GamePaletteResponse {
  gameId: string;
  palette: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    light: string;
  };
  gameName: string;
  gameLogo?: string;
}

// Mock de la API - En el futuro esto será una llamada real
export const getGamePalette = async (gameId: string): Promise<GamePaletteResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const gamePalettes: Record<string, GamePaletteResponse> = {
    'gta-vi': {
      gameId: 'gta-vi',
      gameName: 'Grand Theft Auto VI',
      palette: {
        primary: '#0A1128',
        secondary: '#001F54',
        tertiary: '#034078',
        accent: '#1282A2',
        light: '#FEFCFB'
      }
    },
    'valorant': {
      gameId: 'valorant',
      gameName: 'Valorant',
      palette: {
        primary: '#0F1419',
        secondary: '#FF4655',
        tertiary: '#53212B',
        accent: '#7C3AED',
        light: '#F8FAFC'
      }
    },
    'csgo': {
      gameId: 'csgo',
      gameName: 'Counter-Strike: Global Offensive',
      palette: {
        primary: '#1B1B1B',
        secondary: '#F7931E',
        tertiary: '#2D2D2D',
        accent: '#4A90E2',
        light: '#FFFFFF'
      }
    },
    'fortnite': {
      gameId: 'fortnite',
      gameName: 'Fortnite',
      palette: {
        primary: '#1A1A2E',
        secondary: '#16213E',
        tertiary: '#0F3460',
        accent: '#E94560',
        light: '#F8F9FA'
      }
    },
    'lol': {
      gameId: 'lol',
      gameName: 'League of Legends',
      palette: {
        primary: '#0A1428',
        secondary: '#C89B3C',
        tertiary: '#1E2328',
        accent: '#F0E6D2',
        light: '#FFFFFF'
      }
    },
    'overwatch': {
      gameId: 'overwatch',
      gameName: 'Overwatch',
      palette: {
        primary: '#1A1A2E',
        secondary: '#FF6B35',
        tertiary: '#2D2D2D',
        accent: '#4ECDC4',
        light: '#FFFFFF'
      }
    },
    'dota2': {
      gameId: 'dota2',
      gameName: 'Dota 2',
      palette: {
        primary: '#1B1B1B',
        secondary: '#FF6B6B',
        tertiary: '#2D2D2D',
        accent: '#4ECDC4',
        light: '#FFFFFF'
      }
    },
    'rainbow6': {
      gameId: 'rainbow6',
      gameName: 'Rainbow Six Siege',
      palette: {
        primary: '#1A1A2E',
        secondary: '#FF6B35',
        tertiary: '#2D2D2D',
        accent: '#4ECDC4',
        light: '#FFFFFF'
      }
    }
  };

  const response = gamePalettes[gameId];
  
  if (!response) {
    throw new Error(`Palette not found for game: ${gameId}`);
  }

  return response;
};

// Función para obtener todos los juegos disponibles
export const getAvailableGames = async (): Promise<Array<{id: string, name: string}>> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    { id: 'gta-vi', name: 'Grand Theft Auto VI' },
    { id: 'valorant', name: 'Valorant' },
    { id: 'csgo', name: 'Counter-Strike: Global Offensive' },
    { id: 'fortnite', name: 'Fortnite' },
    { id: 'lol', name: 'League of Legends' },
    { id: 'overwatch', name: 'Overwatch' },
    { id: 'dota2', name: 'Dota 2' },
    { id: 'rainbow6', name: 'Rainbow Six Siege' }
  ];
}; 