<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import News from './News.vue';
import Sidebarizquierda from './Sidebarizquierda.vue';
import { useThemeStore } from '@/stores/theme';
import jwtDecode from 'jwt-decode';

// --- DEFINICIÓN DE TIPOS ---
interface Post {
  _id?: string;
  title?: string;
  content: string;
  user?: string;
  club?: string;
  likesCount?: number;
  commentsCount?: number;
  saved?: boolean;
}

interface Notification {
  _id?: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'alert' | string;
  timestamp?: string;
  read?: boolean;
  userId?: string;
  userName?: string;
}

interface StatusMessage {
  text: string;
  success: boolean;
}

// --- ESTADO DEL COMPONENTE ---
const themeStore = useThemeStore();
const route = useRoute();
const isDarkMode = computed(() => themeStore.theme === 'dark');

const currentUser = ref<any>(null);
const posts = ref<Post[]>([]);
const userAbout = ref('');
const notifications = ref<Notification[]>([]);

const userPostsCount = computed(() => posts.value.filter(p => p.user === currentUser.value?.sub).length);
const userSavedCount = computed(() => posts.value.filter(p => p.saved).length);
const ownPosts = computed(() => posts.value.filter(p => p.user === currentUser.value?.sub));
const validNotifications = computed(() => notifications.value.filter(n => n?.title?.trim() || n?.content?.trim()));

const editingAbout = ref(false);
const aboutMeDraft = ref('');
const newNotification = ref<Omit<Notification, '_id'>>({ title: '', content: '', type: 'info' });
const editingNotification = ref<Notification | null>(null);
const isEditing = computed(() => !!editingNotification.value);


const isLoading = ref(false);
const savingAboutMe = ref(false);
const statusMessage = ref<StatusMessage | null>(null);

const LS_NOTIFICATIONS_KEY = 'persistent_notifications';

// --- UI CLASSES (Centralización de clases de Tailwind para limpieza del template) ---

const ui = computed(() => {
  const baseBorder = isDarkMode.value ? 'border-gray-700' : 'border-gray-300';
  const baseTextMuted = isDarkMode.value ? 'text-gray-400' : 'text-gray-600';
  const formInput = isDarkMode.value ? `bg-gray-800 ${baseBorder}` : `bg-white ${baseBorder}`;
  
  return {
    container: isDarkMode.value ? 'bg-black text-white' : 'bg-white text-black',
    contentBg: isDarkMode.value ? 'bg-black' : 'bg-white',
    headerBg: isDarkMode.value ? 'bg-gray-700' : 'bg-gray-300',
    profileBorder: isDarkMode.value ? 'border-white' : 'border-black',
    textPrimary: isDarkMode.value ? 'text-white' : 'text-black',
    textMuted: baseTextMuted,
    textMutedLight: isDarkMode.value ? 'text-gray-500' : 'text-gray-500',
    statBubble: isDarkMode.value ? 'border-gray-700' : 'border-gray-400',
    editButton: isDarkMode.value ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-700',
    border: baseBorder,
    formInput: formInput,
    formContainer: isDarkMode.value ? `${baseBorder} bg-gray-900` : `${baseBorder} bg-gray-50`,
    editFormContainer: isDarkMode.value ? 'border-yellow-700 bg-gray-900' : 'border-yellow-400 bg-yellow-50',
    status: {
      success: isDarkMode.value ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      error: isDarkMode.value ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
    },
    loginWarning: isDarkMode.value ? 'border-red-700 bg-red-900 text-white' : 'border-red-400 bg-red-100 text-red-800',
  };
});

const tabClasses = (path: string) => {
  const base = 'px-4 md:px-8 py-2 text-xs md:text-sm';
  if (route.path === path) {
    return `${base} border-b-2 border-green-500 text-green-500`;
  }
  return `${base} ${ui.value.textMuted}`;
};

const notificationStyles = (type: Notification['type']) => {
  const styles = {
    info: {
      bg: isDarkMode.value ? 'bg-green-900 bg-opacity-20 border border-green-800' : 'bg-green-50 border border-green-200',
      icon: 'bg-green-500',
    },
    warning: {
      bg: isDarkMode.value ? 'bg-yellow-900 bg-opacity-20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200',
      icon: 'bg-yellow-500',
    },
    alert: {
      bg: isDarkMode.value ? 'bg-red-900 bg-opacity-20 border border-red-800' : 'bg-red-50 border border-red-200',
      icon: 'bg-red-500',
    },
    default: {
      bg: isDarkMode.value ? 'bg-gray-800' : 'bg-gray-100',
      icon: 'bg-gray-500',
    }
  };
  return styles[type as keyof typeof styles] || styles.default;
};

