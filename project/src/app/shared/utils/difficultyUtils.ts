/**
 * Utilidades para manejo de dificultades
 * Centraliza la lógica de colores, badges y ordenamiento de dificultades
 */

/**
 * Mapeo de dificultades a colores CSS
 */
const DIFFICULTY_COLORS: Record<string, string> = {
  'Principiante': 'text-green-400',
  'Intermedio': 'text-teal-400',
  'Avanzado': 'text-orange-400',
  'Experto': 'text-red-500',
  'Veterano': 'text-purple-500'
};

/**
 * Mapeo de dificultades a badges de color (tema claro)
 */
const DIFFICULTY_BADGES: Record<string, string> = {
  'Principiante': 'bg-green-100 text-green-800 border-green-200',
  'Intermedio': 'bg-teal-100 text-teal-800 border-teal-200',
  'Avanzado': 'bg-orange-100 text-orange-800 border-orange-200',
  'Profesional': 'bg-orange-200 text-orange-900 border-orange-300',
  'Experto': 'bg-red-100 text-red-800 border-red-200',
  'Maestro': 'bg-purple-100 text-purple-800 border-purple-200'
};

/**
 * Mapeo de dificultades a badges de color (tema oscuro)
 */
const DIFFICULTY_BADGES_DARK: Record<string, { bgColor: string; textColor: string; borderColor: string }> = {
  'Principiante': {
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  'Intermedio': {
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30'
  },
  'Avanzado': {
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30'
  },
  'Profesional': {
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30'
  },
  'Experto': {
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30'
  },
  'Maestro': {
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30'
  }
};

/**
 * Orden de dificultades (de menor a mayor)
 */
const DIFFICULTY_ORDER: Record<string, number> = {
  'Principiante': 1,
  'Intermedio': 2,
  'Avanzado': 3,
  'Profesional': 4,
  'Experto': 5,
  'Maestro': 6
};

/**
 * Obtiene el color CSS para una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Clase CSS de color
 */
export const getDifficultyColor = (difficulty: string): string => {
  return DIFFICULTY_COLORS[difficulty] || 'text-gray-400';
};

/**
 * Obtiene las clases CSS para el badge de dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Clases CSS para el badge
 */
export const getDifficultyBadge = (difficulty: string): string => {
  return DIFFICULTY_BADGES[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Obtiene el orden numérico de una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Número de orden (1-6)
 */
export const getDifficultyOrder = (difficulty: string): number => {
  return DIFFICULTY_ORDER[difficulty] || 0;
};

/**
 * Obtiene el color de fondo para una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Clase CSS de color de fondo
 */
export const getDifficultyBackground = (difficulty: string): string => {
  const backgroundMap: Record<string, string> = {
    'Principiante': 'bg-green-50',
    'Intermedio': 'bg-teal-50',
    'Avanzado': 'bg-orange-50',
    'Profesional': 'bg-orange-100',
    'Experto': 'bg-red-50',
    'Maestro': 'bg-purple-50'
  };
  
  return backgroundMap[difficulty] || 'bg-gray-50';
};

/**
 * Obtiene el color de borde para una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Clase CSS de color de borde
 */
export const getDifficultyBorder = (difficulty: string): string => {
  const borderMap: Record<string, string> = {
    'Principiante': 'border-green-200',
    'Intermedio': 'border-teal-200',
    'Avanzado': 'border-orange-200',
    'Profesional': 'border-orange-300',
    'Experto': 'border-red-200',
    'Maestro': 'border-purple-200'
  };
  
  return borderMap[difficulty] || 'border-gray-200';
};

/**
 * Obtiene el icono para una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Emoji representativo
 */
export const getDifficultyIcon = (difficulty: string): string => {
  const iconMap: Record<string, string> = {
    'Principiante': '🌱',
    'Intermedio': '⭐',
    'Avanzado': '🔥',
    'Profesional': '💎',
    'Experto': '👑',
    'Maestro': '🏆'
  };
  
  return iconMap[difficulty] || '❓';
};

/**
 * Valida si una dificultad es válida
 * @param difficulty - Dificultad a validar
 * @returns true si es válida
 */
export const isValidDifficulty = (difficulty: string): boolean => {
  return Object.keys(DIFFICULTY_ORDER).includes(difficulty);
};

/**
 * Obtiene todas las dificultades disponibles
 * @returns Array de dificultades ordenadas
 */
export const getAllDifficulties = (): string[] => {
  return Object.keys(DIFFICULTY_ORDER).sort((a, b) => 
    DIFFICULTY_ORDER[a] - DIFFICULTY_ORDER[b]
  );
};

/**
 * Obtiene las opciones de dificultad para un select
 * @returns Array de objetos {value, label} para selects
 */
export const getDifficultyOptions = (): Array<{value: string, label: string}> => {
  return getAllDifficulties().map(difficulty => ({
    value: difficulty,
    label: `${getDifficultyIcon(difficulty)} ${difficulty}`
  }));
};

/**
 * Compara dos dificultades
 * @param a - Primera dificultad
 * @param b - Segunda dificultad
 * @returns -1 si a < b, 0 si a = b, 1 si a > b
 */
export const compareDifficulties = (a: string, b: string): number => {
  const orderA = getDifficultyOrder(a);
  const orderB = getDifficultyOrder(b);
  return orderA - orderB;
};

/**
 * Obtiene la configuración completa de badge para tema oscuro
 * @param difficulty - Nivel de dificultad
 * @returns Objeto con bgColor, textColor y borderColor
 */
export const getDifficultyBadgeDark = (difficulty: string): { bgColor: string; textColor: string; borderColor: string } => {
  return DIFFICULTY_BADGES_DARK[difficulty] || {
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/30'
  };
};

/**
 * Obtiene el texto en mayúsculas para una dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Texto en mayúsculas
 */
export const getDifficultyText = (difficulty: string): string => {
  const textMap: Record<string, string> = {
    'Principiante': 'PRINCIPIANTE',
    'Intermedio': 'INTERMEDIO',
    'Avanzado': 'AVANZADO',
    'Profesional': 'PROFESIONAL',
    'Experto': 'EXPERTO',
    'Maestro': 'MAESTRO'
  };
  
  return textMap[difficulty] || 'SIN DEFINIR';
};
