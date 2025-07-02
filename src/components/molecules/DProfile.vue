<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import News from './News.vue';
import Sidebarizquierda from './Sidebarizquierda.vue';
import { useThemeStore } from '@/stores/theme';
import jwtDecode from 'jwt-decode';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.theme === 'dark');
const currentUser = ref<any>(null);

// Estado para Posts
const posts = ref<Array<{ _id?: string; title?: string; content: string; user?: string; club?: string; likesCount?: number; commentsCount?: number; saved?: boolean }>>([]);

// Estado para número de posts y guardados
const userPostsCount = ref(0);
const userSavedCount = ref(0);
const userAbout = ref('');

// "About me" edición
const editingAbout = ref(false);
const aboutMeDraft = ref('');
const savingAboutMe = ref(false);

// Definición de notificaciones
interface Notification {
  _id?: string;
  title: string;
  content: string;
  type: string;
  timestamp?: string;
  read?: boolean;
  userId?: string;
  userName?: string;
}

const notifications = ref<Notification[]>([]);
const isLoading = ref(false);
const isEditing = ref(false);
const editingNotification = ref<Notification | null>(null);
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

// Obtener usuario desde JWT
function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

// Verificar autenticación
function checkAuthentication() {
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
}

// --- LocalStorage helpers para notificaciones persistentes ---
const LS_NOTIFICATIONS_KEY = 'persistent_notifications';

function savePersistentNotification(notification: Notification) {
  const persisted: Notification[] = getPersistentNotifications();
  if (notification._id && persisted.some(n => n._id === notification._id)) return;
  persisted.unshift(notification);
  localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(persisted));
}

