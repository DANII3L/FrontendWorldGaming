import { useState, useEffect, useCallback } from 'react';
import { dynamicService, DynamicSearchParams } from '../../shared/services/dynamicService';
import { apiService } from '../../shared/services/apiService';
import { usePaginationDefaults } from '../../shared/hooks/usePaginationDefaults';
import { useConfirmation } from '../../shared/contexts/ConfirmationContext';
import { 
  TOURNAMENT_STATUS_OPTIONS,
  TOURNAMENT_DIFFICULTY_OPTIONS 
} from '../../shared/constants/tournament';
import { useNotification } from '../../shared/contexts';
import { useDebounce } from '../../shared/hooks/useDebounce';

export interface Torneo {
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
}

export interface TorneosFilters {
  search?: string;
  estado?: string;
  juegoId?: string;
  dificultad?: string;
  isActive?: boolean;
}

export const useTorneos = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<DynamicSearchParams>({});
  const { addNotification } = useNotification();
  
  const { defaults, normalizeParams } = usePaginationDefaults();
  const { showConfirm } = useConfirmation();
  
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    pageNumber: defaults.pageNumber as number,
    pageSize: defaults.pageSize as number
  });

  const cleanFilters = (filters: DynamicSearchParams): DynamicSearchParams => {
    const cleaned: DynamicSearchParams = {};
    
    Object.entries(filters).forEach(([key, value]) => {
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

  const searchTorneos = async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setSearchFilters(filters);
      
      const cleanedFilters = cleanFilters(filters);
      cleanedFilters.IsActive = true;
      
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      
      const response = await dynamicService.search('torneos_response', 'Torneos', cleanedFilters, normalizedPageNumber, normalizedPageSize);
      
      if (response.success) {
        const torneosData = Array.isArray(response.data.listFind) ? response.data.listFind : [];
        setTorneos(torneosData as Torneo[]);

        setPaginationInfo({
          totalRecords: response.data.totalRecords || 0,
          pageNumber: (response.data.pageNumber && response.data.pageNumber > 0) ? response.data.pageNumber : defaults.pageNumber as number,
          pageSize: pageSize || defaults.pageSize as number
        });
      } else {
        setError('Error en la búsqueda: ' + response.message);
        setTorneos([]);
        setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: pageSize || 6 });
      }
    } catch (error: any) {
      setError('Error al buscar torneos: ' + error.message);
      setTorneos([]);
      setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: pageSize || 6 });
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback((searchTerm: string) => {
    const newFilters = { ...searchFilters };
    
    if (searchTerm && searchTerm.trim() !== '') {
      newFilters.Nombre = searchTerm;
    } else {
      delete newFilters.Nombre;
    }
    
    searchTorneos(newFilters, 1, paginationInfo.pageSize);
  }, [searchFilters, searchTorneos, paginationInfo.pageSize]);

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleSearch = (searchTerm: string) => {
    debouncedSearch(searchTerm);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = { ...searchFilters };
    
    if (value && 
        value !== '' && 
        value !== 'Seleccionar...' && 
        value !== 'select') {
      newFilters[filterKey as keyof DynamicSearchParams] = value;
    } else {
      delete newFilters[filterKey as keyof DynamicSearchParams];
    }
    
    searchTorneos(newFilters, 1, paginationInfo.pageSize);
  };

  const handlePageChange = (newPageNumber: number) => {
    searchTorneos(searchFilters, newPageNumber, paginationInfo.pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    searchTorneos(searchFilters, 1, newPageSize);
  };

  const clearFilters = () => {
    const emptyFilters: DynamicSearchParams = {};
    searchTorneos(emptyFilters, 1, paginationInfo.pageSize);
  };

  const refreshTorneos = () => {
    searchTorneos(searchFilters, paginationInfo.pageNumber, paginationInfo.pageSize);
  };

  const handleDeleteTournament = async (tournamentId: number) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Torneo',
      message: '¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      try {
        setLoading(true);
        const response = await apiService.delete('Torneos', tournamentId);
        
        if (response.success) {
          addNotification('Torneo eliminado exitosamente', 'success');
          refreshTorneos();
        } else {
          setError('Error al eliminar el torneo: ' + response.message);
        }
      } catch (error: any) {
        setError('Error al eliminar el torneo: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    searchTorneos({});
  }, []);

  const getFilterOptions = () => ({
    estado: TOURNAMENT_STATUS_OPTIONS,
    dificultad: TOURNAMENT_DIFFICULTY_OPTIONS
  });

  return {
    torneos,
    loading,
    error,
    totalItems: paginationInfo.totalRecords,
    pageNumber: paginationInfo.pageNumber,
    pageSize: paginationInfo.pageSize,
    searchFilters,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    clearFilters,
    refreshTorneos,
    handleDeleteTournament,
    getFilterOptions,
    searchTorneos
  };
};
