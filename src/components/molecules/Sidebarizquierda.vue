<script setup lang="ts">
import { ref, onMounted } from 'vue';

// ===== ACTUALIZACIÓN DE NOTIFICACIONES =====
// Definición de interfaces
interface Notification {
  id?: number;
  title: string;
  content: string;
  type: string;
  timestamp?: string;
  read?: boolean;
}

// Estado para el formulario de nueva notificación
const newNotification = ref<Notification>({
  title: '',
  content: '',
  type: 'info'
});

// Estado para las notificaciones
const notifications = ref<Notification[]>([]);

// Estado para controlar la carga
const isLoading = ref(false);

// Estado para mensajes de estado
const statusMessage = ref<{ text: string, success: boolean } | null>(null);

// Función para cargar notificaciones desde la API
const fetchNotifications = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/notifications');
    if (!response.ok) {
      throw new Error('Error al cargar notificaciones');
    }
    const data = await response.json();
    console.log('Respuesta API:', data);
    notifications.value = data;
  } catch (error) {
    console.error('Error:', error);
    statusMessage.value = {
      text: 'Error al cargar notificaciones. Por favor, intente de nuevo.',
      success: false
    };
  } finally {
    isLoading.value = false;
  }
};

// Función para crear una nueva notificación
const createNotification = async () => {
  isLoading.value = true;
  try {
    // Preparar los datos para enviar
    const notificationData = {
      ...newNotification.value,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    
    // Enviar la notificación a la API
    const response = await fetch('http://localhost:3000/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear notificación');
    }
    
    const result = await response.json();

    const savedNotification = result.data;
    
    // Asegurarnos de que notifications.value es un array
    if (!Array.isArray(notifications.value)) {
      notifications.value = [];
    }
    
    // Agregar la nueva notificación al estado local
    notifications.value.unshift(savedNotification);
    
    // Limpiar el formulario
    newNotification.value = {
      title: '',
      content: '',
      type: 'info'
    };
    
    // Mostrar mensaje de éxito
    statusMessage.value = {
      text: 'Notificación creada correctamente',
      success: true
    };
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
    statusMessage.value = {
      text: 'Error al crear la notificación. Por favor, intente de nuevo.',
      success: false
    };
  } finally {
    isLoading.value = false;
  }
};

// Función para marcar una notificación como leída
const markAsRead = async (id: number | undefined, index: number) => {
  if (!id) return;
  
  try {
    const notification = notifications.value[index];
    const updatedNotification = { ...notification, read: true };
    
    const response = await fetch(`http://localhost:3000/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNotification),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar notificación');
    }
    
    // Actualizar la notificación en el estado local
    notifications.value[index].read = true;
    
    // Opcional: Mostrar un mensaje de éxito o eliminar la notificación
    statusMessage.value = {
      text: 'Notificación marcada como leída',
      success: true
    };
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
    statusMessage.value = {
      text: 'Error al marcar como leída. Por favor, intente de nuevo.',
      success: false
    };
  }
};

// Cargar notificaciones al montar el componente
onMounted(() => {
  fetchNotifications();
});
</script>
<template>
    <div class="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
      <!-- Sidebar izquierda - Fondo negro sólido (ahora más pequeña) -->
      <div class="w-full md:w-1/5 lg:w-1/5 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-gray-800">
        <div class="p-4 flex items-center">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-transparent rounded-full flex items-center justify-center border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <span class="ml-2 font-semibold text-white">SENACLUB</span>
          </div>
        </div>
  
        <!-- Menú de navegación con hover purple y explore redirigiendo al search -->
        <nav class="flex-1 mt-4 md:mt-8 px-4">
          <div class="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-3">
            <router-link to="/home" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200">Home</router-link>
            <!-- Modified Explore link to redirect to search -->
            <a @click="redirectToSearch" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200 cursor-pointer">Explore</a>
            <router-link to="/Profile/news" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200">News</router-link>
            <router-link to="/Profile/notifications" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200">Notifications</router-link>
            <router-link to="/Profile" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200">Profile</router-link>
            <router-link to="/Profile/posts" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200">Posts</router-link>
          </div>
        </nav>
    </div>
</div>
    </template>