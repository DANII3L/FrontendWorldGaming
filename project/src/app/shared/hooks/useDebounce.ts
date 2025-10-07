import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook personalizado para implementar debounce
 * Útil para optimizar búsquedas y evitar múltiples llamadas a la API
 * 
 * @param callback - Función a ejecutar después del delay
 * @param delay - Tiempo de espera en milisegundos
 * @returns Función debounced
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función debounced que limpia el timeout anterior y establece uno nuevo
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook para debounce con cancelación manual
 * Permite cancelar el debounce manualmente si es necesario
 * 
 * @param callback - Función a ejecutar después del delay
 * @param delay - Tiempo de espera en milisegundos
 * @returns Objeto con función debounced y función de cancelación
 */
export const useDebounceWithCancel = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedCallback,
    cancel
  };
};

/**
 * Hook para debounce con estado de loading
 * Útil para mostrar indicadores de carga durante el debounce
 * 
 * @param callback - Función a ejecutar después del delay
 * @param delay - Tiempo de espera en milisegundos
 * @returns Objeto con función debounced y estado de loading
 */
export const useDebounceWithLoading = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      setIsLoading(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        setIsLoading(false);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedCallback,
    isLoading
  };
};
