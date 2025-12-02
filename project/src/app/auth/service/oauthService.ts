import { apiService } from '../../shared/services/apiService';

/**
 * Inicia el flujo de autenticación con Google
 * Obtiene la URL de autenticación del backend y redirige
 */
export const initiateGoogleLogin = async (): Promise<void> => {
  try {
    const response = await apiService.get('Auth/google/url');
    
    if (response.success && response.data?.authUrl) {
      window.location.href = response.data.authUrl;
    } else {
      throw new Error(response.message || 'Error al obtener URL de autenticación de Google');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión con Google');
  }
};

/**
 * Inicia el flujo de autenticación con Steam
 * Obtiene la URL de autenticación del backend y redirige
 */
export const initiateSteamLogin = async (): Promise<void> => {
  try {
    const response = await apiService.get('Auth/steam/url');
    
    if (response.success && response.data?.authUrl) {
      window.location.href = response.data.authUrl;
    } else {
      throw new Error(response.message || 'Error al obtener URL de autenticación de Steam');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión con Steam');
  }
};

/**
 * Procesa el callback de Google
 * Envía el código al backend para que maneje toda la lógica
 */
export const processGoogleCallback = async (code: string, state?: string): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  requiresAdditionalData?: boolean;
  message?: string;
}> => {
  try {
    const response = await apiService.post('Auth/google/callback', { code, state });
    
    if (response.success) {
      return {
        success: true,
        token: response.data?.token,
        user: response.data?.user,
        requiresAdditionalData: response.data?.requiresAdditionalData || false
      };
    }
    
    return {
      success: false,
      message: response.message || 'Error en la autenticación con Google'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al procesar callback de Google');
  }
};

/**
 * Procesa el callback de Steam
 * Envía los parámetros OpenID al backend para que maneje toda la lógica
 */
export const processSteamCallback = async (params: Record<string, string>): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  requiresAdditionalData?: boolean;
  message?: string;
}> => {
  try {
    const response = await apiService.post('Auth/steam/callback', params);
    
    if (response.success) {
      return {
        success: true,
        token: response.data?.token,
        user: response.data?.user,
        requiresAdditionalData: response.data?.requiresAdditionalData || false
      };
    }
    
    return {
      success: false,
      message: response.message || 'Error en la autenticación con Steam'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al procesar callback de Steam');
  }
};

/**
 * Completa el registro con datos adicionales requeridos
 */
export const completeOAuthRegistration = async (additionalData: {
  telefono?: string;
  password?: string;
  [key: string]: any;
}): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}> => {
  try {
    const response = await apiService.post('Auth/oauth/complete', additionalData);
    
    if (response.success) {
      return {
        success: true,
        token: response.data?.token,
        user: response.data?.user
      };
    }
    
    return {
      success: false,
      message: response.message || 'Error al completar el registro'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al completar el registro');
  }
};

