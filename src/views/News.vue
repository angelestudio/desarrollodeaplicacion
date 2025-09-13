<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload as UserJwtPayload } from '@/composables/useAuth';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.theme === 'dark');

interface NewsItem {
  _id?: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const newsUser = ref<UserJwtPayload | null>(getUserFromToken());
const isLoading = ref(false);
const isEditing = ref(false);
const editingNewsId = ref<string | null>(null);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

const API_URL = 'http://localhost:3000/news';

onMounted(async () => {
  await fetchNews();
  startAutoRefresh();
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});

const startAutoRefresh = () => {
  // Auto-refresh cada 30 segundos
  refreshInterval.value = setInterval(() => {
    fetchNews();
  }, 30000);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
};

const fetchNews = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(`${API_URL}?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    
    // Ordenar las noticias por fecha de creación (más recientes primero)
    const sortedData = data.sort((a: NewsItem, b: NewsItem) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Orden descendente (más recientes primero)
    });
    
    newsItems.value = sortedData;
    
    // Guardar en localStorage para el componente de inicio
    localStorage.setItem('persistent_news', JSON.stringify(sortedData));
    
  } catch (error) {
    console.error('Failed to fetch news:', error);
    displayNotification('Error al cargar noticias', 'error');
  } finally {
    isLoading.value = false;
  }
};

const manualRefresh = async () => {
  await fetchNews();
  displayNotification('Noticias actualizadas', 'success');
};

const publishNews = async () => {
  if (!newsUser.value) {
    displayNotification('Debes iniciar sesión para publicar noticias', 'error');
    return;
  }

  if (newsUser.value.rol !== 'admin') {
    displayNotification('Solo los administradores pueden publicar noticias', 'error');
    return;
  }

  if (!title.value.trim() || !content.value.trim()) {
    displayNotification('Por favor, completa tanto el título como el contenido de la noticia.', 'error');
    return;
  }

  const onlyNumbersRegex = /^\d+$/;
  if (onlyNumbersRegex.test(title.value.trim()) || onlyNumbersRegex.test(content.value.trim())) {
    displayNotification('El título y el contenido no pueden ser solo números.', 'error');
    return;
  }

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

    if (isEditing.value && editingNewsId.value) {
      await updateNews();
    } else {
      const newNewsItem: NewsItem = {
        title: title.value.trim(),
        content: content.value.trim(),
        author: `${newsUser.value.firstName} ${newsUser.value.lastName}`
      };

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

      const result = await response.json();
      displayNotification('Noticia publicada con éxito!', 'success');
    }

    await fetchNews();
    resetForm();

  } catch (error) {
    console.error('Error publishing/updating news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al publicar la noticia. Inténtalo de nuevo.';
    displayNotification(errorMessage, 'error');
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken();
    }
  } finally {
    isLoading.value = false;
  }
};

const editNews = (item: NewsItem) => {
  if (!item._id) {
    displayNotification('ID de noticia no válido', 'error');
    return;
  }
  isEditing.value = true;
  editingNewsId.value = item._id;
  title.value = item.title;
  content.value = item.content;
  scrollToForm();
};

const cancelEdit = () => {
  resetForm();
  displayNotification('Edición cancelada', 'success');
};

const updateNews = async () => {
  if (!editingNewsId.value) return;
  try {
    const updatedNewsItem: NewsItem = {
      title: title.value.trim(),
      content: content.value.trim(),
    };

    const response = await fetch(`${API_URL}/${editingNewsId.value}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedNewsItem),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      throw new Error(`Error: ${response.status}`);
    }

    displayNotification('Noticia actualizada con éxito!', 'success');
  } catch (error) {
    console.error('Error updating news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la noticia. Inténtalo de nuevo.';
    displayNotification(errorMessage, 'error');
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken();
    }
  }
};

const deleteNews = async (id?: string) => {
  if (!newsUser.value) {
    displayNotification('Debes iniciar sesión para eliminar noticias', 'error');
    return;
  }
  if (newsUser.value.rol !== 'admin') {
    displayNotification('Solo los administradores pueden eliminar noticias', 'error');
    return;
  }
  if (!id) {
    displayNotification('ID de noticia no válido', 'error');
    return;
  }
  if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return;
  try {
    isLoading.value = true;
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      else if (response.status === 403) throw new Error('No tienes permisos para eliminar esta noticia.');
      throw new Error(`Error: ${response.status}`);
    }
    await fetchNews();
    displayNotification('Noticia eliminada correctamente', 'success');
  } catch (error) {
    console.error('Error deleting news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la noticia';
    displayNotification(errorMessage, 'error');
    if (errorMessage.includes('Sesión expirada')) {
      newsUser.value = getUserFromToken();
    }
  } finally {
    isLoading.value = false;
  }
};

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

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

const canManageNews = (item: NewsItem): boolean => {
  if (!newsUser.value) return false;
  return newsUser.value.rol === 'admin';
};

const getAuthorInitials = (author: string): string => {
  if (!author || author === 'undefined' || author === 'null') return '??';
  const names = author.trim().split(' ');
  return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : author.substring(0, 2).toUpperCase();
};

const getAuthorName = (author: string): string => {
  if (!author || author === 'undefined' || author === 'null') return 'Autor desconocido';
  return author;
};

const resetForm = () => {
  title.value = '';
  content.value = '';
  isEditing.value = false;
  editingNewsId.value = null;
};