function getPersistentNotifications(): Notification[] {
  const raw = localStorage.getItem(LS_NOTIFICATIONS_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearPersistentNotifications() {
  localStorage.removeItem(LS_NOTIFICATIONS_KEY);
}

// Cambia el filtro aquí: usamos "user" como campo, no "userId"
const ownPosts = computed(() => {
  if (!currentUser.value) return [];
  // El campo correcto es "user"
  return posts.value.filter(post => post.user === currentUser.value.sub);
});

async function fetchUserData() {
  try {
    const token = localStorage.getItem('token');
    if (!token || !currentUser.value) return;
    // Obtener posts
    const postsRes = await fetch(`http://localhost:3000/posts?userId=${currentUser.value.sub}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      posts.value = Array.isArray(postsData?.data) ? postsData.data : Array.isArray(postsData) ? postsData : [];
      userPostsCount.value = ownPosts.value.length;
      userSavedCount.value = posts.value.filter(p => p.saved).length;
      // Logs para depurar
      console.log("posts.value:", posts.value);
      console.log("currentUser.value:", currentUser.value);
      console.log("ownPosts.value:", ownPosts.value);
    } else {
      posts.value = [];
      userPostsCount.value = 0;
      userSavedCount.value = 0;
    }
    // Obtener perfil/about
    const userRes = await fetch(`http://localhost:3000/usuarios/${currentUser.value.sub}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      userAbout.value = userData.about || '';
      aboutMeDraft.value = userAbout.value;
    }
    else {
      userAbout.value = '';
      aboutMeDraft.value = '';
    }
  } catch (e) {
    posts.value = [];
    userPostsCount.value = 0;
    userSavedCount.value = 0;
    userAbout.value = '';
    aboutMeDraft.value = '';
  }
}

// Guardar About Me
function cancelEditAbout() {
  editingAbout.value = false;
  aboutMeDraft.value = userAbout.value;
}

async function saveAboutMe() {
  if (!currentUser.value) return;
  savingAboutMe.value = true;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${currentUser.value.sub}/about`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ about: aboutMeDraft.value })
    });
    if (!res.ok) throw new Error('Error al guardar About me');
    userAbout.value = aboutMeDraft.value;
    editingAbout.value = false;
    statusMessage.value = { text: 'Información actualizada', success: true };
    setTimeout(() => { statusMessage.value = null }, 2000);
  } catch {
    statusMessage.value = { text: 'No se pudo actualizar la información', success: false };
  } finally {
    savingAboutMe.value = false;
  }
}

// Cargar notificaciones personales + globales + persistentes
async function fetchNotifications() {
  isLoading.value = true;
  try {
    currentUser.value = getUserFromToken();
    if (!currentUser.value) throw new Error('Usuario no autenticado');
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:3000/notifications?userId=${currentUser.value.sub}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error('Error al cargar notificaciones');
    const { data } = await response.json();
    let fetchedNotifications: Notification[] = Array.isArray(data) ? data : [];
    const persisted = getPersistentNotifications();
    const merged = [
      ...persisted.filter(
        p => !fetchedNotifications.some(n => n._id && n._id === p._id)
      ),
      ...fetchedNotifications
    ];
    notifications.value = merged;
  } catch (error: any) {
    statusMessage.value = {
      text: 'Error al cargar notificaciones. Por favor, intente de nuevo.',
      success: false
    };
    notifications.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function createNotification() {
  isLoading.value = true;
  try {
    currentUser.value = getUserFromToken();
    if (!currentUser.value) throw new Error('Usuario no autenticado');
    const notificationData: any = {
      ...newNotification.value,
      timestamp: new Date().toLocaleString(),
      read: false,
      userName: `${currentUser.value.firstName} ${currentUser.value.lastName}`
    };
    if (currentUser.value.rol?.toLowerCase() !== 'admin') {
      notificationData.userId = currentUser.value.sub;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notificationData)
    });

    let errorText = '';
    if (!response.ok) {
      try {
        const errorData = await response.json();
        errorText = errorData.message || JSON.stringify(errorData);
      } catch (err) {
        errorText = response.statusText;
      }
      throw new Error(`Error al crear notificación: ${errorText}`);
    }

    const result = await response.json();
    const savedNotification = result.data;
    notifications.value.unshift(savedNotification);

    if (savedNotification.type === 'info' || savedNotification.type === 'warning') {
      savePersistentNotification(savedNotification);
    }

    if (savedNotification.type === 'alert') {
      localStorage.setItem('new_global_notification', Date.now().toString());
      if (window.fetchLandingNotifications) {
        window.fetchLandingNotifications();
      }
    }
    newNotification.value = { title: '', content: '', type: 'info' };
    statusMessage.value = { text: 'Notificación creada correctamente', success: true };
    setTimeout(() => { statusMessage.value = null }, 3000);
  } catch (error: any) {
    statusMessage.value = {
      text: error?.message || 'Error al crear la notificación. Por favor, intente de nuevo.',
      success: false
    };
  } finally {
    isLoading.value = false;
  }
}
function startEdit(notification: Notification) {
  editingNotification.value = JSON.parse(JSON.stringify(notification));
  isEditing.value = true;
}
function cancelEdit() {
  editingNotification.value = null;
  isEditing.value = false;
}
async function saveEdit() {
  if (!editingNotification.value || !editingNotification.value._id) return;
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');
    const response = await fetch(
      `http://localhost:3000/notifications/${editingNotification.value._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingNotification.value)
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al actualizar notificación: ${errorData.message || response.statusText}`);
    }
    const result = await response.json();
    const idx = notifications.value.findIndex(n => n._id === editingNotification.value?._id);
    if (idx !== -1) notifications.value[idx] = result.data;

    if (editingNotification.value.type === 'info' || editingNotification.value.type === 'warning') {
      const persisted = getPersistentNotifications();
      const i = persisted.findIndex(n => n._id === editingNotification.value?._id);
      if (i !== -1) {
        persisted[i] = result.data;
        localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(persisted));
      }
    }

    statusMessage.value = { text: 'Notificación actualizada correctamente', success: true };
    setTimeout(() => { statusMessage.value = null }, 3000);
    cancelEdit();
  } catch (error: any) {
    statusMessage.value = { text: error.message || 'Error al actualizar la notificación', success: false };
  } finally {
    isLoading.value = false;
  }
}

async function markAsRead(_id: string | undefined, index: number) {
  if (!_id) return;
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuario no autenticado');
    const notification = notifications.value[index];
    const updatedNotification = { ...notification, read: true };
    const response = await fetch(
      `http://localhost:3000/notifications/${_id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedNotification)
      }
    );
    if (!response.ok) throw new Error('Error al actualizar notificación');
    notifications.value[index].read = true;

    if (notification.type === 'info' || notification.type === 'warning') {
      const persisted = getPersistentNotifications();
      const i = persisted.findIndex(n => n._id === _id);
      if (i !== -1) {
        persisted[i].read = true;
        localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(persisted));
      }
    }

    statusMessage.value = { text: 'Notificación marcada como leída', success: true };
    setTimeout(() => { statusMessage.value = null }, 3000);
  } catch (error: any) {
    statusMessage.value = { text: 'Error al marcar como leída. Por favor, intente de nuevo.', success: false };
  }
}

