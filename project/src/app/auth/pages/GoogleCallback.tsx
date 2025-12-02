import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import { processGoogleCallback, completeOAuthRegistration } from '../service/oauthService';
import OAuthCompleteModal from '../components/OAuthCompleteModal';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          let errorMessage = 'Error en la autenticación con Google';
          if (error === 'access_denied') {
            errorMessage = 'Acceso denegado. Por favor, autoriza la aplicación.';
          } else if (error === 'invalid_client') {
            errorMessage = 'Google OAuth no está configurado correctamente en el servidor.';
          }
          addNotification(errorMessage, 'error');
          navigate('/');
          return;
        }

        if (!code) {
          addNotification('Código de autorización no recibido', 'error');
          navigate('/');
          return;
        }

        // Enviar código al backend para que procese todo
        const result = await processGoogleCallback(code, state || undefined);

        if (result.success && result.token && result.user) {
          if (result.requiresAdditionalData) {
            // Mostrar modal para completar datos
            setShowCompleteModal(true);
            setLoading(false);
          } else {
            // Login exitoso, redirigir
            loginWithOAuth(result.token, result.user);
            addNotification('¡Bienvenido a World Gaming!', 'success');
            navigate('/worldGaming/inicio', { replace: true });
          }
        } else {
          addNotification(result.message || 'Error en la autenticación', 'error');
          navigate('/');
        }
      } catch (error: any) {
        addNotification(error.message || 'Error al procesar la autenticación', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithOAuth, addNotification]);

  const handleCompleteRegistration = async (additionalData: Record<string, any>) => {
    try {
      const result = await completeOAuthRegistration(additionalData);
      
      if (result.success && result.token && result.user) {
        loginWithOAuth(result.token, result.user);
        setShowCompleteModal(false);
        addNotification('¡Bienvenido a World Gaming!', 'success');
        navigate('/worldGaming/inicio', { replace: true });
      } else {
        addNotification(result.message || 'Error al completar el registro', 'error');
      }
    } catch (error: any) {
      addNotification(error.message || 'Error al completar el registro', 'error');
    }
  };

  if (showCompleteModal) {
    return (
      <OAuthCompleteModal
        isOpen={showCompleteModal}
        onComplete={handleCompleteRegistration}
      />
    );
  }

  return (
    <LoadingScreen
      title="Autenticando con Google"
      subtitle="Procesando tu información..."
      description="Estamos verificando tu cuenta de Google y configurando tu perfil."
    />
  );
};

export default GoogleCallback;

