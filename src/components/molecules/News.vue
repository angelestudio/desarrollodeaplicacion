<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload } from 'jwt-decode';

//news

interface NewsItem {
  _id?: string
  title: string
  content: string
  createdAt?: string
  author?: string // Para mostrar quién creó la noticia
}

// Reactive state
const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const newsUser = ref<JwtPayload | null>(getUserFromToken()); // Cambiado de currentUser a newsUser


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
    
    // Refetch the news to get the latest data including the new item
    await fetchNews();
    
    // Clear form
    title.value = '';
    content.value = '';
    
    // Show success message
    displayNotification('Noticia publicada con éxito!', 'success');
  } catch (error) {
    console.error('Error publishing news:', error);
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

// Comprobar si el usuario puede eliminar una noticia (solo admin)
const canDelete = (item: NewsItem): boolean => {
  if (!newsUser.value) return false;
  
  // Solo admin puede eliminar noticias
  return newsUser.value.rol === 'admin';
};

</script>

<!-- Estado de autenticación -->
<div v-if="newsUser" class="bg-gray-800 p-2 mb-4 rounded text-xs text-gray-300">
  Conectado como: {{ newsUser.firstName }} {{ newsUser.lastName }} ({{ newsUser.rol }})
</div>

<!-- News creation form -->
<div class="bg-gray-900 p-3 mb-4 rounded-lg border border-gray-700">
  <h3 class="text-blue-500 font-medium text-sm mb-2">Crear nueva noticia</h3>
  
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
  
  <div class="flex justify-end">
    <button
      @click="publishNews"
      :disabled="isLoading || !newsUser || newsUser.rol !== 'admin'"
      class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
    >
      <span v-if="isLoading">Publicando...</span>
      <span v-else>Publicar noticia</span>
    </button>
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
        <div class="flex justify-end mt-2">
          <button
            v-if="canDelete(item)"
            @click="deleteNews(item._id)"
            class="text-xs text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
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