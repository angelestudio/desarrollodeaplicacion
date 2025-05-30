<script setup lang="ts">
import { ref, onMounted } from 'vue';
import News from './News.vue';
import Sidebarizquierda from './Sidebarizquierda.vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload } from 'jwt-decode';
import jwtDecode from 'jwt-decode';
const currentUser = ref(null);

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




// Asegúrate de que ya tengas importados ref y onMounted
// import { ref, onMounted } from 'vue';

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
const notifications = ref<Notification[]>([]);
const statusMessage = ref<{ text: string, success: boolean } | null>(null);
const newNotification = ref<Notification>({
  title: '',
  content: '',
  type: 'info'
});
// Ajusta "any" si tienes tipado de tu token

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





//news

interface NewsItem {
  _id?: string
  title: string
  content: string
  createdAt?: string
  author?: string 
  // Para mostrar quién creó la noticia
}

// Reactive state
const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const newsUser = ref<JwtPayload | null>(getUserFromToken()); // Cambiado de currentUser a newsUser


// Variables para la edición
const isEditing = ref(false);
const editingNewsId = ref<string | null>(null);

// API base URL
const API_URL = 'http://localhost:3000/news';

// Fetch existing news when component mounts
onMounted(async () => {
  await fetchNews();
});

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Function to fetch all news from the API
const fetchNews = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    newsItems.value = data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    displayNotification('Error al cargar noticias', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Function to publish a new news item
const publishNews = async () => {
  // Verificar si el usuario está autenticado
  if (!newsUser.value) {
    displayNotification('Debes iniciar sesión para publicar noticias', 'error');
    return;
  }

  // Verificar si el usuario tiene rol de admin
  if (newsUser.value.rol !== 'admin') {
    displayNotification('Solo los administradores pueden publicar noticias', 'error');
    return;
  }

  // Validate inputs
  if (!title.value.trim() || !content.value.trim()) {
    displayNotification('Por favor, completa tanto el título como el contenido de la noticia.', 'error');
    return;
  }

  try {
    isLoading.value = true;
    
    // Si estamos editando, enviamos una petición PUT, de lo contrario POST
    if (isEditing.value && editingNewsId.value) {
      await updateNews();
    } else {
      // Create news item object
      const newNewsItem: NewsItem = {
        title: title.value.trim(),
        content: content.value.trim(),
        author: `${newsUser.value.firstName} ${newsUser.value.lastName}` // Cambiado a newsUser
      };
      
      // Send to API with auth token
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newNewsItem),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get the response which contains message and newsId
      const result = await response.json();
      
      // Show success message
      displayNotification('Noticia publicada con éxito!', 'success');
    }
    
    // Refetch the news to get the latest data including the new item
    await fetchNews();
    
    // Clear form and reset editing state
    resetForm();
    
  } catch (error) {
    console.error('Error publishing/updating news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al publicar la noticia. Inténtalo de nuevo.';
    displayNotification(errorMessage, 'error');
    
    // Si la sesión expiró, refrescamos el usuario
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken(); // Cambiado a newsUser
    }
  } finally {
    isLoading.value = false;
  }
};

// Function to start editing a news item
const editNews = (item: NewsItem) => {
  if (!item._id) {
    displayNotification('ID de noticia no válido', 'error');
    return;
  }
  
  // Set editing state
  isEditing.value = true;
  editingNewsId.value = item._id;
  
  // Fill form with news data
  title.value = item.title;
  content.value = item.content;
  
  // Scroll to the form
  scrollToForm();
};