onMounted(async () => {
  if (checkAuthentication()) {
    await Promise.all([
      fetchNotifications(),
      fetchUserData()
    ]);
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen overflow-hidden" :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'">
    <!-- Sidebar izquierda -->
    <Sidebarizquierda class="w-full md:w-2/6 lg:w-2/6"/>
    <!-- Contenido principal -->
    <div class="w-full md:w-4/6 lg:w-4/6 flex flex-col relative overflow-y-auto" :class="isDarkMode ? 'bg-black' : 'bg-white'">
      <!-- Imagen de fondo edificios -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-300'">
        <img src="@/assets/bg_buildings_old.png" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>
      <!-- Perfil usuario -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="@/assets/images/user.jpg" alt="Usuario" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2" :class="isDarkMode ? 'border-white' : 'border-black'" />
        <h1 class="mt-2 font-medium text-base md:text-lg" :class="isDarkMode ? 'text-white' : 'text-black'">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
        <p class="text-xs md:text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ currentUser?.rol }}</p>
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="isDarkMode ? 'border-gray-700' : 'border-gray-400'">
            {{ userPostsCount }} Posts
          </div>
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="isDarkMode ? 'border-gray-700' : 'border-gray-400'">
            {{ userSavedCount }} Saved
          </div>
        </div>
        <!-- Editable About Me -->
        <div class="w-full flex flex-col items-center mt-2" style="max-width: 300px;">
          <button
            v-if="!editingAbout"
            class="mt-2 md:mt-3 px-4 md:px-5 py-1 border rounded-full text-xs"
            :class="isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-700'"
            @click="editingAbout = true"
          >
            Editar "About me"
          </button>
          <form v-if="editingAbout" @submit.prevent="saveAboutMe" class="flex flex-col w-full gap-2 mt-2">
            <textarea
              v-model="aboutMeDraft"
              class="w-full rounded px-3 py-2 text-xs border focus:outline-none"
              :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'"
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="flex gap-2">
              <button type="button" @click="cancelEditAbout" class="px-4 py-1 rounded bg-gray-400 text-white text-xs">Cancelar</button>
              <button type="submit" class="px-4 py-1 rounded bg-green-600 text-white text-xs" :disabled="savingAboutMe">
                {{ savingAboutMe ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
          <p v-else class="mt-2 text-xs text-center max-w-xs px-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ userAbout || 'Sin información personal.' }}
          </p>
        </div>
      </div>
      <!-- Navegación de tabs -->
      <div class="border-b text-center mt-4" :class="isDarkMode ? 'border-gray-800' : 'border-gray-300'">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-green-500 text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-green-500 text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')">Notifications</router-link>
        </div>
      </div>
      <!-- RouterView (posts/notifications) -->
      <router-view>
        <!-- Posts -->
        <template v-if="$route.path === '/Profile/posts'">
          <div v-if="ownPosts.length === 0" class="text-center py-6 mt-4" :class="isDarkMode ? 'text-gray-500' : 'text-gray-600'">
            No hay posts disponibles
          </div>
          <div
            v-for="post in ownPosts"
            :key="post._id"
            class="bg-gray-900 border border-gray-700 rounded-lg p-5 mb-5 mx-4"
            style="color: #fff"
          >
            <h2 class="text-2xl font-bold mb-2" style="color: #39FF14">{{ post.title }}</h2>
            <p class="mb-2">{{ post.content }}</p>
            <div class="mb-2">
              <span>Club: {{ post.club || 'Sin club' }}</span>
              <span class="ml-4">👍 {{ post.likesCount || 0 }}</span>
              <span class="ml-4">📝 {{ post.commentsCount || 0 }} Comentarios</span>
            </div>
            <div class="flex gap-2">
              <button class="bg-blue-700 px-3 py-1 rounded text-white text-xs">Like</button>
              <button class="bg-purple-700 px-3 py-1 rounded text-white text-xs">Comentarios</button>
              <button class="bg-red-700 px-3 py-1 rounded text-white text-xs ml-auto">Delete</button>
            </div>
          </div>
        </template>
        <!-- Notificaciones -->
        <!-- Notificaciones -->
        <template v-if="$route.path === '/Profile/notifications'">
          <div v-if="!currentUser" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="isDarkMode ? 'border-red-700 bg-red-900 text-white' : 'border-red-400 bg-red-100 text-red-800'">
            Debes iniciar sesión para acceder a las notificaciones
          </div>
          <template v-else>
            <!-- Formulario para crear notificación -->
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
                    :disabled="currentUser?.rol?.toLowerCase() !== 'admin' && newNotification.type === 'alert'"
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
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Enviando...' : 'Enviar notificación' }}
                  </button>
                </div>
              </form>
            </div>
            <!-- Editar notificación -->
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
                    :disabled="currentUser?.rol?.toLowerCase() !== 'admin' && editingNotification.type === 'alert'"
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
                      'bg-yellow-500': notification.type === 'warning',
                      'bg-red-500': notification.type === 'alert',
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
    <!-- Sidebar derecha -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 flex flex-col border-l" :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-300'">
      <div>
        <News />
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
</style>