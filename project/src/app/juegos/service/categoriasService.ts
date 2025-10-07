import { apiService } from '../../shared/services/apiService';
import { dynamicService, DynamicSearchParams } from '../../shared/services/dynamicService';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface CategoriasResponse {
  success: boolean;
  message: string;
  data: {
    listFind: Categoria[];
    totalRecords: number;
    pageNumber: number | null;
    pageSize: number | null;
  };
}

  // Función para obtener todas las categorías usando DynamicService
  const obtenerCategorias = async (): Promise<Categoria[]> => {
    // Usar un pageSize muy grande para obtener todas las categorías
    const response = await dynamicService.search('categorias_juegos', null, {}, 1, 1000);
    return response.success ? response.data.listFind as Categoria[] : [];
  };

// Función para buscar categorías con filtros usando DynamicService
const buscarCategorias = async (filters: DynamicSearchParams = {}, pageNumber?: number, pageSize?: number) => {
  return await dynamicService.search('categorias_juegos', null, filters, pageNumber, pageSize);
};

// Función para obtener una categoría por ID
const obtenerCategoriaPorId = async (id: number): Promise<Categoria> => {
  const response = await apiService.get(`CategoriasJuegos/${id}`);
  return response.data;
};

// Función para crear una nueva categoría
const crearCategoria = async (categoriaData: Omit<Categoria, 'id'>): Promise<Categoria> => {
  const response = await apiService.post('CategoriasJuegos', categoriaData);
  return response.data;
};

// Función para actualizar una categoría
const actualizarCategoria = async (id: number, categoriaData: Partial<Omit<Categoria, 'id'>>): Promise<Categoria> => {
  const response = await apiService.put(`CategoriasJuegos/${id}`, categoriaData);
  return response.data;
};

// Función para eliminar una categoría
const eliminarCategoria = async (id: number): Promise<void> => {
  await apiService.delete('CategoriasJuegos', id);
};

export { 
  obtenerCategorias, 
  buscarCategorias,
  obtenerCategoriaPorId, 
  crearCategoria, 
  actualizarCategoria, 
  eliminarCategoria 
};
