import React from 'react';

export interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showDetails?: boolean;
  details?: {
    title: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  };
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Cargando...',
  subtitle = 'Procesando información...',
  description,
  showDetails = false,
  details,
  variant = 'default',
  className = ''
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="w-12 h-12 mx-auto">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Gamepad minimalista */}
              <div className="relative">
                {/* Cuerpo del gamepad */}
                <div className="w-8 h-4 bg-gray-700 rounded-lg border border-gray-600 shadow-md"></div>
                {/* Stick izquierdo */}
                <div className="absolute -top-1 left-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {/* Stick derecho */}
                <div className="absolute -top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative mx-auto w-20 h-20">
            {/* Gamepad principal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Cuerpo principal del gamepad */}
                <div className="w-14 h-7 bg-gray-800 rounded-xl border border-gray-600 shadow-lg">
                  {/* Botones de acción (A, B, X, Y) */}
                  <div className="absolute top-1 right-1.5 flex space-x-0.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="absolute top-2.5 right-1.5 flex space-x-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                  
                  {/* D-Pad */}
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-gray-900 rounded-sm">
                    <div className="absolute top-0 left-1 w-0.5 h-0.5 bg-white/70 rounded-sm animate-pulse"></div>
                    <div className="absolute bottom-0 left-1 w-0.5 h-0.5 bg-white/70 rounded-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute left-0 top-1 w-0.5 h-0.5 bg-white/70 rounded-sm animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="absolute right-0 top-1 w-0.5 h-0.5 bg-white/70 rounded-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
                
                {/* Stick izquierdo */}
                <div className="absolute -top-1.5 left-1.5 w-3 h-3 bg-gray-700 rounded-full border border-gray-600 shadow-md animate-bounce">
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                
                {/* Stick derecho */}
                <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-gray-700 rounded-full border border-gray-600 shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                
                {/* Triggers */}
                <div className="absolute -top-0.5 left-0 w-5 h-1.5 bg-gray-700 rounded-t-lg border border-gray-600"></div>
                <div className="absolute -top-0.5 right-0 w-5 h-1.5 bg-gray-700 rounded-t-lg border border-gray-600"></div>
              </div>
            </div>
            
            {/* Efectos de carga sutiles */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1.5s' }}></div>
          </div>
        );
    }
  };

  const renderDetails = () => {
    if (!showDetails || !details) return null;

    return (
      <div className="bg-white/5 backdrop-blur-lg p-4 rounded-xl border border-white/10 w-full">
        <h3 className="text-white font-semibold mb-2 text-sm">{details.title}</h3>
        <div className="space-y-1 text-xs text-white/70">
          {details.items.map((item, index) => (
            <p key={index}>
              <span className="font-medium">{item.label}:</span> {item.value}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center space-y-4 max-w-xl w-full px-4">
        
        {/* Texto de carga */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-white/70 text-base">{subtitle}</p>
            {description && (
              <p className="text-white/60 text-xs max-w-md mx-auto">{description}</p>
            )}
          </div>
          
          {/* Spinner centralizado */}
          <div className="flex justify-center">
            {renderSpinner()}
          </div>
        </div>
        
        {/* Detalles opcionales */}
        {renderDetails()}
      </div>
    </div>
  );
};

export default LoadingScreen;
