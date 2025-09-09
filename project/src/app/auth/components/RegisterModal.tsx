import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import '../../shared/styles/ModalDynamicForm.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const fields: IFieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      required: true,
      placeholder: 'Tu nombre completo',
      colSpan: 2
    },
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
      colSpan: 1
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      minLength: 6,
      colSpan: 1
    }
  ];

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = async (values: Record<string, any>) => {
    if (values.password !== values.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    
    // Simular proceso de registro
    setTimeout(() => {
      setIsLoading(false);
      console.log('Register values:', values);
      // Aquí iría la lógica real de registro
    }, 2000);
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Crea tu Cuenta
            </h2>
            <p className="text-white/70 text-sm">
              Únete a World Gaming y comienza tu aventura
            </p>
          </div>

                     {/* Formulario */}
           <div className="px-8 pb-8">
             <DynamicForm
               fields={fields}
               initialValues={initialValues}
               onSubmit={handleSubmit}
               submitText={isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
               className="space-y-6 modal-dynamic-form"
               renderSubmitButton={({ submitText }) => (
                 <div className="space-y-6">
                   {/* Botón de Registro */}
                   <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium relative overflow-hidden group"
                   >
                     {isLoading ? (
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
                       <span className="text-white/50 text-sm">o regístrate con</span>
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

                     {/* Enlace para iniciar sesión */}
                     <p className="text-white/60 text-sm">
                       ¿Ya tienes una cuenta?{' '}
                       <button
                         type="button"
                         onClick={onSwitchToLogin}
                         className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
                       >
                         Inicia sesión aquí
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

export default RegisterModal; 