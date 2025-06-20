<script setup lang="ts">
import { ref, onMounted,watch, computed } from 'vue';
import News from './News.vue';
import Sidebarizquierda from './Sidebarizquierda.vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload } from 'jwt-decode';
import jwtDecode from 'jwt-decode';
import {useTheme} from '@/composables/useTheme';
import ThemeToggle from './ThemeToggle.vue';
import { useThemeStore } from '@/stores/theme'
const currentUser = ref(null);

// Oscuro a blanco
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')


// Theme state


// Toggle theme function
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// Load theme preference on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
})

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      currentUser.value = jwtDecode(token); // Asegúrate de que esta función esté decodificando correctamente el JWT
    } catch (e) {
      console.error('Error al decodificar el token', e);
      currentUser.value = null; // En caso de que haya un error al decodificar
    }
  }
});

// Estado para Posts
const posts = ref<Array<{content: string}>>([
  { content: "Este es un post de ejemplo que ya existe en el sistema." },
  { content: "Otro post de ejemplo que muestra cómo se verían los posts en el perfil del usuario." }
]);

const redirectToSearch = () => {
  // Find the search container element
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    // Scroll to the search container
    searchContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Find and focus the input field inside the search container
    const searchInput = searchContainer.querySelector('input');
    if (searchInput) {
      searchInput.focus();
    }
  }
};

// Definición de interfaces
interface Notification {
  _id?: string;
  title: string;
  content: string;
  type: string;
  timestamp?: string;
  read?: boolean;
  userId?: string;  // ID del usuario dueño de la notificación
  userName?: string; // Nombre del usuario para mostrar
}

// Variables de estado
const isLoading = ref(false);

const editingNotification = ref<Notification | null>(null);
const notifications = ref<Notification[]>([]); // ← INICIA VACÍO, NO HAY 3 POR DEFECTO
const statusMessage = ref<{ text: string, success: boolean } | null>(null);
const newNotification = ref<Notification>({
  title: '',
  content: '',
  type: 'info'
});

const validNotifications = computed(() =>
  notifications.value.filter(
    n => n && (n.title?.trim() || n.content?.trim())
  )
);

// Funciones auxiliares
const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

// Función para verificar si el usuario está autenticado
const checkAuthentication = () => {
  const user = getUserFromToken();
  if (!user) {
    statusMessage.value = {
      text: 'Debes iniciar sesión para ver las notificaciones',
      success: false
    };
    return false;
  }
  currentUser.value = user;
  return true;
};

