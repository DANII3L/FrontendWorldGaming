import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import { processSteamCallback, completeOAuthRegistration } from '../service/oauthService';
import OAuthCompleteModal from '../components/OAuthCompleteModal';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';

const SteamCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Steam OpenID devuelve parámetros en la URL
        const openIdParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          openIdParams[key] = value;
        });

        // Verificar que tenemos los parámetros necesarios
        if (!openIdParams['openid.mode'] || openIdParams['openid.mode'] !== 'id_res') {
          addNotification('Error en la autenticación con Steam', 'error');
          navigate('/');
          return;
        }

        // Enviar parámetros al backend para que procese todo
        const result = await processSteamCallback(openIdParams);

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
      title="Autenticando con Steam"
      subtitle="Procesando tu información..."
      description="Estamos verificando tu cuenta de Steam y configurando tu perfil."
    />
  );
};

export default SteamCallback;

