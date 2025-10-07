import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { usePagination, PaginationInfo } from './usePagination';
import { useNotification } from '../contexts';
import { DynamicSearchParams } from '../services/dynamicService';

/**
 * Interface para configuración de búsqueda dinámica
 */
export interface DynamicSearchConfig {
  endpoint: string;
  procedureSuffix: string;
  debounceDelay?: number;
  initialFilters?: DynamicSearchParams;
  initialPageSize?: number;
  enableDebounce?: boolean;
}

/**
 * Interface para respuesta de búsqueda
 */
export interface SearchResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  success: boolean;
  message: string;
}

/**
 * Hook personalizado para búsquedas dinámicas con paginación y debounce
 * Centraliza la lógica de búsqueda, filtrado y paginación
 * 
 * @param config - Configuración de la búsqueda
 * @returns Objeto con estado y funciones de búsqueda
 */
export const useDynamicSearch = <T = any>(config: DynamicSearchConfig) => {
  const {
    endpoint,
    procedureSuffix,
    debounceDelay = 500,
    initialFilters = {},
    initialPageSize = 6,
    enableDebounce = true
  } = config;

  // Estados
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DynamicSearchParams>(initialFilters);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { addNotification } = useNotification();
  const pagination = usePagination({ initialPageSize });
  
  // Referencia para cancelar búsquedas pendientes
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función de búsqueda base
  const performSearch = useCallback(async (
    searchFilters: DynamicSearchParams,
    pageNumber?: number,
    pageSize?: number
  ): Promise<SearchResponse<T> | null> => {
    try {
      setLoading(true);
      setError(null);

      // Cancelar búsqueda anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();

      // Importar dynamicService dinámicamente para evitar dependencias circulares
      const { dynamicService } = await import('../services/dynamicService');
      
      const response = await dynamicService.search<T>(
        endpoint,
        procedureSuffix,
        searchFilters,
        pageNumber || pagination.effectivePagination.pageNumber,
        pageSize || pagination.effectivePagination.pageSize
      );

      if (response.success) {
        const searchResponse: SearchResponse<T> = {
          data: Array.isArray(response.data.listFind) ? response.data.listFind : [],
          totalRecords: response.data.totalRecords || 0,
          pageNumber: response.data.pageNumber || 1,
          pageSize: response.data.pageSize || initialPageSize,
          success: true,
          message: response.message || 'Búsqueda exitosa'
        };

        return searchResponse;
      } else {
        throw new Error(response.message || 'Error en la búsqueda');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return null; // Búsqueda cancelada
      }
      
      const errorMessage = error.message || 'Error al realizar la búsqueda';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      
      return {
        data: [],
        totalRecords: 0,
        pageNumber: 1,
        pageSize: initialPageSize,
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [endpoint, procedureSuffix, pagination.effectivePagination, initialPageSize, addNotification]);

  // Función de búsqueda con debounce
  const debouncedSearch = useDebounce(performSearch, debounceDelay);

  // Función para realizar búsqueda
  const search = useCallback(async (
    searchFilters: DynamicSearchParams,
    pageNumber?: number,
    pageSize?: number
  ) => {
    const result = await performSearch(searchFilters, pageNumber, pageSize);
    
    if (result) {
      setData(result.data);
      pagination.updateServerPagination({
        totalRecords: result.totalRecords,
        pageNumber: result.pageNumber,
        pageSize: result.pageSize
      });
    }
  }, [performSearch, pagination]);

  // Función para búsqueda con debounce (solo para texto)
  const searchWithDebounce = useCallback(async (
    searchFilters: DynamicSearchParams,
    pageNumber?: number,
    pageSize?: number
  ) => {
    if (enableDebounce) {
      debouncedSearch(searchFilters, pageNumber, pageSize);
    } else {
      await search(searchFilters, pageNumber, pageSize);
    }
  }, [enableDebounce, debouncedSearch, search]);

  // Función para actualizar filtros
  const updateFilters = useCallback((
    newFilters: DynamicSearchParams,
    useDebounce: boolean = false
  ) => {
    setFilters(newFilters);
    
    if (useDebounce) {
      searchWithDebounce(newFilters, pagination.effectivePagination.pageNumber, pagination.effectivePagination.pageSize);
    } else {
      search(newFilters, pagination.effectivePagination.pageNumber, pagination.effectivePagination.pageSize);
    }
  }, [searchWithDebounce, search, pagination.effectivePagination]);

  // Función para manejar cambios de filtro específicos
  const handleFilterChange = useCallback((
    filterType: string,
    value: any,
    useDebounce: boolean = false
  ) => {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'search':
      case 'nombre':
        if (value && value.trim()) {
          newFilters.Nombre = value.trim();
        } else {
          delete newFilters.Nombre;
        }
        updateFilters(newFilters, true); // Siempre usar debounce para búsquedas de texto
        break;
        
      case 'category':
      case 'categoria':
        if (value && value !== 'all') {
          newFilters.CategoriaId = parseInt(value);
        } else {
          delete newFilters.CategoriaId;
        }
        updateFilters(newFilters, useDebounce);
        break;
        
      case 'status':
      case 'estado':
        if (value && value !== 'all') {
          newFilters.IsActive = value === 'active';
        } else {
          delete newFilters.IsActive;
        }
        updateFilters(newFilters, useDebounce);
        break;
        
      case 'difficulty':
      case 'dificultad':
        if (value && value !== 'all') {
          newFilters.Dificultad = value;
        } else {
          delete newFilters.Dificultad;
        }
        updateFilters(newFilters, useDebounce);
        break;
        
      default:
        // Filtro genérico
        if (value && value !== 'all' && value !== '') {
          newFilters[filterType] = value;
        } else {
          delete newFilters[filterType];
        }
        updateFilters(newFilters, useDebounce);
    }
  }, [filters, updateFilters]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    search({}, pagination.effectivePagination.pageNumber, pagination.effectivePagination.pageSize);
  }, [search, pagination.effectivePagination]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    search(filters, pagination.effectivePagination.pageNumber, pagination.effectivePagination.pageSize);
  }, [search, filters, pagination.effectivePagination]);

  // Función para manejar cambios de paginación
  const handlePaginationChange = useCallback((pageNumber: number, pageSize: number) => {
    search(filters, pageNumber, pageSize);
  }, [search, filters]);

  // Cargar datos iniciales
  useEffect(() => {
    search(initialFilters);
  }, []); // Solo ejecutar una vez al montar

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Estado
    data,
    loading,
    filters,
    error,
    
    // Paginación
    pagination: pagination.effectivePagination,
    displayRange: pagination.displayRange,
    canGoToPreviousPage: pagination.canGoToPreviousPage,
    canGoToNextPage: pagination.canGoToNextPage,
    
    // Funciones de búsqueda
    search,
    searchWithDebounce,
    updateFilters,
    handleFilterChange,
    clearFilters,
    refresh,
    
    // Funciones de paginación
    handlePaginationChange,
    goToPreviousPage: pagination.goToPreviousPage,
    goToNextPage: pagination.goToNextPage,
    goToFirstPage: pagination.goToFirstPage,
    goToLastPage: pagination.goToLastPage,
    
    // Funciones de utilidad
    resetPagination: pagination.resetPagination,
    updateServerPagination: pagination.updateServerPagination
  };
};
