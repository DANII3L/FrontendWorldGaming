import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';
import { FormField } from '../../shared/components/ui/DynamicForm';
import { initiateGoogleLogin, initiateSteamLogin } from '../service/oauthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<'google' | 'steam' | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const fields: FormField[] = [
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      placeholder: 'tu@email.com',
      colSpan: 2
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      minLength: 6,
      colSpan: 2
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsLoading(true);

    try {
      const success = await login(values.email, values.password);
      if (success) {
        addNotification('¡Bienvenido de nuevo!', 'success');
        onClose();
        navigate('/worldGaming/inicio', { replace: true });
      }
    } catch (err: any) {
      addNotification(err.message || 'Credenciales o ID de empresa inválidos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Mostrar loading al iniciar sesión
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl">
          <LoadingScreen
            title="Iniciando Sesión"
            subtitle="Validando tus credenciales..."
            description="Estamos verificando tu cuenta en WorldGaming. Esto puede tomar unos momentos."
            showDetails={true}
            details={{
              title: "Información del login",
              items: [
                {
                  label: 'Estado',
                  value: 'Validando...'
                },
                {
                  label: 'Autenticación',
                  value: 'En progreso'
                },
                {
                  label: 'Siguiente paso',
                  value: 'Redirigir al dashboard'
                }
              ]
            }}
            variant="detailed"
            className="bg-transparent min-h-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con efecto de partículas estelares */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Partículas estelares animadas */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          
          {/* Header del Modal */}
          <div className="relative p-8 text-center">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-full p-2"
            >
              <X size={20} />
            </button>

            {/* Icono mejorado */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center relative z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Título mejorado */}
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              INICIA SESIÓN
            </h2>
            <p className="text-white/80 text-base font-medium">
              Accede a tu cuenta de World Gaming
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8 relative z-10">
            <DynamicForm
              fields={fields}
              onSubmit={handleSubmit}
              submitText={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              loading={isLoading}
              renderSubmitButton={({ submitText, loading }) => (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 font-semibold text-lg relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      {submitText}
                    </div>
                  ) : (
                    <span className="relative z-10">{submitText}</span>
                  )}
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {/* Efecto de resplandor */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            />

            {/* Separador */}
            <div className="flex items-center justify-center space-x-4 py-2 mt-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="text-white/60 text-sm font-medium px-3">o continúa con</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Botones de redes sociales */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={async () => {
                  setOAuthLoading('google');
                  try {
                    await initiateGoogleLogin();
                  } catch (error: any) {
                    setOAuthLoading(null);
                    addNotification(error.message || 'Error al iniciar sesión con Google', 'error');
                    console.error('Error en Google OAuth:', error);
                  }
                }}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="text-white text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  setOAuthLoading('steam');
                  try {
                    await initiateSteamLogin();
                  } catch (error: any) {
                    setOAuthLoading(null);
                    addNotification(error.message || 'Error al iniciar sesión con Steam', 'error');
                  }
                }}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading === 'steam' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    <path d="M8.5 7.5h7v9h-7v-9zm1 1v7h5v-7h-5z"/>
                    <path d="M10 9h4v1h-4V9zm0 2h4v1h-4v-1zm0 2h3v1h-3v-1z"/>
                  </svg>
                )}
                <span className="text-white text-sm font-medium">Steam</span>
              </button>
            </div>

            {/* Enlace para registrarse */}
            <div className="text-center pt-4">
              <p className="text-white/70 text-sm">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-all duration-200 hover:underline decoration-purple-400 underline-offset-2"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 