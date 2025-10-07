import { useState, useCallback, useMemo } from 'react';

/**
 * Interface para información de paginación
 */
export interface PaginationInfo {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Interface para opciones de paginación
 */
export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
}

/**
 * Hook personalizado para manejo de paginación
 * Proporciona estado y funciones para manejar paginación del lado del cliente y servidor
 * 
 * @param options - Opciones de configuración de paginación
 * @returns Objeto con estado y funciones de paginación
 */
export const usePagination = (options: PaginationOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 6,
    defaultPageSize = 6,
    maxPageSize = 100
  } = options;

  // Estado local de paginación
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);
  
  // Estado para información de paginación del servidor
  const [serverPagination, setServerPagination] = useState<PaginationInfo>({
    totalRecords: 0,
    pageNumber: initialPage,
    pageSize: initialPageSize,
    totalPages: 0
  });

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    if (serverPagination.totalRecords > 0) {
      return Math.ceil(serverPagination.totalRecords / serverPagination.pageSize);
    }
    return 0;
  }, [serverPagination.totalRecords, serverPagination.pageSize]);

  // Función para cambiar de página
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      return newPage;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    const validPageSize = Math.min(Math.max(newItemsPerPage, 1), maxPageSize);
    setItemsPerPage(validPageSize);
    setCurrentPage(1); // Resetear a la primera página
    return { pageNumber: 1, pageSize: validPageSize };
  }, [maxPageSize]);

  // Función para actualizar información de paginación del servidor
  const updateServerPagination = useCallback((info: Partial<PaginationInfo>) => {
    setServerPagination(prev => ({
      ...prev,
      ...info,
      totalPages: info.totalRecords ? Math.ceil(info.totalRecords / (info.pageSize || prev.pageSize)) : prev.totalPages
    }));
  }, []);

  // Función para resetear paginación
  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setItemsPerPage(initialPageSize);
    setServerPagination({
      totalRecords: 0,
      pageNumber: initialPage,
      pageSize: initialPageSize,
      totalPages: 0
    });
  }, [initialPage, initialPageSize]);

  // Función para obtener información de paginación efectiva
  const getEffectivePagination = useCallback(() => {
    // Priorizar información del servidor si está disponible
    const effectivePage = serverPagination.pageNumber > 0 ? serverPagination.pageNumber : currentPage;
    const effectivePageSize = serverPagination.pageSize > 0 ? serverPagination.pageSize : itemsPerPage;
    const effectiveTotalRecords = serverPagination.totalRecords || 0;
    const effectiveTotalPages = serverPagination.totalPages || totalPages;

    return {
      pageNumber: effectivePage,
      pageSize: effectivePageSize,
      totalRecords: effectiveTotalRecords,
      totalPages: effectiveTotalPages
    };
  }, [serverPagination, currentPage, itemsPerPage, totalPages]);

  // Función para calcular el rango de elementos mostrados
  const getDisplayRange = useCallback(() => {
    const { pageNumber, pageSize, totalRecords } = getEffectivePagination();
    const startIndex = (pageNumber - 1) * pageSize + 1;
    const endIndex = Math.min(pageNumber * pageSize, totalRecords);
    
    return {
      startIndex: totalRecords > 0 ? startIndex : 0,
      endIndex,
      totalRecords
    };
  }, [getEffectivePagination]);

  // Función para verificar si hay páginas anteriores/siguientes
  const canGoToPreviousPage = useMemo(() => {
    const { pageNumber } = getEffectivePagination();
    return pageNumber > 1;
  }, [getEffectivePagination]);

  const canGoToNextPage = useMemo(() => {
    const { pageNumber, totalPages } = getEffectivePagination();
    return pageNumber < totalPages;
  }, [getEffectivePagination]);

  // Función para ir a la página anterior
  const goToPreviousPage = useCallback(() => {
    const { pageNumber } = getEffectivePagination();
    if (canGoToPreviousPage) {
      return handlePageChange(pageNumber - 1);
    }
    return pageNumber;
  }, [getEffectivePagination, canGoToPreviousPage, handlePageChange]);

  // Función para ir a la página siguiente
  const goToNextPage = useCallback(() => {
    const { pageNumber } = getEffectivePagination();
    if (canGoToNextPage) {
      return handlePageChange(pageNumber + 1);
    }
    return pageNumber;
  }, [getEffectivePagination, canGoToNextPage, handlePageChange]);

  // Función para ir a la primera página
  const goToFirstPage = useCallback(() => {
    return handlePageChange(1);
  }, [handlePageChange]);

  // Función para ir a la última página
  const goToLastPage = useCallback(() => {
    const { totalPages } = getEffectivePagination();
    return handlePageChange(totalPages);
  }, [getEffectivePagination, handlePageChange]);

  return {
    // Estado
    currentPage,
    itemsPerPage,
    serverPagination,
    totalPages,
    
    // Información efectiva
    effectivePagination: getEffectivePagination(),
    displayRange: getDisplayRange(),
    
    // Estados de navegación
    canGoToPreviousPage,
    canGoToNextPage,
    
    // Funciones de navegación
    handlePageChange,
    handleItemsPerPageChange,
    goToPreviousPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
    
    // Funciones de utilidad
    updateServerPagination,
    resetPagination,
    getEffectivePagination,
    getDisplayRange
  };
};