// Función para cargar notificaciones
const fetchNotifications = async () => {
  isLoading.value = true;
  try {
    currentUser.value = getUserFromToken();
    if (!currentUser.value) {
      throw new Error('Usuario no autenticado');
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/notifications?userId=${currentUser.value.sub}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

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
    currentUser.value = getUserFromToken();
    if (!currentUser.value) {
      throw new Error('Usuario no autenticado');
    }

    const notificationData = {
      ...newNotification.value,
      timestamp: new Date().toLocaleString(),
      read: false,
      userId: currentUser.value.sub,
      userName: `${currentUser.value.firstName} ${currentUser.value.lastName}`
    };

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData);
      throw new Error(`Error al crear notificación: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    const savedNotification = result.data;

    if (!Array.isArray(notifications.value)) {
      notifications.value = [];
    }

    notifications.value.unshift(savedNotification);

    newNotification.value = {
      title: '',
      content: '',
      type: 'info'
    };

    statusMessage.value = {
      text: 'Notificación creada correctamente',
      success: true
    };

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

// Funciones para edición
const isEditing = ref(false);
const startEdit = (notification: Notification) => {
  editingNotification.value = JSON.parse(JSON.stringify(notification));
  isEditing.value = true;
};

const cancelEdit = () => {
  editingNotification.value = null;
  isEditing.value = false;
};

const saveEdit = async () => {
  if (!editingNotification.value || !editingNotification.value._id) return;

  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    console.log('Enviando actualización para ID:', editingNotification.value._id);
    console.log('Datos de actualización:', JSON.stringify(editingNotification.value));

    const response = await fetch(`http://localhost:3000/notifications/${editingNotification.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editingNotification.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData);
      throw new Error(`Error al actualizar notificación: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('Respuesta exitosa:', result);

    const index = notifications.value.findIndex(n => n._id === editingNotification.value?._id);
    if (index !== -1) {
      notifications.value[index] = result.data;
    }

    statusMessage.value = {
      text: 'Notificación actualizada correctamente',
      success: true
    };

    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);

    cancelEdit();

  } catch (error) {
    console.error('Error completo:', error);
    statusMessage.value = {
      text: error.message || 'Error al actualizar la notificación',
      success: false
    };
  } finally {
    isLoading.value = false;
  }
};

// Función para marcar como leída
const markAsRead = async (_id: string | undefined, index: number) => {
  if (!_id) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const notification = notifications.value[index];
    const updatedNotification = { ...notification, read: true };

    const response = await fetch(`http://localhost:3000/notifications/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedNotification),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar notificación');
    }

    notifications.value[index].read = true;

    statusMessage.value = {
      text: 'Notificación marcada como leída',
      success: true
    };

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

// Hook para cargar notificaciones al iniciar
onMounted(() => {
  if (checkAuthentication()) {
    fetchNotifications();
  }
});

</script>


<template>
  <div class="flex flex-col md:flex-row h-screen overflow-hidden" :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'">
    <!-- Sidebar izquierda - Fondo negro sólido (ahora más pequeña) -->
    <Sidebarizquierda lass="w-full md:w-2/6 lg:w-2/6"/>

    <!-- Contenido principal (ahora un poco más amplio) -->
    <div class="w-full md:w-4/6 lg:w-4/6 flex flex-col relative overflow-y-auto" :class="isDarkMode ? 'bg-black' : 'bg-white'">
      <!-- Imagen de fondo en la parte superior - patrón de líneas -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-300'">
        <img src="@/assets/bg_buildings_old.png" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <!-- Sección de perfil -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="@/assets/images/user.jpg" alt="Roberta Jimenez" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2" :class="isDarkMode ? 'border-white' : 'border-black'" />
        <h1 class="mt-2 font-medium text-base md:text-lg" :class="isDarkMode ? 'text-white' : 'text-black'">{{ currentUser?.firstName }} {{ currentUser?.lastName }}
        </h1>
        <p class="text-xs md:text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ currentUser?.rol }}
        </p>
        <!-- Contador y botón -->
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="isDarkMode ? 'border-gray-700' : 'border-gray-400'">50 Posts</div>
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="isDarkMode ? 'border-gray-700' : 'border-gray-400'">30 Saved</div>
        </div>
        <button class="mt-2 md:mt-3 px-4 md:px-5 py-1 border rounded-full text-xs" :class="isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-700'">
          About me
        </button>
        <p class="mt-2 text-xs text-center max-w-xs px-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          Soy aprendiz de SENA, me gusta el diseño soy lo mejor me gusta el baloncesto me gusta pintar y demás
        </p>
      </div>

      <!-- Navegación de contenido con router-link -->
      <div class="border-b text-center mt-4" :class="isDarkMode ? 'border-gray-800' : 'border-gray-300'">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-green-500 text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-green-500 text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')">Notifications</router-link>
        </div>
      </div>

      <!-- Área para renderizar las vistas (Posts o Notifications) -->
      <router-view>
        <!-- Template para la vista de Posts -->
        <template v-if="$route.path === '/Profile/posts'">
          <!-- Mensaje cuando no hay posts -->
          <div v-if="posts.length === 0" class="text-center py-6 mt-4" :class="isDarkMode ? 'text-gray-500' : 'text-gray-600'">
            No hay posts disponibles
          </div>
          
          <!-- Posts existentes -->
          <div v-for="(post, index) in posts" :key="index" class="p-4 border rounded-lg mx-4 mb-4 mt-4" :class="isDarkMode ? 'border-gray-800' : 'border-gray-300'">
            <div class="flex items-start mb-3">
              <img src="@/assets/images/user.jpg" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-2">
                <p class="text-sm font-medium">hola Jimenez</p>
                <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Hace un momento</p>
              </div>
            </div>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ post.content }}</p>
            <div class="flex space-x-4 mt-3 pt-3 border-t" :class="isDarkMode ? 'border-gray-800' : 'border-gray-300'">
              <button class="flex items-center text-xs hover:text-blue-500" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Me gusta
              </button>
              <button class="flex items-center text-xs hover:text-blue-500" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                </svg>
                Comentar
              </button>
              <button class="flex items-center text-xs hover:text-blue-500" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Compartir
              </button>
            </div>
          </div>
        </template>
        
        <!-- Template para la vista de Notificaciones -->
        <template v-if="$route.path === '/Profile/notifications'">
          <!-- Mensaje de autenticación -->
          <div v-if="!currentUser" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="isDarkMode ? 'border-red-700 bg-red-900 text-white' : 'border-red-400 bg-red-100 text-red-800'">
            Debes iniciar sesión para acceder a las notificaciones
          </div>

          <template v-else>
            <!-- Formulario para crear nuevas notificaciones (solo visible para usuarios autenticados) -->
            <div class="mx-4 my-4 p-4 border rounded-lg" :class="isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-50'">
              <h3 class="text-sm font-medium mb-3">Crear nueva notificación</h3>
              <div class="text-xs mb-3" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                Usuario: {{ currentUser.firstName }} {{ currentUser.lastName }} ({{ currentUser.email }})
              </div>
              <form @submit.prevent="createNotification">
                <div class="mb-3">
                  <input
                    v-model="newNotification.title"
                    type="text"
                    placeholder="Título"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  />
                </div>
                <div class="mb-3">
                  <textarea
                    v-model="newNotification.content"
                    placeholder="Contenido"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500 h-20"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <select
                    v-model="newNotification.type"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  >
                    <option value="info">Información</option>
                    <option value="warning">Advertencia</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="bg-green-600 hover:bg-blue-700 text-white rounded-full px-4 py-1 text-sm"
                    :disabled="isLoading || currentUser?.rol?.toLowerCase() !== 'admin'"
                    @click="createNotification"
                  >
                    {{ isLoading ? 'Enviando...' : 'Enviar notificación' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Formulario de edición de notificaciones -->
            <div v-if="isEditing && editingNotification" class="mx-4 my-4 p-4 border rounded-lg" :class="isDarkMode ? 'border-yellow-700 bg-gray-900' : 'border-yellow-400 bg-yellow-50'">
              <h3 class="text-sm font-medium mb-3">Editar notificación</h3>
              <form @submit.prevent="saveEdit">
                <div class="mb-3">
                  <input
                    v-model="editingNotification.title"
                    type="text"
                    placeholder="Título"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  />
                </div>
                <div class="mb-3">
                  <textarea
                    v-model="editingNotification.content"
                    placeholder="Contenido"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-green-500 h-20"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <select
                    v-model="editingNotification.type"
                    class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-green-500"
                    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
                    required
                  >
                    <option value="info">Información</option>
                    <option value="warning">Advertencia</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    class="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-1 text-sm"
                    @click="cancelEdit"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-4 py-1 text-sm"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Mensaje de estado -->
            <div v-if="statusMessage" class="mx-4 mb-3 p-2 rounded-lg text-center text-sm" :class="statusMessage.success ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')">
              {{ statusMessage.text }}
            </div>
            
            <!-- Estado de carga -->
            <div v-if="isLoading" class="text-center my-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            
            <!-- Lista de notificaciones -->
            <div v-if="validNotifications.length === 0 && !isLoading" 
           class="text-center py-6 mt-4 rounded-lg mx-4"
           :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'">
        No hay notificaciones disponibles
      </div>
            
            <!-- Notificaciones existentes -->
            <div v-for="(notification, index) in validNotifications" :key="notification._id || index" class="mx-4 mb-3 mt-4">
              <div class="p-3 rounded-lg" :class="{
                [isDarkMode ? 'bg-green-900 bg-opacity-20 border border-green-800' : 'bg-green-50 border border-green-200']: notification.type === 'info',
                [isDarkMode ? 'bg-yellow-900 bg-opacity-20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200']: notification.type === 'warning',
                [isDarkMode ? 'bg-green-900 bg-opacity-20 border border-green-800' : 'bg-green-50 border border-green-200']: notification.type === 'alert',
                [isDarkMode ? 'bg-gray-800' : 'bg-gray-100']: !notification.type
              }">
                <div class="flex">
                  <div class="mr-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                      'bg-green-500': notification.type === 'info',
                      'bg-green-500': notification.type === 'warning',
                      'bg-green-500': notification.type === 'alert',
                      'bg-gray-500': !notification.type
                    }">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow">
                    <h3 class="text-sm font-medium">{{ notification.title }}</h3>
                    <p class="text-xs mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ notification.content }}</p>
                    <div class="flex justify-between items-center mt-2">
                      <span class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                        {{ notification.timestamp || 'Hace un momento' }}
                        <span v-if="notification.userName" class="ml-1">- por {{ notification.userName }}</span>
                      </span>
                      <div class="flex space-x-2">
                        <button 
                          v-if="!notification.read"
                          @click="markAsRead(notification._id, index)" 
                          class="text-xs hover:text-white" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
                        >
                          Marcar como leída
                        </button>
                        <span v-else class="text-xs text-green-500">Leída</span>
                        <button
                          v-if="currentUser?.rol?.toLowerCase() === 'admin'"
                          @click="startEdit(notification)"
                          class="text-xs text-yellow-400 hover:text-yellow-300"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </router-view>
    </div>
  
    <!-- Notificación de estado -->
    <transition name="fade">
      <div v-if="showNotification" :class="`fixed bottom-4 right-4 p-3 rounded-lg text-sm ${notificationType === 'success' ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')}`">
        {{ notificationMessage }}
      </div>
    </transition>

    <!-- Sidebar derecha  -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 flex flex-col border-l" :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-300'">
   
      <div>
         <News />
      </div>
                

      <!-- Notification component -->
      <Teleport to="body">
        <div
          v-if="showNotification"
          class="fixed bottom-4 right-4 p-3 rounded shadow-lg text-white text-sm z-50"
          :class="notificationType === 'success' ? 'bg-green-600' : 'bg-red-600'"
        >
          {{ notificationMessage }}
        </div>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

