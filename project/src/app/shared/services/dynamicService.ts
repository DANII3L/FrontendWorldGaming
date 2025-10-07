import { apiService } from './apiService';

// Interfaces para el servicio dinámico
export interface DynamicSearchParams {
  Id?: number;
  Nombre?: string;
  Descripcion?: string;
  CategoriaId?: number;
  IsActive?: boolean;
  Dificultad?: string;
  MaxJugadores?: number;
}

export interface DynamicSearchRequest {
  entityType: string;
  procedureSuffix?: string;
  parameters: DynamicSearchParams;
  pageNumber?: number | null;
  pageSize?: number | null;
}

export interface DynamicSearchResponse<T> {
  success: boolean;
  message: string;
  data: {
    listFind: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  };
}

/**
 * Servicio para realizar búsquedas dinámicas
 */
export const dynamicService = {
  /**
   * Realizar búsqueda dinámica
   * @param entityType - Tipo de entidad (ej: "juegos_response")
   * @param procedureSuffix - Sufijo del procedimiento (ej: "juegos") - Opcional
   * @param parameters - Parámetros de búsqueda
   * @param pageNumber - Número de página (opcional)
   * @param pageSize - Tamaño de página (opcional)
   * @returns Promise con los resultados
   */
  search: async <T>(
    entityType: string,
    procedureSuffix?: string | null,
    parameters: DynamicSearchParams = {},
    pageNumber?: number | null,
    pageSize?: number | null
  ): Promise<DynamicSearchResponse<T>> => {
    // Construir el cuerpo de la petición
    const requestBody: any = {
      entityType,
      pageNumber: pageNumber ?? null,
      pageSize: pageSize ?? null
    };

    // Solo agregar procedureSuffix si no está vacío o es null
    if (procedureSuffix && procedureSuffix.trim() !== '') {
      requestBody.procedureSuffix = procedureSuffix;
    }

    // Solo agregar parameters si hay filtros
    const hasFilters = Object.keys(parameters).length > 0;
    if (hasFilters) {
      requestBody.parameters = parameters;
    }

    try {
      const response = await apiService.post('Dynamic/getDinamyc', requestBody);
      return {
        success: response.success,
        message: response.message,
        data: {
          listFind: response.data?.listFind || [],
          totalRecords: response.data?.totalRecords || 0,
          pageNumber: response.data?.pageNumber || 1,
          pageSize: response.data?.pageSize || 6
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error en la búsqueda dinámica',
        data: {
          listFind: [],
          totalRecords: 0,
          pageNumber: 1,
          pageSize: 6
        }
      };
    }
  },

  /**
   * Buscar juegos con filtros específicos
   * @param filters - Filtros de búsqueda
   * @param pageNumber - Número de página (opcional)
   * @param pageSize - Tamaño de página (opcional)
   * @returns Promise con los juegos encontrados
   */
  searchGames: async (
    filters: DynamicSearchParams,
    pageNumber?: number | null,
    pageSize?: number | null
  ): Promise<DynamicSearchResponse<any>> => {
    return dynamicService.search(
      'juegos_response',
      'juegos',
      filters,
      pageNumber ?? null,
      pageSize ?? null
    );
  }
};
