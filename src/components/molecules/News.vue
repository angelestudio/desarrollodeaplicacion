<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';
import type { JwtPayload as UserJwtPayload } from '@/composables/useAuth';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.theme === 'dark');

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

const newsUser = ref<UserJwtPayload | null>(getUserFromToken() as UserJwtPayload);
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
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    newsItems.value = await response.json();
  } catch {
    displayNotification('Error al cargar noticias', 'error');
  } finally {
    isLoading.value = false;
  }
};

const publishNews = async () => {
  if (!newsUser.value) return displayNotification('Debes iniciar sesión para publicar noticias', 'error');
  if (newsUser.value.rol !== 'admin') return displayNotification('Solo los administradores pueden publicar noticias', 'error');
  if (!title.value.trim() || !content.value.trim()) return displayNotification('Completa título y contenido', 'error');

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
        if (response.status === 401) throw new Error('Sesión expirada');
        throw new Error(`Error: ${response.status}`);
      }
      displayNotification('Noticia publicada', 'success');
    }
    await fetchNews();
    resetForm();
  } catch (e: any) {
    displayNotification(e.message || 'Error al publicar', 'error');
    if (e.message.includes('Sesión expirada')) newsUser.value = getUserFromToken() as UserJwtPayload;
  } finally {
    isLoading.value = false;
  }
};

const editNews = (item: NewsItem) => {
  if (!item._id) return displayNotification('ID no válido', 'error');
  isEditing.value = true;
  editingNewsId.value = item._id;
  title.value = item.title;
  content.value = item.content;
  scrollToForm();
};

