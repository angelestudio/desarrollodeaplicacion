<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload } from 'jwt-decode';

interface NewsItem {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  author?: string;
}

const title = ref('');
const content = ref('');
const newsItems = ref<NewsItem[]>([]);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref(false);
const isEditing = ref(false);
const editingNewsId = ref<string | null>(null);
const isLoading = ref(false);

const newsUser = ref<JwtPayload | null>(getUserFromToken());
const API_URL = 'http://localhost:3000/news';

onMounted(async () => {
  await fetchNews();
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

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
        body: JSON.stringify(newNewsItem)
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(`Error: ${response.status}`);
      }
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

const updateNews = async () => {
  if (!editingNewsId.value) return;
  try {
    const updatedNewsItem: NewsItem = {
      title: title.value.trim(),
      content: content.value.trim()
    };
    const response = await fetch(`${API_URL}/${editingNewsId.value}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedNewsItem)
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
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

const cancelEdit = () => {
  resetForm();
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
  if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
    return;
  }
  try {
    isLoading.value = true;
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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch {
    return dateString;
  }
};

const canManageNews = (item: NewsItem): boolean => {
  return newsUser.value?.rol === 'admin';
};
</script>

<template>
  <div v-if="newsUser" class="bg-gray-800 p-2 mb-4 rounded text-xs text-gray-300">
    Conectado como: {{ newsUser.firstName }} {{ newsUser.lastName }} ({{ newsUser.rol }})
  </div>

  <div id="news-form" class="bg-gray-900 p-3 mb-4 rounded-lg border border-gray-700">
    <h3 class="text-blue-500 font-medium text-sm mb-2">
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
      <input id="news-title" v-model="title" :disabled="!newsUser || newsUser.rol !== 'admin'" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50" placeholder="Título de la noticia" />
    </div>

    <div class="mb-3">
      <label for="news-content" class="block text-xs text-gray-400 mb-1">Contenido:</label>
      <textarea id="news-content" v-model="content" :disabled="!newsUser || newsUser.rol !== 'admin'" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 h-24 disabled:opacity-50" placeholder="Contenido de la noticia"></textarea>
    </div>

    <div class="flex justify-end gap-2">
      <button v-if="isEditing" @click="cancelEdit" class="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200">Cancelar</button>
      <button @click="publishNews" :disabled="isLoading || !newsUser || newsUser.rol !== 'admin'" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50">
        <span v-if="isLoading">{{ isEditing ? 'Actualizando...' : 'Publicando...' }}</span>
        <span v-else>{{ isEditing ? 'Actualizar noticia' : 'Publicar noticia' }}</span>
      </button>
    </div>
  </div>

  <div id="news-items-container" class="overflow-y-auto max-h-96">
    <div v-if="isLoading && newsItems.length === 0" class="text-center py-4 text-gray-400">Cargando noticias...</div>
    <div v-else-if="newsItems.length === 0" class="text-center py-4 text-gray-400">No hay noticias disponibles.</div>

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
            <button v-if="canManageNews(item)" @click="editNews(item)" class="text-xs text-blue-600 hover:text-blue-800">Editar</button>
            <button v-if="canManageNews(item)" @click="deleteNews(item._id)" class="text-xs text-red-600 hover:text-red-800">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showNotification" class="fixed bottom-4 right-4 p-3 rounded shadow-lg text-white text-sm z-50" :class="notificationType === 'success' ? 'bg-green-600' : 'bg-red-600'">
      {{ notificationMessage }}
    </div>
  </Teleport>
</template>