// Function to update an existing news item
const updateNews = async () => {
  if (!editingNewsId.value) return;
  
  try {
    // Create updated news item object
    const updatedNewsItem: NewsItem = {
      title: title.value.trim(),
      content: content.value.trim(),
    };
    
    // Send PUT request to API
    const response = await fetch(`${API_URL}/${editingNewsId.value}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedNewsItem),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    // Show success message
    displayNotification('Noticia actualizada con éxito!', 'success');
  } catch (error) {
    console.error('Error updating news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la noticia. Inténtalo de nuevo.';
    displayNotification(errorMessage, 'error');
    
    // Si la sesión expiró, refrescamos el usuario
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken();
    }
  }
};

// Function to cancel editing


// Function to reset form and editing state
const resetForm = () => {
  title.value = '';
  content.value = '';
  isEditing.value = false;
  editingNewsId.value = null;
};

// Helper function to scroll to form
const scrollToForm = () => {
  const formElement = document.getElementById('news-form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};

// Function to delete a news item
const deleteNews = async (id?: string) => {
  // Verificar si el usuario está autenticado
  if (!newsUser.value) {
    displayNotification('Debes iniciar sesión para eliminar noticias', 'error');
    return;
  }

  // Verificar si el usuario tiene rol de admin
  if (newsUser.value.rol !== 'admin') {
    displayNotification('Solo los administradores pueden eliminar noticias', 'error');
    return;
  }

  if (!id) {
    displayNotification('ID de noticia no válido', 'error');
    return;
  }

  if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
    return;
  }

  try {
    isLoading.value = true;
    
    // Send delete request con el ID correcto y el token de autorización
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (response.status === 403) {
        throw new Error('No tienes permisos para eliminar esta noticia.');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    // Si fue exitoso, actualizamos la lista de noticias
    await fetchNews();
    
    displayNotification('Noticia eliminada correctamente', 'success');
  } catch (error) {
    console.error('Error deleting news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la noticia';
    displayNotification(errorMessage, 'error');
    
    // Si la sesión expiró, refrescamos el usuario
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken(); // Cambiado a newsUser
    }
  } finally {
    isLoading.value = false;
  }
};

// Function to display notification
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// Format date for display
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (e) {
    return dateString;
  }
};

// Comprobar si el usuario puede editar/eliminar una noticia (solo admin)
const canManageNews = (item: NewsItem): boolean => {
  if (!newsUser.value) return false;
  
  // Solo admin puede editar/eliminar noticias
  return newsUser.value.rol === 'admin';
};


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
          <router-link to="/home" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-green-700 transition-colors duration-200">Home</router-link>
          <router-link to="/clubs" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-green-700 transition-colors duration-200">clubs</router-link>
          <router-link to="/Profile/notifications" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-green-700 transition-colors duration-200">Notifications</router-link>
          <router-link to="/Profile" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-green-700 transition-colors duration-200">Profile</router-link>
          <router-link to="/Profile/posts" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-green-700 transition-colors duration-200">Posts</router-link>
        </div>
      </nav>
      

      <!-- Perfil del usuario en sidebar - Visible solo en pantallas medianas o mayores -->
<div class="hidden md:flex p-4 items-center mt-auto">
  <img src="@/assets/images/user.jpg" alt="User" class="w-8 h-8 rounded-full" />
  <span class="ml-2 text-sm">
    {{ currentUser?.firstName }} {{ currentUser?.lastName }}
  </span>
</div>
    </div>

    <!-- Contenido principal (ahora un poco más amplio) -->
    <div class="w-full md:w-3/5 lg:w-3/5 flex flex-col bg-black relative overflow-y-auto">
      <!-- Imagen de fondo en la parte superior - patrón de líneas -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden bg-gray-700">
        <img src="@/assets/bg_buildings_old.png" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <!-- Sección de perfil -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="@/assets/images/user.jpg" alt="Roberta Jimenez" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white" />
        <h1 class="mt-2 font-medium text-base md:text-lg text-white">{{ currentUser?.firstName }} {{ currentUser?.lastName }}
        </h1>
        
        <p class="text-gray-400 text-xs md:text-sm">{{ currentUser?.rol }}
        </p>

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
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'">Notifications</router-link>
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
              <img src="@/assets/images/user.jpg" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-2">
                <p class="text-sm font-medium">hola Jimenez</p>
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
  <!-- Mensaje de autenticación -->
  <div v-if="!currentUser" class="mx-4 my-4 p-4 border border-red-700 rounded-lg bg-red-900 text-white text-center">
    Debes iniciar sesión para acceder a las notificaciones
  </div>

  <template v-else>
    <!-- Formulario para crear nuevas notificaciones (solo visible para usuarios autenticados) -->
    <div class="mx-4 my-4 p-4 border border-gray-700 rounded-lg bg-gray-900">
      <h3 class="text-sm font-medium mb-3">Crear nueva notificación</h3>
      <div class="text-xs text-gray-400 mb-3">
        Usuario: {{ currentUser.firstName }} {{ currentUser.lastName }} ({{ currentUser.email }})
      </div>
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
    <div v-if="isEditing && editingNotification" class="mx-4 my-4 p-4 border border-yellow-700 rounded-lg bg-gray-900">
      <h3 class="text-sm font-medium mb-3">Editar notificación</h3>
      <form @submit.prevent="saveEdit">
        <div class="mb-3">
          <input
            v-model="editingNotification.title"
            type="text"
            placeholder="Título"
            class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-3">
          <textarea
            v-model="editingNotification.content"
            placeholder="Contenido"
            class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 h-20"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <select
            v-model="editingNotification.type"
            class="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-green-500"
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
    <div v-if="statusMessage" class="mx-4 mb-3 p-2 rounded-lg text-center text-sm" :class="statusMessage.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'">
      {{ statusMessage.text }}
    </div>
    
    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center my-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Lista de notificaciones -->
    <div v-if="notifications.length === 0 && !isLoading" class="text-center text-gray-500 py-6 mt-4">
      No hay notificaciones disponibles
    </div>
    
    <!-- Notificaciones existentes -->
    <div v-for="(notification, index) in notifications" :key="index" class="mx-4 mb-3 mt-4">
      <div class="p-3 rounded-lg" :class="{
        'bg-green-900 bg-opacity-20 border border-green-800': notification.type === 'info',
        'bg-yellow-900 bg-opacity-20 border border-yellow-800': notification.type === 'warning',
        'bg-green-900 bg-opacity-20 border border-green-800': notification.type === 'alert',
        'bg-gray-800': !notification.type
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
            <p class="text-xs text-gray-400 mt-1">{{ notification.content }}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-gray-500">
                {{ notification.timestamp || 'Hace un momento' }}
                <span v-if="notification.userName" class="ml-1">- por {{ notification.userName }}</span>
              </span>
              <div class="flex space-x-2">
                <button 
                  v-if="!notification.read"
                  @click="markAsRead(notification._id, index)" 
                  class="text-xs text-gray-400 hover:text-white"
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
      <div v-if="showNotification" :class="`fixed bottom-4 right-4 p-3 rounded-lg text-sm ${notificationType === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`">
        {{ notificationMessage }}
      </div>
    </transition>



 <!-- Sidebar derecha  -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 bg-black border-l border-gray-800 flex flex-col">
   
 <!-- Estado de autenticación -->
<div v-if="newsUser" class="bg-gray-800 p-2 mb-4 rounded text-xs text-gray-300">
  Conectado como: {{ newsUser.firstName }} {{ newsUser.lastName }} ({{ newsUser.rol }})
</div>

<!-- News creation form -->
<div id="news-form" class="bg-gray-900 p-3 mb-4 rounded-lg border border-gray-700">
  <h3 class="text-green-500 font-medium text-sm mb-2">
    {{ isEditing ? 'Editar noticia' : 'Crear nueva noticia' }}
  </h3>
  
  <div v-if="!newsUser" class="bg-red-800 text-white p-2 mb-3 rounded text-xs">
    Debes iniciar sesión para publicar noticias
  </div>
  
  <div v-else-if="newsUser.rol !== 'admin'" class="bg-red-800 text-white p-2 mb-3 rounded text-xs">
    Solo los administradores pueden publicar noticias
  </div>
  
  <div class="mb-3">
    <label for="news-title" class="block text-xs text-gray-400 mb-1">Título:</label>
    <input
      type="text"
      id="news-title"
      v-model="title"
      :disabled="!newsUser || newsUser.rol !== 'admin'"
      class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
      placeholder="Título de la noticia"
    >
  </div>
  
  <div class="mb-3">
    <label for="news-content" class="block text-xs text-gray-400 mb-1">Contenido:</label>
    <textarea
      id="news-content"
      v-model="content"
      :disabled="!newsUser || newsUser.rol !== 'admin'"
      class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 h-24 disabled:opacity-50"
      placeholder="Contenido de la noticia"
    ></textarea>
  </div>
  
  <div class="flex justify-end gap-2">
    <button
      v-if="isEditing"
      @click="cancelEdit"
      class="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200"
    >
      Cancelar
    </button>
    
    <button
      @click="publishNews"
      :disabled="isLoading || !newsUser || newsUser.rol !== 'admin'"
      class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
    >
      <span v-if="isLoading">{{ isEditing ? 'Actualizando...' : 'Publicando...' }}</span>
      <span v-else>{{ isEditing ? 'Actualizar noticia' : 'Publicar noticia' }}</span>
    </button>
  </div>
</div>

<!-- News items display -->
<div id="news-items-container" class="overflow-y-auto max-h-96">
  <div v-if="isLoading && newsItems.length === 0" class="text-center py-4 text-gray-400">
    Cargando noticias...
  </div>
  
  <div v-else-if="newsItems.length === 0" class="text-center py-4 text-gray-400">
    No hay noticias disponibles.
  </div>
  
  <div v-else v-for="item in newsItems" :key="item._id" class="bg-gray-200 p-3 mb-4 rounded">
    <div class="flex">
      <div class="mr-3">
        <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
          <span class="text-xs font-bold text-black">NEWS</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-black font-medium text-sm">{{ item.title }}</h3>
        <p class="text-xs text-gray-600">{{ item.content }}</p>
        <div class="flex justify-between items-center mt-1">
          <p v-if="item.createdAt" class="text-xs text-gray-500">{{ formatDate(item.createdAt) }}</p>
          <p v-if="item.author" class="text-xs text-gray-500">Por: {{ item.author }}</p>
        </div>
        <div class="flex justify-end mt-2 gap-2">
          <button
            v-if="canManageNews(item)"
            @click="editNews(item)"
            class="text-xs text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
          <button
            v-if="canManageNews(item)"
            @click="deleteNews(item._id)"
            class="text-xs text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
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

