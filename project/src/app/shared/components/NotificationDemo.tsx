import React from 'react';
import { useNotificationCenter } from '../contexts/NotificationCenterContext';
import { useNotificationModal } from '../contexts/NotificationModalContext';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import { Bell, Plus, Trash2, RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationDemo: React.FC = () => {
  const { 
    addNotification, 
    clearAll, 
    refreshNotifications, 
    loading, 
    error,
    notifications 
  } = useNotificationCenter();
  const { openNotificationModal } = useNotificationModal();

  // Hooks para operaciones async específicas
  const addNotificationOp = useAsyncOperation(addNotification, {
    onSuccess: () => console.log('Notificación agregada exitosamente'),
    onError: (error) => console.error('Error al agregar notificación:', error)
  });

  const clearAllOp = useAsyncOperation(clearAll, {
    onSuccess: () => console.log('Todas las notificaciones eliminadas'),
    onError: (error) => console.error('Error al limpiar notificaciones:', error)
  });

  const refreshOp = useAsyncOperation(refreshNotifications, {
    onSuccess: () => console.log('Notificaciones actualizadas'),
    onError: (error) => console.error('Error al actualizar notificaciones:', error)
  });

  const handleAddTestNotification = async () => {
    const types = ['tournament', 'message', 'success', 'warning', 'info', 'error'];
    const priorities = ['high', 'medium', 'low'];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    await addNotificationOp.execute({
      type: randomType as any,
      title: `Notificación de Prueba - ${randomType.toUpperCase()}`,
      message: `Esta es una notificación de prueba generada automáticamente con prioridad ${randomPriority}.`,
      priority: randomPriority as any,
      action: Math.random() > 0.5 ? {
        label: 'Ver Detalles',
        url: '/demo'
      } : undefined
    });
  };

  const handleAddMultipleNotifications = async () => {
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        addNotificationOp.execute({
          type: 'info',
          title: `Notificación Múltiple ${i + 1}`,
          message: `Esta es la notificación número ${i + 1} de una serie de 3.`,
          priority: 'medium'
        })
      );
    }
    await Promise.all(promises);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-bold text-white">Demo del Sistema de Notificaciones</h2>
      </div>

      {/* Estado actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-sm text-white/60 mb-1">Total Notificaciones</div>
          <div className="text-2xl font-bold text-white">{notifications.length}</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-sm text-white/60 mb-1">Estado</div>
          <div className="text-2xl font-bold text-white">
            {loading ? (
              <span className="text-orange-400 flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b border-orange-400"></div>
                Cargando
              </span>
            ) : (
              <span className="text-green-400">Listo</span>
            )}
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-sm text-white/60 mb-1">Error</div>
          <div className="text-2xl font-bold text-white">
            {error ? (
              <span className="text-red-400 text-sm">{error}</span>
            ) : (
              <span className="text-green-400">Ninguno</span>
            )}
          </div>
        </div>
      </div>

             {/* Botones de acción */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
         <button
           onClick={openNotificationModal}
           disabled={loading}
           className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <Bell className="h-4 w-4" />
           Abrir Centro
         </button>

         <button
           onClick={handleAddTestNotification}
           disabled={loading || addNotificationOp.loading}
           className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {addNotificationOp.loading ? (
             <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
           ) : (
             <Plus className="h-4 w-4" />
           )}
           {addNotificationOp.loading ? 'Agregando...' : 'Agregar Notificación'}
         </button>

         <button
           onClick={handleAddMultipleNotifications}
           disabled={loading || addNotificationOp.loading}
           className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <Plus className="h-4 w-4" />
           Agregar Múltiples
         </button>

         <button
           onClick={() => refreshOp.execute()}
           disabled={loading || refreshOp.loading}
           className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <RotateCcw className={`h-4 w-4 ${refreshOp.loading ? 'animate-spin' : ''}`} />
           {refreshOp.loading ? 'Actualizando...' : 'Actualizar'}
         </button>
       </div>

             {/* Botones de limpieza */}
       <div className="flex gap-3">
         <button
           onClick={() => clearAllOp.execute()}
           disabled={loading || clearAllOp.loading || notifications.length === 0}
           className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {clearAllOp.loading ? (
             <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
           ) : (
             <Trash2 className="h-4 w-4" />
           )}
           {clearAllOp.loading ? 'Limpiando...' : 'Limpiar Todas'}
         </button>
       </div>

             {/* Información adicional */}
       <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
         <h3 className="text-lg font-semibold text-white mb-2">Características del Sistema:</h3>
         <ul className="text-sm text-white/80 space-y-1">
           <li>• <strong>Loading States:</strong> Todos los botones muestran estado de carga</li>
           <li>• <strong>Error Handling:</strong> Manejo de errores con reintentos</li>
           <li>• <strong>Async Operations:</strong> Simulación de llamadas a API con delays</li>
           <li>• <strong>Responsive:</strong> Diseño adaptativo para móviles y desktop</li>
           <li>• <strong>Real-time Updates:</strong> Actualización en tiempo real del estado</li>
           <li>• <strong>Individual Loading:</strong> Cada operación tiene su propio estado de loading</li>
         </ul>
       </div>

       {/* Estados de operaciones async */}
       <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
         <h3 className="text-lg font-semibold text-white mb-2">Estados de Operaciones:</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="flex items-center gap-2">
             {addNotificationOp.loading ? (
               <div className="animate-spin rounded-full h-4 w-4 border-b border-blue-400"></div>
             ) : addNotificationOp.error ? (
               <AlertCircle className="h-4 w-4 text-red-400" />
             ) : (
               <CheckCircle className="h-4 w-4 text-green-400" />
             )}
             <span className="text-sm text-white/80">Agregar Notificación</span>
           </div>
           
           <div className="flex items-center gap-2">
             {refreshOp.loading ? (
               <div className="animate-spin rounded-full h-4 w-4 border-b border-blue-400"></div>
             ) : refreshOp.error ? (
               <AlertCircle className="h-4 w-4 text-red-400" />
             ) : (
               <CheckCircle className="h-4 w-4 text-green-400" />
             )}
             <span className="text-sm text-white/80">Actualizar</span>
           </div>
           
           <div className="flex items-center gap-2">
             {clearAllOp.loading ? (
               <div className="animate-spin rounded-full h-4 w-4 border-b border-blue-400"></div>
             ) : clearAllOp.error ? (
               <AlertCircle className="h-4 w-4 text-red-400" />
             ) : (
               <CheckCircle className="h-4 w-4 text-green-400" />
             )}
             <span className="text-sm text-white/80">Limpiar Todas</span>
           </div>
         </div>
       </div>
    </div>
  );
};

export default NotificationDemo;
