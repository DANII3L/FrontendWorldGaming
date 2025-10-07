import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { dynamicService, DynamicSearchParams } from '../../shared/services/dynamicService';
import { usePaginationDefaults } from '../../shared/hooks/usePaginationDefaults';
import { useNotification } from '../../shared/contexts';
import { TOURNAMENT_STATUS_OPTIONS, TOURNAMENT_DIFFICULTY_OPTIONS } from '../../shared/constants/tournamentConstants';

export interface MiTorneo {
  id: number;
  nombre: string;
  juegoId: number;
  juegoNombre?: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  maxParticipantes: number;
  maxJugadores: number;
  titulares: number;
  suplentes: number;
  premio: string;
  estado: string;
  costoEntrada: number;
  imagen?: string;
  reglas?: string;
  cantidadEquipos: number;
  dificultad: string;
  isActive: boolean;
  participantes?: number;
  categoria?: string;
  phase?: 'initial' | 'final';
  creadorId?: number; // Campo para identificar al creador del torneo
}

export interface MisTorneosFilters {
  search?: string;
  estado?: string;
  juegoId?: string;
  dificultad?: string;
  isActive?: boolean;
  creadorId?: number;
}

export const useMisTorneos = () => {
  const [torneos, setTorneos] = useState<MiTorneo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<DynamicSearchParams>({});
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { defaults, normalizeParams } = usePaginationDefaults();
  
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    pageNumber: defaults.pageNumber as number,
    pageSize: defaults.pageSize as number
  });

  // Función para limpiar filtros vacíos o de "Seleccionar..."
  const cleanFilters = (filters: DynamicSearchParams): DynamicSearchParams => {
    const cleaned: DynamicSearchParams = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      // Solo incluir filtros que tengan valor y no sean "Seleccionar..." o vacíos
      if (value && 
          value !== '' && 
          value !== 'Seleccionar...' && 
          value !== 'select' &&
          value !== null && 
          value !== undefined) {
        cleaned[key as keyof DynamicSearchParams] = value;
      }
    });
    
    return cleaned;
  };

  const searchMisTorneos = useCallback(async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
    if (!user?.id) {
      setTorneos([]);
      setPaginationInfo(prev => ({ ...prev, totalRecords: 0 }));
      return;
    }

    try {
      setLoading(true);
      setSearchFilters(filters);
      
      // Limpiar filtros antes de enviarlos al servidor
      const cleanedFilters = cleanFilters(filters);
      
      // Agregar el filtro de CreadorId
      cleanedFilters.CreadorId = user.id.toString();
      
      // Normalizar parámetros de paginación usando utilidades globales
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      
      const response = await dynamicService.search('torneos_response', 'Torneos', cleanedFilters, normalizedPageNumber, normalizedPageSize);
      
      if (response.success) {
        // Extraer datos de la nueva estructura
        const torneosData = Array.isArray(response.data.listFind) ? response.data.listFind : [];
        setTorneos(torneosData as MiTorneo[]);

        // Actualizar información de paginación
        setPaginationInfo({
          totalRecords: response.data.totalRecords || 0,
          pageNumber: normalizedPageNumber,
          pageSize: normalizedPageSize
        });
      } else {
        setError('Error al buscar mis torneos: ' + response.message);
        setTorneos([]);
        setPaginationInfo(prev => ({ ...prev, totalRecords: 0 }));
      }
    } catch (error: any) {
      setError('Error al buscar mis torneos: ' + error.message);
      setTorneos([]);
      setPaginationInfo(prev => ({ ...prev, totalRecords: 0 }));
    } finally {
      setLoading(false);
    }
  }, [user?.id, normalizeParams]);

  const refreshMisTorneos = () => {
    searchMisTorneos(searchFilters, paginationInfo.pageNumber, paginationInfo.pageSize);
  };

  // Función para manejar cambios de filtros
  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...searchFilters };
    if (value && value !== '') {
      newFilters[filterKey as keyof DynamicSearchParams] = value;
    } else {
      delete newFilters[filterKey as keyof DynamicSearchParams];
    }
    searchMisTorneos(newFilters, 1, paginationInfo.pageSize);
  };

  // Función para manejar búsqueda con debounce
  const performSearch = useCallback((searchTerm: string) => {
    const newFilters = { ...searchFilters };
    if (searchTerm && searchTerm.trim() !== '') {
      newFilters.Nombre = searchTerm;
    } else {
      delete newFilters.Nombre;
    }
    searchMisTorneos(newFilters, 1, paginationInfo.pageSize);
  }, [searchFilters, searchMisTorneos, paginationInfo.pageSize]);

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleSearch = (searchTerm: string) => {
    debouncedSearch(searchTerm);
  };

  // Función para manejar cambios de página
  const handlePageChange = (pageNumber: number) => {
    searchMisTorneos(searchFilters, pageNumber, paginationInfo.pageSize);
  };

  // Función para manejar cambios de tamaño de página
  const handleItemsPerPageChange = (pageSize: number) => {
    searchMisTorneos(searchFilters, 1, pageSize);
  };

  // Función para obtener opciones de filtros
  const getFilterOptions = () => {
    return {
      dificultad: TOURNAMENT_DIFFICULTY_OPTIONS,
      estado: TOURNAMENT_STATUS_OPTIONS
    };
  };

  // Cargar torneos al montar el componente
  useEffect(() => {
    if (user?.id) {
      searchMisTorneos({}, 1, defaults.pageSize as number); // Usar pageSize por defecto
    }
  }, [user?.id]); // Solo ejecutar cuando cambie el usuario

  return {
    torneos,
    loading,
    error,
    refreshMisTorneos,
    searchMisTorneos,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    handleItemsPerPageChange,
    getFilterOptions,
    paginationInfo,
    searchFilters
  };
};
