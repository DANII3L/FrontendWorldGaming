import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import DynamicForm, { FormField } from '../../shared/components/ui/DynamicForm';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import { completeOAuthRegistration } from '../service/oauthService';

interface OAuthCompleteModalProps {
  isOpen: boolean;
  onComplete: (additionalData: Record<string, any>) => Promise<void>;
}

const OAuthCompleteModal: React.FC<OAuthCompleteModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  // Campos requeridos que pueden faltar
  const fields: FormField[] = [
    {
      name: 'Telefono',
      label: 'Teléfono (Opcional)',
      type: 'phone',
      placeholder: 'Número de teléfono',
      colSpan: 2
    },
    {
      name: 'password',
      label: 'Contraseña (Opcional)',
      type: 'password',
      placeholder: 'Crea una contraseña para acceso directo',
      minLength: 6,
      colSpan: 2,
      helpText: 'Opcional: Crea una contraseña para poder iniciar sesión sin OAuth'
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsLoading(true);

    try {
      const additionalData = {
        telefono: values.Telefono || undefined,
        password: values.password || undefined
      };
      
      await onComplete(additionalData);
    } catch (error: any) {
      addNotification(error.message || 'Error al completar el registro', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {}}
      />
      
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          
          <div className="relative p-8">
            <button
              onClick={() => {}}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-full p-2"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center relative z-10">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-sm" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                ¡Casi Listo!
              </h2>
              <p className="text-white/80 text-base font-medium mb-2">
                Completa tu perfil de World Gaming
              </p>
              <p className="text-white/60 text-sm">
                Agrega información adicional para completar tu registro
              </p>
            </div>

            <DynamicForm
              fields={fields}
              onSubmit={handleSubmit}
              submitText={isLoading ? "Completando..." : "Completar Registro"}
              loading={isLoading}
              renderSubmitButton={({ submitText, loading }) => (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-4 px-6 rounded-2xl hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/25 font-semibold text-lg relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      {submitText}
                    </div>
                  ) : (
                    <span className="relative z-10">{submitText}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCompleteModal;