// --- HELPERS (Funciones auxiliares para reducir duplicación) ---

/** Muestra un mensaje de estado y lo oculta después de un tiempo. */
function showStatus(text: string, success: boolean, duration: number = 3000) {
  statusMessage.value = { text, success };
  setTimeout(() => statusMessage.value = null, duration);
}

/** Wrapper para las llamadas fetch que maneja la autenticación y los errores. */
async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuario no autenticado');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Error en la solicitud a la API');
  }
  return response.json();
}

// --- LÓGICA DE AUTENTICACIÓN Y DATOS DE USUARIO ---

function initializeUser() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      currentUser.value = jwtDecode(token);
      return true;
    } catch {
      currentUser.value = null;
      return false;
    }
  }
  return false;
}

async function fetchUserData() {
  if (!currentUser.value?.sub) return;
  try {
    const [postsData, userData] = await Promise.all([
      apiFetch(`/posts?userId=${currentUser.value.sub}`),
      apiFetch(`/usuarios/${currentUser.value.sub}`)
    ]);
    
    posts.value = Array.isArray(postsData?.data) ? postsData.data : Array.isArray(postsData) ? postsData : [];
    userAbout.value = userData.about || '';
    aboutMeDraft.value = userAbout.value;

  } catch (error: any) {
    showStatus(error.message || 'Error al cargar datos del perfil.', false);
    posts.value = [];
    userAbout.value = '';
  }
}

async function saveAboutMe() {
  if (!currentUser.value?.sub) return;
  savingAboutMe.value = true;
  try {
    await apiFetch(`/usuarios/${currentUser.value.sub}/about`, {
      method: 'PATCH',
      body: JSON.stringify({ about: aboutMeDraft.value })
    });
    userAbout.value = aboutMeDraft.value;
    editingAbout.value = false;
    showStatus('Información actualizada correctamente.', true);
  } catch (error: any) {
    showStatus(error.message, false);
  } finally {
    savingAboutMe.value = false;
  }
}

function cancelEditAbout() {
  editingAbout.value = false;
  aboutMeDraft.value = userAbout.value;
}

// --- LÓGICA DE NOTIFICACIONES ---

