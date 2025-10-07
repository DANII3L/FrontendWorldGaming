/**
 * Utilidades para manejo de iconos y emojis
 * Centraliza la lógica de conversión entre Unicode y emojis
 */

/**
 * Convierte un código Unicode a emoji
 * @param unicode - Código Unicode (ej: "U+2694U+FE0F")
 * @returns Emoji correspondiente o fallback
 */
export const unicodeToEmoji = (unicode: string): string => {
  if (!unicode) return '🎮';
  
  try {
    // Si ya es un emoji, devolverlo tal como está
    if (unicode.length === 1 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(unicode)) {
      return unicode;
    }

    // Si es código Unicode, convertir
    if (unicode.includes('U+')) {
      // Remover U+ y dividir por espacios o múltiples U+
      const codes = unicode.replace(/U\+/g, '').split(/\s+/).filter(code => code.length > 0);
      if (!codes.length) return '🎮';

      return codes.map(code => {
        const num = parseInt(code, 16);
        return String.fromCodePoint(num);
      }).join('');
    }

    return unicode;
  } catch (error) {
    return '🎮';
  }
};

/**
 * Convierte un emoji a código Unicode
 * @param emoji - Emoji a convertir
 * @returns Código Unicode correspondiente
 */
export const emojiToUnicode = (emoji: string): string => {
  if (!emoji) return 'U+1F3AE'; // 🎮 por defecto
  
  try {
    // Si ya es código Unicode, devolverlo
    if (emoji.includes('U+')) {
      return emoji;
    }

    // Convertir emoji a código Unicode
    const codePoints = Array.from(emoji).map(char => {
      const code = char.codePointAt(0);
      return code ? `U+${code.toString(16).toUpperCase().padStart(4, '0')}` : '';
    }).join('');

    return codePoints || 'U+1F3AE';
  } catch (error) {
    console.error('Error al convertir emoji a Unicode:', error);
    return 'U+1F3AE'; // Fallback
  }
};

/**
 * Maneja iconos corruptos o vacíos con fallback
 * @param icon - Icono a validar
 * @returns Icono válido o fallback
 */
export const getDisplayIcon = (icon: string): string => {
  if (!icon || icon === '??' || icon === '') {
    return '🎮'; // Icono por defecto
  }
  return unicodeToEmoji(icon);
};

/**
 * Valida si un string es un emoji válido
 * @param str - String a validar
 * @returns true si es emoji válido
 */
export const isValidEmoji = (str: string): boolean => {
  if (!str || str.length === 0) return false;
  
  // Verificar si es código Unicode
  if (str.includes('U+')) return true;
  
  // Verificar si es emoji
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
};

/**
 * Obtiene un icono por defecto basado en el tipo de entidad
 * @param entityType - Tipo de entidad (juego, torneo, etc.)
 * @returns Icono por defecto
 */
export const getDefaultIcon = (entityType: string): string => {
  const defaultIcons: Record<string, string> = {
    juego: '🎮',
    torneo: '🏆',
    categoria: '📁',
    usuario: '👤',
    equipo: '👥',
    partida: '🎯'
  };
  
  return defaultIcons[entityType.toLowerCase()] || '🎮';
};
