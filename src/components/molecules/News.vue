<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload as UserJwtPayload } from '@/composables/useAuth';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.theme === 'dark');

// NEWS 
interface NewsItem {
  _id?: string
  title: string
  content: string
  createdAt?: string
  author?: string 
  updatedAt?: string
}

// Reactive state
const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const newsUser = ref<JwtPayload | null>(getUserFromToken());
const isLoading = ref(false);
const isEditing = ref(false);

// Variables para la edición
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

  // Validar que no sean solo números
  const onlyNumbersRegex = /^\d+$/;
  if (onlyNumbersRegex.test(title.value.trim()) || onlyNumbersRegex.test(content.value.trim())) {
    displayNotification('El título y el contenido no pueden ser solo números.', 'error');
    return;
  }

  // Validar que el título tenga más de 2 caracteres y el contenido más de 10
  if (title.value.trim().length < 3) {
    displayNotification('El título debe tener más de 2 caracteres.', 'error');
    return;
  }

  if (content.value.trim().length < 10) {
    displayNotification('El contenido debe tener más de 10 caracteres.', 'error');
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
        author: `${newsUser.value.firstName} ${newsUser.value.lastName}`
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
      newsUser.value = getUserFromToken();
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

// Function to cancel editing
const cancelEdit = () => {
  resetForm();
  displayNotification('Edición cancelada', 'success');
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
      newsUser.value = getUserFromToken();
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
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

// Función para obtener las iniciales del autor
const getAuthorInitials = (author: string): string => {
  if (!author || author === 'undefined' || author === 'null') {
    return newsUser.value ? `${newsUser.value.firstName[0]}${newsUser.value.lastName[0]}` : 'AD';
  }
  const names = author.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return author.substring(0, 2).toUpperCase();
};

// Función para obtener el nombre del autor
const getAuthorName = (author: string): string => {
  if (!author || author === 'undefined' || author === 'null') {
    return newsUser.value ? `${newsUser.value.firstName} ${newsUser.value.lastName}` : 'Administrador';
  }
  return author;
};

</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Estado de autenticación -->
    <div v-if="newsUser" class="mb-6 p-3 rounded-lg shadow-sm" :class="isDarkMode ? 'bg-gray-900 text-white border border-gray-700' : 'bg-green-50 text-green-900 border border-green-200'">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {{ newsUser.firstName[0] }}{{ newsUser.lastName[0] }}
        </div>
        <div>
          <p class="font-medium text-sm">{{ newsUser.firstName }} {{ newsUser.lastName }}</p>
          <p class="text-xs opacity-75">{{ newsUser.rol }}</p>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div 
      v-if="showNotification" 
      class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-sm"
      :class="notificationType === 'success' ? 'bg-green-600 text-white' : 'bg-black text-white'"
    >
      <div class="flex items-center space-x-2">
        <span v-if="notificationType === 'success'">✓</span>
        <span v-else>⚠</span>
        <span class="text-sm">{{ notificationMessage }}</span>
      </div>
    </div>

    <!-- News creation form -->
    <div id="news-form" class="mb-8 p-6 rounded-xl shadow-lg" :class="isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'">
      <h3 class="text-green-600 font-semibold text-lg mb-4 flex items-center">
        <span class="mr-2">📝</span>
        {{ isEditing ? 'Editar noticia' : 'Crear nueva noticia' }}
      </h3>
      
      <div v-if="!newsUser" class="p-3 mb-4 rounded-lg bg-black text-white text-sm">
        <span class="font-medium">⚠️ Debes iniciar sesión para publicar noticias</span>
      </div>
      
      <div v-else-if="newsUser.rol !== 'admin'" class="p-3 mb-4 rounded-lg bg-gray-800 text-white text-sm">
        <span class="font-medium">🔒 Solo los administradores pueden publicar noticias</span>
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="news-title" class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Título de la noticia
          </label>
          <input
            type="text"
            id="news-title"
            v-model="title"
            :disabled="!newsUser || newsUser.rol !== 'admin'"
            class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
            placeholder="Escribe un título llamativo para tu noticia..."
          >
        </div>
        
        <div>
          <label for="news-content" class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Contenido de la noticia
          </label>
          <textarea
            id="news-content"
            v-model="content"
            :disabled="!newsUser || newsUser.rol !== 'admin'"
            class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 h-32 resize-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
            placeholder="Escribe el contenido completo de tu noticia aquí..."
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-6">
        <button
          v-if="isEditing"
          @click="cancelEdit"
          :disabled="isLoading"
          class="px-6 py-2 text-sm font-medium rounded-lg transition duration-200 disabled:opacity-50"
          :class="isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-black bg-gray-200 hover:bg-gray-300'"
        >
          Cancelar
        </button>
        
        <button
          @click="publishNews"
          :disabled="isLoading || !newsUser || newsUser.rol !== 'admin'"
          class="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 disabled:opacity-50 flex items-center space-x-2"
        >
          <span v-if="isLoading" class="animate-spin">⏳</span>
          <span v-else>{{ isEditing ? '💾' : '📢' }}</span>
          <span>{{ isLoading ? (isEditing ? 'Actualizando...' : 'Publicando...') : (isEditing ? 'Actualizar noticia' : 'Publicar noticia') }}</span>
        </button>
      </div>
    </div>

    <!-- News items display -->
    <div id="news-items-container" class="space-y-4">
      <div v-if="isLoading && newsItems.length === 0" class="text-center py-12">
        <div class="animate-spin text-4xl mb-4">⏳</div>
        <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Cargando noticias...</p>
      </div>
      
      <div v-else-if="newsItems.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📰</div>
        <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">No hay noticias disponibles.</p>
        <p class="text-sm mt-2" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">¡Sé el primero en publicar una noticia!</p>
      </div>
      
      <div v-else v-for="item in newsItems" :key="item._id" class="rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]" :class="isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'">
        <div class="p-6">
          <!-- Header con autor -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ getAuthorInitials(item.author || '') }}
              </div>
              <div>
                <h4 class="font-semibold text-sm" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ getAuthorName(item.author || '') }}
                </h4>
                <div class="flex items-center space-x-2">
                  <span class="text-xs px-2 py-1 rounded-full bg-green-600 text-white font-medium">
                    Administrador
                  </span>
                  <span v-if="item.createdAt" class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ formatDate(item.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Título de la noticia -->
          <h3 class="text-xl font-bold mb-3 leading-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            {{ item.title }}
          </h3>
          
          <!-- Contenido de la noticia -->
          <p class="text-sm leading-relaxed mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ item.content }}
          </p>
          
          <!-- Mostrar si fue actualizada -->
          <div v-if="item.updatedAt && item.updatedAt !== item.createdAt" class="text-xs mb-4 p-2 rounded-lg" :class="isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'">
            ✏️ Actualizado el {{ formatDate(item.updatedAt) }}
          </div>
          
          <!-- Botones de acción -->
          <div v-if="canManageNews(item)" class="flex justify-end gap-3 pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editNews(item)"
              class="flex items-center space-x-2 text-xs px-4 py-2 rounded-lg font-medium transition duration-200"
              :class="isDarkMode ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700'"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button
              @click="deleteNews(item._id)"
              class="flex items-center space-x-2 text-xs px-4 py-2 rounded-lg font-medium transition duration-200"
              :class="isDarkMode ? 'bg-gray-800 hover:bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'"
            >
              <span>🗑️</span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
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

/* Scrollbar personalizado */
#news-items-container::-webkit-scrollbar {
  width: 6px;
}

#news-items-container::-webkit-scrollbar-track {
  background: transparent;
}

#news-items-container::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.5);
  border-radius: 3px;
}

#news-items-container::-webkit-scrollbar-thumb:hover {
  background: rgba(50, 34, 197, 0.8);
}
</style>