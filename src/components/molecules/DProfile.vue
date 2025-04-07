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

      <!-- Menú de navegación (News removido) -->
      <nav class="flex-1 mt-4 md:mt-8 px-4">
        <div class="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-3">
          <router-link to="/" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Home</router-link>
          <router-link to="/explore" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Explore</router-link>
          <router-link to="/Profile/notifications" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Notifications</router-link>
          <router-link to="/Profile" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Profile</router-link>
          <router-link to="/Profile/posts" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Posts</router-link>
        </div>
      </nav>

      <!-- Perfil del usuario en sidebar - Visible solo en pantallas medianas o mayores -->
      <div class="hidden md:flex p-4 items-center mt-auto">
        <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
        <span class="ml-2 text-sm">Roberta Jimenez</span>
      </div>
    </div>

    <!-- Contenido principal (ahora un poco más amplio) -->
    <div class="w-full md:w-3/5 lg:w-3/5 flex flex-col bg-black relative overflow-y-auto">
      <!-- Imagen de fondo en la parte superior - patrón de líneas -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden bg-gray-700">
        <img src="" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <!-- Sección de perfil -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="https://i.pravatar.cc/300" alt="Roberta Jimenez" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white" />
        <h1 class="mt-2 font-medium text-base md:text-lg text-white">Roberta Jimenez</h1>
        <p class="text-gray-400 text-xs md:text-sm">Aprendiz</p>

        <!-- Contador y botón -->
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">50 Posts</div>
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">30 Saved</div>
        </div>

        <button class="mt-2 md:mt-3 px-4 md:px-5 py-1 border border-gray-600 rounded-full text-xs text-gray-300">
          About me
        </button>

        <p class="mt-2 text-xs text-center max-w-xs px-4 text-gray-400">
          Soy aprendiz de SENA, me gusta el diseño soy lo mejor me gusta el baloncesto me gusta pintar y demás
        </p>
      </div>

      <!-- Navegación de contenido con router-link -->
      <div class="border-b border-gray-800 text-center mt-4">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Notifications</router-link>
        </div>
      </div>

      <!-- Área para renderizar las vistas (Posts o Notifications) -->
      <router-view>
        <!-- Template para la vista de Posts -->
        <template v-if="$route.path === '/Profile/posts'">
          <!-- Mensaje cuando no hay posts -->
          <div v-if="posts.length === 0" class="text-center text-gray-500 py-6 mt-4">
            No hay posts disponibles
          </div>
          
          <!-- Posts existentes -->
          <div v-for="(post, index) in posts" :key="index" class="p-4 border border-gray-800 rounded-lg mx-4 mb-4 mt-4">
            <div class="flex items-start mb-3">
              <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-2">
                <p class="text-sm font-medium">Roberta Jimenez</p>
                <p class="text-xs text-gray-400">Hace un momento</p>
              </div>
            </div>
            <p class="text-sm text-gray-300">{{ post.content }}</p>
            <div class="flex space-x-4 mt-3 pt-3 border-t border-gray-800">
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Me gusta
              </button>
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                </svg>
                Comentar
              </button>
              <button class="flex items-center text-xs text-gray-400 hover:text-blue-500">
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
          <!-- Formulario para crear nuevas notificaciones -->
          <div class="mx-4 my-4 p-4 border border-gray-700 rounded-lg bg-gray-900">
            <h3 class="text-sm font-medium mb-3">Crear nueva notificación</h3>
            <form @submit.prevent="createNotification">
              <div class="mb-3">
                <input
                  v-model="newNotification.title"
                  type="text"
                  placeholder="Título"
                  class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div class="mb-3">
                <textarea
                  v-model="newNotification.content"
                  placeholder="Contenido"
                  class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 h-20"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <select
                  v-model="newNotification.type"
                  class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
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
                  class="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1 text-sm"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Enviando...' : 'Enviar notificación' }}
                </button>
              </div>
            </form>
          </div>
          
          <!-- Mensaje de estado -->
          <div v-if="statusMessage" class="mx-4 mb-3 p-2 rounded-lg text-center text-sm" :class="statusMessage.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'">
            {{ statusMessage.text }}
          </div>
          
          <!-- Lista de notificaciones -->
          <div v-if="notifications.length === 0 && !isLoading" class="text-center text-gray-500 py-6 mt-4">
            No hay notificaciones disponibles
          </div>
          
          <!-- Notificaciones existentes -->
          <div v-for="(notification, index) in notifications" :key="index" class="mx-4 mb-3 mt-4">
            <div class="p-3 rounded-lg" :class="{
              'bg-blue-900 bg-opacity-20 border border-blue-800': notification.type === 'info',
              'bg-yellow-900 bg-opacity-20 border border-yellow-800': notification.type === 'warning',
              'bg-red-900 bg-opacity-20 border border-red-800': notification.type === 'alert',
              'bg-gray-800': !notification.type
            }">
              <div class="flex">
                <div class="mr-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                    'bg-blue-500': notification.type === 'info',
                    'bg-yellow-500': notification.type === 'warning',
                    'bg-red-500': notification.type === 'alert',
                    'bg-gray-500': !notification.type
                  }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-medium">{{ notification.title }}</h3>
                  <p class="text-xs text-gray-400 mt-1">{{ notification.content }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">{{ notification.timestamp || 'Hace un momento' }}</span>
                    <button 
                      @click="markAsRead(notification.id, index)" 
                      class="text-xs text-gray-400 hover:text-white"
                    >
                      Marcar como leída
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </router-view>
    </div>

    <!-- Sidebar derecha - Noticias (ahora solo muestra noticias existentes) -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 bg-black border-l border-gray-800 flex flex-col">
      <!-- Barra de búsqueda -->
      <div class="p-3 border-b border-gray-800">
        <div class="bg-gray-900 rounded-full px-4 py-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input type="text" placeholder="Search" class="bg-transparent border-none w-full ml-2 text-sm focus:outline-none text-gray-300">
        </div>
      </div>
      
      <!-- Contenedor de noticias con scroll explícito -->
      <div class="flex-1 overflow-y-auto h-full">
        <div class="p-4 border border-gray-700 rounded-lg m-4">
          <!-- Encabezado NEWS -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-indigo-500 font-bold">NEWS</h2>
            <div class="grid grid-cols-3 gap-1">
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <p class="text-sm text-gray-400 mb-4">noticias csf</p>
          <hr class="border-gray-700 mb-4">
          
          <!-- Noticias ya existentes en el sistema -->
          <div v-for="(news, index) in newsList" :key="index" class="bg-gray-200 p-3 mb-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">{{ news.title }}</h3>
                <p class="text-xs text-gray-600">{{ news.content }}</p>
              </div>
            </div>
          </div>
          
          <!-- Noticia 1 -->
          <div class="bg-gray-200 p-3 mb-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Evento Terraza</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 2 -->
          <div class="bg-gray-200 p-3 mb-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Película Auditorio</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 3 -->
          <div class="bg-gray-200 p-3 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Emprendimiento</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Estado para Posts
const posts = ref<Array<{content: string}>>([
  { content: "Este es un post de ejemplo que ya existe en el sistema." },
  { content: "Otro post de ejemplo que muestra cómo se verían los posts en el perfil del usuario." }
]);

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
    
    const savedNotification = await response.json();
    
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

// Estado para Noticias
const newsList = ref<Array<{title: string, content: string}>>([
  { 
    title: "Nuevo evento deportivo", 
    content: "Este fin de semana tendremos actividades deportivas en el campus." 
  },
  { 
    title: "Conferencia tecnológica", 
    content: "No te pierdas la conferencia sobre nuevas tecnologías el próximo martes." 
  }
]);
</script>