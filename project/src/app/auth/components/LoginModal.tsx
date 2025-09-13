import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { FormField } from '../../shared/components/ui/DynamicForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
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
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                type="button"
                className="flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-lg group-hover:scale-110 transition-transform duration-200"></div>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg group-hover:scale-110 transition-transform duration-200"></div>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-200"></div>
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