const scrollToForm = () => {
  const formElement = document.getElementById('news-form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div
    class="flex-1 flex flex-col p-8 overflow-y-auto border-r h-full"
    :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
  >
    <!-- Header igual al de clubs -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-emerald-500 mb-1">
        NOTIFICACIONES
      </h2>
      <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Mantente al día con las últimas actualizaciones
      </p>
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

    <!-- Estado de autenticación -->
    <div v-if="newsUser" class="mb-6 p-4 rounded-2xl border transition-all duration-200" :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-emerald-50 border-emerald-200'">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {{ newsUser.firstName[0] }}{{ newsUser.lastName[0] }}
        </div>
        <div>
          <p class="font-medium text-sm" :class="isDarkMode ? 'text-white' : 'text-emerald-900'">{{ newsUser.firstName }} {{ newsUser.lastName }}</p>
          <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-emerald-700'">{{ newsUser.rol }}</p>
        </div>
      </div>
    </div>

    <!-- Botón de actualización manual -->
    <div class="mb-6 flex justify-end">
      <button 
        @click="manualRefresh"
        :disabled="isLoading"
        class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-200"
        :class="[
          isDarkMode 
            ? 'bg-gray-900 border-gray-700 text-emerald-300 hover:bg-gray-800' 
            : 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200',
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <svg 
          class="w-4 h-4 transition-transform"
          :class="{ 'animate-spin': isLoading }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {{ isLoading ? 'Actualizando...' : 'Actualizar noticias' }}
      </button>
    </div>

    <!-- Sección Crear Noticia -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
        Crear nueva noticaa
      </h3>
      
      <div
  id="news-form"
  class="w-full max-w-xl mx-auto p-4 rounded-2xl border transition-all duration-200"
 :class="isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'">
        <div v-if="!newsUser" class="p-3 mb-4 rounded-xl bg-red-500 text-white text-sm">
          <span class="font-medium">⚠️ Debes iniciar sesión para publicar noticias</span>
        </div>
        
        <div v-else-if="newsUser.rol !== 'admin'" class="p-3 mb-4 rounded-xl bg-gray-500 text-white text-sm">
          <span class="font-medium">🔒 Solo los administradores pueden publicar noticias</span>
        </div>
        
        <div class="space-y-4">
          <div>
            <label for="news-title" class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Título de la noticia
            </label>
            <input
              type="text"
              id="news-title"
              v-model="title"
              :disabled="!newsUser || newsUser.rol !== 'admin'"
              class="w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              placeholder="Escribe un título llamativo para tu noticia..."
            >
          </div>
          
          <div>
            <label for="news-content" class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Contenido de la noticia
            </label>
            <textarea
              id="news-content"
              v-model="content"
              :disabled="!newsUser || newsUser.rol !== 'admin'"
              class="w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-32 resize-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              placeholder="Escribe el contenido completo de tu noticia aquí..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-4">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium rounded-xl transition duration-200 disabled:opacity-50"
            :class="isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'"
          >
            Cancelar
          </button>
          
          <button
            @click="publishNews"
            :disabled="isLoading || !newsUser || newsUser.rol !== 'admin'"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition duration-200 disabled:opacity-50 flex items-center space-x-2"
          >
            <span v-if="isLoading" class="animate-spin">⏳</span>
            <span>{{ isLoading ? (isEditing ? 'Actualizando...' : 'Publicando...') : (isEditing ? 'Actualizar noticia' : 'Publicar noticia') }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Sección Noticias -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
        Todas las noticias
      </h3>
      
      <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
        <div v-if="isLoading && newsItems.length === 0" class="text-center py-12">
          <div class="animate-spin text-4xl mb-4">⏳</div>
          <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Cargando noticias...</p>
        </div>
        
        <div v-else-if="newsItems.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📰</div>
          <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">No hay noticias disponibles.</p>
          <p class="text-sm mt-2" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">¡Sé el primero en publicar una noticia!</p>
        </div>
        
        <div v-else v-for="item in newsItems" :key="item._id"
  class="w-full max-w-xl mx-auto p-4 rounded-2xl border transition-all duration-200 hover:shadow-md">
 :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'">
          <!-- Header con autor -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {{ getAuthorInitials(item.author || '') }}
              </div>
              <div>
                <h4 class="font-semibold text-sm" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ getAuthorName(item.author || '') }}
                </h4>
                <div class="flex items-center space-x-2">
                  <span class="text-xs px-2 py-1 rounded-full bg-emerald-600 text-white font-medium">
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
          <h3 class="text-lg font-semibold mb-3 leading-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            {{ item.title }}
          </h3>
          
          <!-- Contenido de la noticia -->
          <p class="text-sm leading-relaxed mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ item.content }}
          </p>
          
          <!-- Mostrar si fue actualizada -->
          <div v-if="item.updatedAt && item.updatedAt !== item.createdAt" class="text-xs mb-4 p-2 rounded-xl" :class="isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'">
            ✏️ Actualizado el {{ formatDate(item.updatedAt) }}
          </div>
          
          <!-- Botones de acción -->
          <div v-if="canManageNews(item)" class="flex justify-end gap-3 pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editNews(item)"
              class="flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-medium transition duration-200"
              :class="isDarkMode ? 'bg-emerald-800 hover:bg-emerald-700 text-white' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button
              @click="deleteNews(item._id)"
              class="flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-medium transition duration-200"
              :class="isDarkMode ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-50 hover:bg-red-100 text-red-700'"
            >
              <span>🗑️</span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Scrollbar personalizada para el contenedor de noticias */
.space-y-4::-webkit-scrollbar {
  width: 8px;
}

.space-y-4::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Para Firefox */
.space-y-4 {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 #374151;
}
</style>