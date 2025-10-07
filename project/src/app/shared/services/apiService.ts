import axios from 'axios';
import { notificationService } from './notificationService';
import { navigationService } from './navigationService';
import { performGlobalLogout } from '../../auth/AuthContext';

const API_BASE_URL = 'https://localhost:7082/api/'; // URL de desarrollo

// Función para verificar si es un error de timeout de conexión
const isConnectionTimeoutError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('connection timeout expired') ||
    lowerMessage.includes('timeout period elapsed') ||
    lowerMessage.includes('connection could have timed out') ||
    lowerMessage.includes('post-login') ||
    lowerMessage.includes('pre-login') ||
    lowerMessage.includes('login process and respond') ||
    lowerMessage.includes('multiple active connections') ||
    lowerMessage.includes('duration spent while attempting to connect') ||
    lowerMessage.includes('initialization=') ||
    lowerMessage.includes('handshake=') ||
    lowerMessage.includes('authentication=') ||
    lowerMessage.includes('complete=')
  );
};

// Función para manejar errores de timeout
const handleConnectionTimeout = () => {
  // Usar la función de logout global que actualiza el contexto de React
  performGlobalLogout();
  
  // Mostrar notificación de sesión expirada
  notificationService.error(
    'Tu sesión ha expirado debido a un timeout de conexión. Serás redirigido al inicio.',
    'Sesión Expirada'
  );

  // Redirigir después de un breve delay para que se muestre la notificación
  setTimeout(() => {
    navigationService.navigateToHome();
  }, 1000);
};

// Función para manejar errores de autorización (401)
const handleUnauthorized = () => {
  // Usar la función de logout global que actualiza el contexto de React
  performGlobalLogout();
  
  // Mostrar notificación de sesión expirada
  notificationService.error(
    'Tu sesión ha expirado o no tienes permisos para acceder a este recurso. Serás redirigido al inicio.',
    'Sesión Expirada'
  );

  // Redirigir después de un breve delay para que se muestre la notificación
  setTimeout(() => {
    navigationService.navigateToHome();
  }, 1000);
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    // Adjuntar token de autenticación
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de timeout y autorización
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Verificar si es un error 401 (No autorizado)
    if (error.response?.status === 401) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // Verificar si es un error de timeout de conexión
    const errorMessage = error.response?.data?.message || error.message || '';
    
    // Log para depuración
    console.log('Error detectado:', errorMessage);
    console.log('¿Es timeout de conexión?', isConnectionTimeoutError(errorMessage));
    
    if (isConnectionTimeoutError(errorMessage)) {
      console.log('Ejecutando logout por timeout de conexión');
      handleConnectionTimeout();
    }

    return Promise.reject(error);
  }
);

// Función para normalizar la respuesta
function normalizeResponse(response: any) {
  const status = response?.status ?? 200;
  
  // Si la respuesta es paginada (tiene listFind)
  if (response?.data?.listFind && Array.isArray(response.data.listFind)) {
    return {
      data: response.data.listFind,
      totalRecords: response.data.totalRecords,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      message: response.message ?? 'Operación exitosa',
      success: response.success ?? true,
      status
    };
  }
  
  // Si la respuesta tiene success/message en data (operaciones anidadas)
  if (response?.data?.success !== undefined || response?.data?.message !== undefined) {
    return {
      data: response.data.data ?? response.data,
      message: response.data.message ?? 'Operación exitosa',
      success: response.data.success ?? true,
      status
    };
  }
  
  // Si la respuesta tiene success/message en nivel superior
  if (response?.success !== undefined || response?.message !== undefined) {
    return {
      data: response.data,
      message: response.message ?? 'Operación exitosa',
      success: response.success ?? true,
      status
    };
  }
  
  // Fallback: respuesta normal
  return {
    data: response?.data ?? null,
    message: 'Operación exitosa',
    success: true,
    status
  };
}

function normalizeError(error: any) {
  let message = 'Error desconocido';
  let data = null;
  let success = false;
  let status = error.response?.status ?? 500;
  let validationErrors: Record<string, string[]> | null = null;

  if (error.response?.data) {
    const responseData = error.response.data;
    
    if (typeof responseData === 'string') {
      // Si la respuesta es texto plano, usarla como mensaje
      message = responseData;
    } else if (responseData.error) {
      // Si la respuesta tiene un campo 'error', úsalo como mensaje
      message = responseData.error;
    } else if (responseData.errors && typeof responseData.errors === 'object') {
      // Manejar errores de validación con estructura de campos
      validationErrors = responseData.errors;
      
      // Crear mensaje consolidado de errores de validación
      const errorMessages: string[] = [];
      Object.entries(responseData.errors).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          errors.forEach(errorMsg => {
            errorMessages.push(`${field}: ${errorMsg}`);
          });
        }
      });
      
      if (errorMessages.length > 0) {
        message = errorMessages.join(', ');
      } else {
        message = responseData.title || 'Errores de validación';
      }
      
      data = responseData;
    } else if (responseData.message) {
      message = responseData.message;
      data = responseData.data ?? null;
      success = responseData.success ?? false;
    } else {
      // Fallback para otros tipos de respuesta
      message = responseData.title || responseData.message || message;
      data = responseData;
    }
  } else if (error.message) {
    message = error.message;
  }

  // Verificar si es un error de timeout de conexión
  const isConnectionTimeout = isConnectionTimeoutError(message);

  return {
    data,
    message,
    success,
    status,
    validationErrors,
    isConnectionTimeout
  };
}

// Exportar el servicio de la API
export const apiService = {
  get: async (endpoint: string, params?: any) => {
    try {
      const response = await api.get(endpoint, { params });
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  post: async (endpoint: string, data: any) => {
    try {
      const response = await api.post(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  put: async (endpoint: string, data: any) => {
    try {
      const response = await api.put(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  delete: async (endpoint: string, id: string | number) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  // Funciones utilitarias
  isConnectionTimeoutError,
  handleConnectionTimeout,
  handleUnauthorized,
  
  /**
   * Extrae errores de validación de una respuesta de error
   * @param errorResponse - Respuesta de error del apiService
   * @returns Objeto con errores organizados por campo
   */
  getValidationErrors: (errorResponse: any) => {
    if (errorResponse.validationErrors) {
      return errorResponse.validationErrors;
    }
    return null;
  },
  
  /**
   * Verifica si una respuesta contiene errores de validación
   * @param errorResponse - Respuesta de error del apiService
   * @returns true si contiene errores de validación
   */
  hasValidationErrors: (errorResponse: any) => {
    return errorResponse.validationErrors && Object.keys(errorResponse.validationErrors).length > 0;
  }
};