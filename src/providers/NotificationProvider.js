<script setup lang="ts"></script>
import { ref, onMounted } from 'vue';

export interface Notification {
  id?: number;
  title: string;
  content: string;
  type: string;
  timestamp?: string;
  read?: boolean;
}

export function useNotifications() {
  const newNotification = ref<Notification>({
    title: '',
    content: '',
    type: 'info'
  });

  const notifications = ref<Notification[]>([]);
  const isLoading = ref(false);
  const statusMessage = ref<{ text: string, success: boolean } | null>(null);

  const fetchNotifications = async () => {
    isLoading.value = true;
    try {
  const response = await fetch('https://backend-senaclub-xtrt.onrender.com/notifications');
      if (!response.ok) throw new Error('Error al cargar notificaciones');
      const data = await response.json();
      notifications.value = data;
    } catch (error) {
      console.error(error);
      statusMessage.value = {
        text: 'Error al cargar notificaciones. Por favor, intente de nuevo.',
        success: false
      };
    } finally {
      isLoading.value = false;
    }
  };

  const createNotification = async () => {
    isLoading.value = true;
    try {
      const notificationData = {
        ...newNotification.value,
        timestamp: new Date().toLocaleString(),
        read: false
      };

  const response = await fetch('https://backend-senaclub-xtrt.onrender.com/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) throw new Error('Error al crear notificación');

      const savedNotification = await response.json();
      notifications.value.unshift(savedNotification);

      newNotification.value = { title: '', content: '', type: 'info' };

      statusMessage.value = { text: 'Notificación creada correctamente', success: true };
      setTimeout(() => statusMessage.value = null, 3000);
    } catch (error) {
      console.error(error);
      statusMessage.value = {
        text: 'Error al crear la notificación. Por favor, intente de nuevo.',
        success: false
      };
    } finally {
      isLoading.value = false;
    }
  };

  const markAsRead = async (id: number | undefined, index: number) => {
    if (!id) return;
    try {
      const notification = notifications.value[index];
      const updatedNotification = { ...notification, read: true };

  const response = await fetch(`https://backend-senaclub-xtrt.onrender.com/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotification),
      });

      if (!response.ok) throw new Error('Error al actualizar notificación');

      notifications.value[index].read = true;
      statusMessage.value = { text: 'Notificación marcada como leída', success: true };
      setTimeout(() => statusMessage.value = null, 3000);
    } catch (error) {
      console.error(error);
      statusMessage.value = {
        text: 'Error al marcar como leída. Por favor, intente de nuevo.',
        success: false
      };
    }
  };

  onMounted(fetchNotifications);

  return {
    newNotification,
    notifications,
    isLoading,
    statusMessage,
    fetchNotifications,
    createNotification,
    markAsRead
  };
}
