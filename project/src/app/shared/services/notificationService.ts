import { NotificationItem } from '../contexts/NotificationCenterContext';

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de datos de notificaciones
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'tournament',
    title: 'Torneo Iniciado',
    message: 'El torneo "CS2 Championship 2025" ha comenzado. Tu partida está programada para las 15:00.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    read: false,
    action: {
      label: 'Ver Torneo',
      url: '/tournaments/active'
    },
    priority: 'high'
  },
  {
    id: '2',
    type: 'message',
    title: 'Nuevo Mensaje',
    message: 'Tu equipo ha recibido un mensaje del organizador del torneo.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    read: false,
    action: {
      label: 'Leer Mensaje',
      url: '/messages'
    },
    priority: 'medium'
  },
  {
    id: '3',
    type: 'success',
    title: 'Victoria Confirmada',
    message: 'Tu resultado ha sido confirmado. ¡Felicidades por la victoria!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Recordatorio de Partida',
    message: 'Tu próxima partida comienza en 30 minutos. Prepárate.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
    read: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'info',
    title: 'Actualización del Sistema',
    message: 'Se han implementado nuevas funcionalidades en la plataforma.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    read: true,
    priority: 'low'
  }
];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationItem[] = [...mockNotifications];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Obtener todas las notificaciones
  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    try {
      // Simular delay de red
      await delay(800);
      
      // Simular error aleatorio (5% de probabilidad)
      if (Math.random() < 0.05) {
        throw new Error('Error de conexión');
      }

      return {
        success: true,
        data: [...this.notifications],
        message: 'Notificaciones obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error al obtener notificaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Agregar nueva notificación
  async addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<ApiResponse<NotificationItem>> {
    try {
      // Simular delay de procesamiento
      await delay(600);

      const newNotification: NotificationItem = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      };

      this.notifications.unshift(newNotification);

      return {
        success: true,
        data: newNotification,
        message: 'Notificación agregada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as NotificationItem,
        message: 'Error al agregar notificación',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Marcar notificación como leída
  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    try {
      // Simular delay de actualización
      await delay(400);

      const notification = this.notifications.find(n => n.id === id);
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }

      notification.read = true;

      return {
        success: true,
        data: true,
        message: 'Notificación marcada como leída'
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Error al marcar notificación como leída',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Marcar todas como leídas
  async markAllAsRead(): Promise<ApiResponse<boolean>> {
    try {
      // Simular delay de procesamiento masivo
      await delay(1000);

      this.notifications.forEach(n => n.read = true);

      return {
        success: true,
        data: true,
        message: 'Todas las notificaciones marcadas como leídas'
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Error al marcar todas las notificaciones como leídas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Eliminar notificación
  async deleteNotification(id: string): Promise<ApiResponse<boolean>> {
    try {
      // Simular delay de eliminación
      await delay(500);

      const index = this.notifications.findIndex(n => n.id === id);
      if (index === -1) {
        throw new Error('Notificación no encontrada');
      }

      this.notifications.splice(index, 1);

      return {
        success: true,
        data: true,
        message: 'Notificación eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Error al eliminar notificación',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Limpiar todas las notificaciones
  async clearAllNotifications(): Promise<ApiResponse<boolean>> {
    try {
      // Simular delay de limpieza masiva
      await delay(800);

      this.notifications = [];

      return {
        success: true,
        data: true,
        message: 'Todas las notificaciones eliminadas'
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Error al limpiar notificaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats(): Promise<ApiResponse<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }>> {
    try {
      // Simular delay de procesamiento
      await delay(600);

      const stats = {
        total: this.notifications.length,
        unread: this.notifications.filter(n => !n.read).length,
        byType: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      };

      // Contar por tipo
      this.notifications.forEach(n => {
        stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
        stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
      });

      return {
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: { total: 0, unread: 0, byType: {}, byPriority: {} },
        message: 'Error al obtener estadísticas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

export default NotificationService;