function getPersistentNotifications(): Notification[] {
  const raw = localStorage.getItem(LS_NOTIFICATIONS_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePersistentNotification(notification: Notification) {
  const persisted = getPersistentNotifications();
  if (!notification._id || persisted.some(n => n._id === notification._id)) return;
  persisted.unshift(notification);
  localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(persisted.slice(0, 50))); // Limita el tamaño
}

async function fetchNotifications() {
  if (!currentUser.value?.sub) return;
  isLoading.value = true;
  try {
    const { data } = await apiFetch(`/notifications?userId=${currentUser.value.sub}`);
    const fetched: Notification[] = Array.isArray(data) ? data : [];
    const persisted = getPersistentNotifications();
    
    const fetchedIds = new Set(fetched.map(n => n._id));
    notifications.value = [...fetched, ...persisted.filter(p => !fetchedIds.has(p._id))];

  } catch (error: any) {
    showStatus(error.message, false);
    notifications.value = getPersistentNotifications();
  } finally {
    isLoading.value = false;
  }
}

async function createNotification() {
  isLoading.value = true;
  try {
    const payload: any = {
      ...newNotification.value,
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      userName: `${currentUser.value.firstName} ${currentUser.value.lastName}`
    };
    if (currentUser.value.rol?.toLowerCase() !== 'admin') {
      payload.userId = currentUser.value.sub;
    }
    
    const result = await apiFetch('/notifications', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    notifications.value.unshift(result.data);
    if (['info', 'warning'].includes(result.data.type)) {
      savePersistentNotification(result.data);
    }
    
    newNotification.value = { title: '', content: '', type: 'info' };
    showStatus('Notificación creada correctamente.', true);
  } catch (error: any) {
    showStatus(error.message, false);
  } finally {
    isLoading.value = false;
  }
}

function startEdit(notification: Notification) {
  editingNotification.value = { ...notification };
}

function cancelEdit() {
  editingNotification.value = null;
}

async function saveEdit() {
  if (!editingNotification.value?._id) return;
  isLoading.value = true;
  try {
    const result = await apiFetch(`/notifications/${editingNotification.value._id}`, {
      method: 'PUT',
      body: JSON.stringify(editingNotification.value)
    });
    
    const idx = notifications.value.findIndex(n => n._id === editingNotification.value?._id);
    if (idx !== -1) notifications.value[idx] = result.data;

    showStatus('Notificación actualizada correctamente.', true);
    editingNotification.value = null; // Cierra el editor
  } catch (error: any) {
    showStatus(error.message, false);
  } finally {
    isLoading.value = false;
  }
}

async function markAsRead(notificationId: string, index: number) {
  if (!notificationId) return;
  try {
    const updatedNotification = { ...notifications.value[index], read: true };
    await apiFetch(`/notifications/${notificationId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedNotification)
    });
    notifications.value[index].read = true;
    showStatus('Notificación marcada como leída.', true);
  } catch (error: any) {
    showStatus(error.message, false);
  }
}

// --- CICLO DE VIDA ---
onMounted(() => {
  if (initializeUser()) {
    fetchUserData();
    fetchNotifications();
  } else {
    showStatus('Debes iniciar sesión para ver tu perfil.', false);
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen overflow-hidden" :class="ui.container">
    <Sidebarizquierda class="w-full md:w-2/6 lg:w-2/6"/>
    
    <div class="w-full md:w-4/6 lg:w-4/6 flex flex-col relative overflow-y-auto" :class="ui.contentBg">
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden" :class="ui.headerBg">
        <img src="@/assets/bg_buildings_old.png" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="@/assets/images/user.jpg" alt="Usuario" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2" :class="ui.profileBorder" />
        <h1 class="mt-2 font-medium text-base md:text-lg" :class="ui.textPrimary">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
        <p class="text-xs md:text-sm" :class="ui.textMuted">{{ currentUser?.rol }}</p>
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="ui.statBubble">
            {{ userPostsCount }} Posts
          </div>
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="ui.statBubble">
            {{ userSavedCount }} Saved
          </div>
        </div>

        <div class="w-full flex flex-col items-center mt-2" style="max-width: 300px;">
          <button v-if="!editingAbout" @click="editingAbout = true" class="mt-2 md:mt-3 px-4 md:px-5 py-1 border rounded-full text-xs" :class="ui.editButton">
            Editar "About me"
          </button>
          <form v-if="editingAbout" @submit.prevent="saveAboutMe" class="flex flex-col w-full gap-2 mt-2">
            <textarea v-model="aboutMeDraft" class="w-full rounded px-3 py-2 text-xs border focus:outline-none" :class="ui.formInput" rows="3" maxlength="500"></textarea>
            <div class="flex gap-2">
              <button type="button" @click="cancelEditAbout" class="px-4 py-1 rounded bg-gray-400 text-white text-xs">Cancelar</button>
              <button type="submit" class="px-4 py-1 rounded bg-green-600 text-white text-xs" :disabled="savingAboutMe">
                {{ savingAboutMe ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
          <p v-else class="mt-2 text-xs text-center max-w-xs px-4" :class="ui.textMuted">
            {{ userAbout || 'Sin información personal.' }}
          </p>
        </div>
      </div>

      <div class="border-b text-center mt-4" :class="ui.border">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" :class="tabClasses('/Profile/posts')">Posts</router-link>
          <router-link to="/Profile/notifications" :class="tabClasses('/Profile/notifications')">Notifications</router-link>
        </div>
      </div>
      
      <router-view>
        <template v-if="$route.path === '/Profile/posts'">
          <div v-if="ownPosts.length === 0" class="text-center py-6 mt-4" :class="ui.textMuted">
            No hay posts disponibles
          </div>
          <div v-for="post in ownPosts" :key="post._id" class="bg-gray-900 border border-gray-700 rounded-lg p-5 mb-5 mx-4" style="color: #fff">
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

        <template v-if="$route.path === '/Profile/notifications'">
          <div v-if="!currentUser" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="ui.loginWarning">
            Debes iniciar sesión para acceder a las notificaciones
          </div>
          <template v-else>
            <div class="mx-4 my-4 p-4 border rounded-lg" :class="ui.formContainer">
              <h3 class="text-sm font-medium mb-3">Crear nueva notificación</h3>
              <div class="text-xs mb-3" :class="ui.textMuted">
                Usuario: {{ currentUser.firstName }} {{ currentUser.lastName }} ({{ currentUser.email }})
              </div>
              <form @submit.prevent="createNotification">
                <input v-model="newNotification.title" type="text" placeholder="Título" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500 mb-3" :class="ui.formInput" required />
                <textarea v-model="newNotification.content" placeholder="Contenido" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500 h-20 mb-3" :class="ui.formInput" required></textarea>
                <select v-model="newNotification.type" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500 mb-3" :class="ui.formInput" required :disabled="currentUser?.rol?.toLowerCase() !== 'admin' && newNotification.type === 'alert'">
                  <option value="info">Información</option>
                  <option value="warning">Advertencia</option>
                  <option value="alert">Alerta</option>
                </select>
                <div class="flex justify-end">
                  <button type="submit" class="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1 text-sm" :disabled="isLoading">
                    {{ isLoading ? 'Enviando...' : 'Enviar notificación' }}
                  </button>
                </div>
              </form>
            </div>

            <div v-if="isEditing && editingNotification" class="mx-4 my-4 p-4 border rounded-lg" :class="ui.editFormContainer">
              <h3 class="text-sm font-medium mb-3">Editar notificación</h3>
              <form @submit.prevent="saveEdit">
                <input v-model="editingNotification.title" type="text" placeholder="Título" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-blue-500 mb-3" :class="ui.formInput" required />
                <textarea v-model="editingNotification.content" placeholder="Contenido" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-green-500 h-20 mb-3" :class="ui.formInput" required></textarea>
                <select v-model="editingNotification.type" class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:border-green-500 mb-3" :class="ui.formInput" required :disabled="currentUser?.rol?.toLowerCase() !== 'admin' && editingNotification.type === 'alert'">
                   <option value="info">Información</option>
                  <option value="warning">Advertencia</option>
                  <option value="alert">Alerta</option>
                </select>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="cancelEdit" class="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-1 text-sm">
                    Cancelar
                  </button>
                  <button type="submit" class="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-4 py-1 text-sm" :disabled="isLoading">
                    {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
            
            <div v-if="statusMessage" class="mx-4 mb-3 p-2 rounded-lg text-center text-sm" :class="statusMessage.success ? ui.status.success : ui.status.error">
              {{ statusMessage.text }}
            </div>
            
            <div v-if="isLoading" class="text-center my-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <div v-if="validNotifications.length === 0 && !isLoading" class="text-center py-6 mt-4 rounded-lg mx-4" :class="ui.container">
              No hay notificaciones disponibles
            </div>
            <div v-for="(notification, index) in validNotifications" :key="notification._id || index" class="mx-4 mb-3 mt-4">
              <div class="p-3 rounded-lg" :class="notificationStyles(notification.type).bg">
                <div class="flex">
                  <div class="mr-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="notificationStyles(notification.type).icon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow">
                    <h3 class="text-sm font-medium">{{ notification.title }}</h3>
                    <p class="text-xs mt-1" :class="ui.textMuted">{{ notification.content }}</p>
                    <div class="flex justify-between items-center mt-2">
                      <span class="text-xs" :class="ui.textMutedLight">
                        {{ notification.timestamp || 'Hace un momento' }}
                        <span v-if="notification.userName" class="ml-1">- por {{ notification.userName }}</span>
                      </span>
                      <div class="flex space-x-2 items-center">
                        <button v-if="!notification.read" @click="markAsRead(notification._id!, index)" class="text-xs hover:text-white" :class="ui.textMuted">
                          Marcar como leída
                        </button>
                        <span v-else class="text-xs text-green-500">Leída</span>
                        <button v-if="currentUser?.rol?.toLowerCase() === 'admin'" @click="startEdit(notification)" class="text-xs text-yellow-400 hover:text-yellow-300">
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

    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 flex flex-col border-l" :class="ui.border">
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
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>