const updateNews = async () => {
  if (!editingNewsId.value) return;
  try {
    const updated: Partial<NewsItem> = { title: title.value.trim(), content: content.value.trim() };
    const response = await fetch(`${API_URL}/${editingNewsId.value}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updated)
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sesión expirada');
      throw new Error(`Error: ${response.status}`);
    }
    displayNotification('Noticia actualizada', 'success');
    await fetchNews();
    resetForm();
  } catch (e: any) {
    displayNotification(e.message || 'Error al actualizar', 'error');
    if (e.message.includes('Sesión expirada')) newsUser.value = getUserFromToken() as UserJwtPayload;
  }
};

const deleteNews = async (id?: string) => {
  if (!newsUser.value) return displayNotification('Debes iniciar sesión', 'error');
  if (newsUser.value.rol !== 'admin') return displayNotification('Solo administradores', 'error');
  if (!id) return displayNotification('ID no válido', 'error');
  if (!confirm('¿Eliminar esta noticia?')) return;

  try {
    isLoading.value = true;
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sesión expirada');
      if (response.status === 403) throw new Error('No tienes permisos');
      throw new Error(`Error: ${response.status}`);
    }
    displayNotification('Noticia eliminada', 'success');
    await fetchNews();
  } catch (e: any) {
    displayNotification(e.message || 'Error al eliminar', 'error');
    if (e.message.includes('Sesión expirada')) newsUser.value = getUserFromToken() as UserJwtPayload;
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  title.value = '';
  content.value = '';
  isEditing.value = false;
  editingNewsId.value = null;
};

const scrollToForm = () => {
  document.getElementById('news-form')?.scrollIntoView({ behavior: 'smooth' });
};

const displayNotification = (message: string, type: 'success' | 'error') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  setTimeout(() => showNotification.value = false, 3000);
};

const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch {
    return dateString;
  }
};

const canManageNews = (item: NewsItem) => newsUser.value?.rol === 'admin';
</script>

<template>
  <div
    v-if="newsUser"
    :class="[
      isDarkMode
        ? 'bg-gray-900 p-2 mb-4 rounded text-xs text-green-400 border border-green-700'
        : 'bg-green-50 p-2 mb-4 rounded text-xs text-green-700 border border-green-200'
    ]"
  >
    Conectado como: {{ newsUser.firstName }} {{ newsUser.lastName }} ({{ newsUser.rol }})
  </div>

  <div
    id="news-form"
    :class="[
      isDarkMode
        ? 'bg-black p-3 mb-4 rounded-lg border border-green-700'
        : 'bg-white p-3 mb-4 rounded-lg border border-green-200'
    ]"
  >
    <h3 :class="isDarkMode ? 'text-green-500 font-medium text-sm mb-2' : 'text-green-600 font-medium text-sm mb-2'">
      {{ isEditing ? 'Editar noticia' : 'Crear nueva noticia' }}
    </h3>

    <div
      v-if="!newsUser"
      :class="isDarkMode ? 'bg-red-900 text-white p-2 mb-3 rounded text-xs border border-red-700' : 'bg-red-100 text-red-800 p-2 mb-3 rounded text-xs border border-red-200'"
    >
      Debes iniciar sesión
    </div>
    <div
      v-else-if="newsUser.rol !== 'admin'"
      :class="isDarkMode ? 'bg-red-900 text-white p-2 mb-3 rounded text-xs border border-red-700' : 'bg-red-100 text-red-800 p-2 mb-3 rounded text-xs border border-red-200'"
    >
      Solo administradores
    </div>

    <div class="mb-3">
      <label for="news-title" :class="isDarkMode ? 'block text-xs text-green-400 mb-1' : 'block text-xs text-green-600 mb-1'">Título:</label>
      <input
        id="news-title"
        v-model="title"
        :disabled="!newsUser||newsUser.rol!=='admin'"
        :class="isDarkMode
          ? 'w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 disabled:opacity-50'
          : 'w-full bg-white border border-green-200 rounded px-3 py-2 text-sm text-green-700 focus:outline-none focus:border-green-500 disabled:opacity-50'"
        placeholder="Título de la noticia"
      />
    </div>

    <div class="mb-3">
      <label for="news-content" :class="isDarkMode ? 'block text-xs text-green-400 mb-1' : 'block text-xs text-green-600 mb-1'">Contenido:</label>
      <textarea
        id="news-content"
        v-model="content"
        :disabled="!newsUser||newsUser.rol!=='admin'"
        :class="isDarkMode
          ? 'w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 h-24 disabled:opacity-50'
          : 'w-full bg-white border border-green-200 rounded px-3 py-2 text-sm text-green-700 focus:outline-none focus:border-green-500 h-24 disabled:opacity-50'"
        placeholder="Contenido de la noticia"
      ></textarea>
    </div>

    <div class="flex justify-end gap-2">
      <button
        v-if="isEditing"
        @click="resetForm"
        :class="isDarkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded transition duration-300'
          : 'bg-gray-200 hover:bg-gray-300 text-green-700 text-sm font-medium py-2 px-4 rounded transition duration-300'"
      >Cancelar</button>
      <button
        @click="publishNews"
        :disabled="isLoading||!newsUser||newsUser.rol!=='admin'"
        :class="isDarkMode
          ? 'bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded disabled:opacity-50 transition duration-300'
          : 'bg-[#21c25a] hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded disabled:opacity-50 transition duration-300'"
      >
        <span v-if="isLoading">{{ isEditing ? 'Actualizando...' : 'Publicando...' }}</span>
        <span v-else>{{ isEditing ? 'Actualizar' : 'Publicar' }}</span>
      </button>
    </div>
  </div>

  <div id="news-items-container" class="overflow-y-auto max-h-96">
    <div v-if="isLoading&&newsItems.length===0" :class="isDarkMode ? 'text-center py-4 text-gray-400' : 'text-center py-4 text-gray-400'">Cargando...</div>
    <div v-else-if="newsItems.length===0" :class="isDarkMode ? 'text-center py-4 text-gray-400' : 'text-center py-4 text-gray-400'">No hay noticias.</div>

    <div
      v-else
      v-for="item in newsItems"
      :key="item._id"
      :class="isDarkMode
        ? 'bg-gray-800 p-3 mb-4 rounded border border-gray-700'
        : 'bg-white p-3 mb-4 rounded border border-green-200'"
    >
      <div class="flex">
        <div class="mr-3">
          <div :class="isDarkMode ? 'border border-green-500 p-1 w-12 h-12 flex flex-col items-center justify-center bg-black' : 'border border-green-500 p-1 w-12 h-12 flex flex-col items-center justify-center bg-white'">
            <span :class="isDarkMode ? 'text-xs font-bold text-green-500' : 'text-xs font-bold text-green-600'">NEWS</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 :class="isDarkMode ? 'text-green-400 font-medium text-sm' : 'text-green-600 font-medium text-sm'">{{ item.title }}</h3>
          <p :class="isDarkMode ? 'text-xs text-gray-300 mt-1' : 'text-xs text-green-900 mt-1'">{{ item.content }}</p>
          <div class="flex justify-between items-center mt-2">
            <p v-if="item.createdAt" class="text-xs text-gray-500">{{ formatDate(item.createdAt) }}</p>
            <p v-if="item.author" class="text-xs text-gray-500">Por: {{ item.author }}</p>
          </div>
          <div class="flex justify-end mt-3 gap-2">
            <button v-if="canManageNews(item)" @click="editNews(item)" :class="isDarkMode ? 'text-xs text-green-500 hover:text-green-400 transition duration-300' : 'text-xs text-green-600 hover:text-green-400 transition duration-300'">Editar</button>
            <button v-if="canManageNews(item)" @click="deleteNews(item._id)" :class="isDarkMode ? 'text-xs text-red-500 hover:text-red-400 transition duration-300' : 'text-xs text-red-600 hover:text-red-400 transition duration-300'">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showNotification" class="fixed bottom-4 right-4 p-3 rounded shadow-lg text-white text-sm z-50" :class="notificationType==='success'?'bg-green-600':'bg-red-600'">{{ notificationMessage }}</div>
  </Teleport>
</template>