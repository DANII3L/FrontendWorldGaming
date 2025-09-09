import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import '../../shared/styles/ModalDynamicForm.css';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/contexts/NotificationContext';

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

  const fields: IFieldConfig[] = [
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

  const initialValues = {
    email: '',
    password: ''
  };
  const [formValues, setFormValues] = useState(initialValues);

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
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header del Modal */}
          <div className="relative p-8 text-center">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>

            {/* Icono */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Inicia Sesión
            </h2>
            <p className="text-white/70 text-sm">
              Accede a tu cuenta de World Gaming
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8">
            <DynamicForm
              fields={fields}
              values={formValues}
              onChange={(name, value) => setFormValues(prev => ({ ...prev, [name]: value }))}
              onSubmit={handleSubmit}
              submitText={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              className="space-y-6 modal-dynamic-form"
              renderSubmitButton={({ submitText, loading }) => (
                <div className="space-y-6">
                  {/* Botón de Login */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {submitText}
                      </div>
                    ) : (
                      submitText
                    )}
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  {/* Enlaces adicionales */}
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex-1 h-px bg-white/20"></div>
                      <span className="text-white/50 text-sm">o continúa con</span>
                      <div className="flex-1 h-px bg-white/20"></div>
                    </div>

                    {/* Botones de redes sociales */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        className="flex items-center justify-center bg-white/10 border border-white/20 rounded-xl py-3 px-4 hover:bg-white/20 transition-all duration-200"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-red-600 rounded"></div>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center bg-white/10 border border-white/20 rounded-xl py-3 px-4 hover:bg-white/20 transition-all duration-200"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-600 rounded"></div>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center bg-white/10 border border-white/20 rounded-xl py-3 px-4 hover:bg-white/20 transition-all duration-200"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded"></div>
                      </button>
                    </div>

                    {/* Enlace para registrarse */}
                    <p className="text-white/60 text-sm">
                      ¿No tienes una cuenta?{' '}
                      <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 