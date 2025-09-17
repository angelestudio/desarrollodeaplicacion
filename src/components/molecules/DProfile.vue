<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
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
  createdAt?: string;
}

interface ToastNotification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'alert' | 'success' | 'error';
  timestamp: Date;
  isVisible: boolean;
  isLeaving: boolean;
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
const toastNotifications = ref<ToastNotification[]>([]);

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
const LS_LAST_NOTIFICATION_CHECK = 'last_notification_check';

// Verificar si el usuario es admin
const isAdmin = computed(() => currentUser.value?.rol?.toLowerCase() === 'admin');

// --- NUEVAS CONSTANTES Y COMPUTED PROPERTIES PARA EL FORMULARIO ---
const notificationTypes = ref([
  { value: 'info', label: 'Información', color: 'green', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'warning', label: 'Advertencia', color: 'yellow', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z' },
  { value: 'alert', label: 'Alerta', color: 'red', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' }
]);

const selectedNotificationType = computed(() => {
  return notificationTypes.value.find(t => t.value === newNotification.value.type) || notificationTypes.value[0];
});

const formDynamicStyles = computed(() => {
  const type = selectedNotificationType.value;
  
  if (isDarkMode.value) {
    // Tema oscuro
    switch (type.color) {
      case 'green':
        return {
          border: 'border-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          buttonText: 'text-white'
        };
      case 'yellow':
        return {
          border: 'border-yellow-700',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
          buttonText: 'text-white'
        };
      case 'red':
        return {
          border: 'border-red-700',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          buttonText: 'text-white'
        };
      default:
        return {
          border: 'border-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          buttonText: 'text-white'
        };
    }
  } else {
    // Tema claro
    switch (type.color) {
      case 'green':
        return {
          border: 'border-green-500',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          buttonText: 'text-white'
        };
      case 'yellow':
        return {
          border: 'border-yellow-500',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
          buttonText: 'text-white'
        };
      case 'red':
        return {
          border: 'border-red-500',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          buttonText: 'text-white'
        };
      default:
        return {
          border: 'border-green-500',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          buttonText: 'text-white'
        };
    }
  }
});

const getNotificationTypeButtonClass = computed(() => {
  return (type: any) => {
    const baseClass = 'p-2 rounded-lg text-xs flex items-center justify-center transition-all duration-200 border';
    
    if (newNotification.value.type === type.value) {
      // Botón seleccionado
      if (isDarkMode.value) {
        switch (type.color) {
          case 'green':
            return `${baseClass} bg-green-600 border-green-600 text-white shadow-lg scale-105`;
          case 'yellow':
            return `${baseClass} bg-yellow-600 border-yellow-600 text-white shadow-lg scale-105`;
          case 'red':
            return `${baseClass} bg-red-600 border-red-600 text-white shadow-lg scale-105`;
          default:
            return `${baseClass} bg-green-600 border-green-600 text-white shadow-lg scale-105`;
        }
      } else {
        switch (type.color) {
          case 'green':
            return `${baseClass} bg-green-500 border-green-500 text-white shadow-lg scale-105`;
          case 'yellow':
            return `${baseClass} bg-yellow-500 border-yellow-500 text-white shadow-lg scale-105`;
          case 'red':
            return `${baseClass} bg-red-500 border-red-500 text-white shadow-lg scale-105`;
          default:
            return `${baseClass} bg-green-500 border-green-500 text-white shadow-lg scale-105`;
        }
      }
    } else {
      // Botón no seleccionado
      if (isDarkMode.value) {
        return `${baseClass} bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200`;
      } else {
        return `${baseClass} bg-white border-gray-300 hover:bg-gray-50 text-gray-700`;
      }
    }
  };
});

const postCardStyles = computed(() => {
  if (isDarkMode.value) {
      return {
        card: 'bg-gray-800 border-gray-600 text-white shadow-lg',
        statsBar: 'bg-gray-700/70 text-gray-100',
        actionButton: {
          like: 'bg-gray-700 text-green-400 hover:bg-green-800/50 border-green-600',
          comment: 'bg-gray-700 text-blue-400 hover:bg-blue-800/50 border-blue-600',
          delete: 'bg-gray-700 text-red-400 hover:bg-red-800/50 border-red-600'
        }
      };
    } else {
      return {
        card: 'bg-white border-gray-200 text-gray-900 shadow-md',
        statsBar: 'bg-gray-50 text-gray-700',
        actionButton: {
          like: 'bg-white text-green-600 hover:bg-green-50 border-green-200',
          comment: 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200',
          delete: 'bg-white text-red-600 hover:bg-red-50 border-red-200'
        }
      };
    }
});

const contentCharCount = computed(() => newNotification.value.content.length);

// --- UI CLASSES ---
const ui = computed(() => {
  const baseBorder = isDarkMode.value ? 'border-gray-600' : 'border-gray-300';
  const baseTextMuted = isDarkMode.value ? 'text-gray-300' : 'text-gray-600';
  const formInput = isDarkMode.value ? `bg-gray-800 border-gray-600 text-white` : `bg-white ${baseBorder}`;
  
  return {
    container: isDarkMode.value ? 'bg-black text-white' : 'bg-white text-black',
    contentBg: isDarkMode.value ? 'bg-black' : 'bg-white',
    headerBg: isDarkMode.value ? 'bg-gray-800' : 'bg-gray-300',
    profileBorder: isDarkMode.value ? 'border-white' : 'border-black',
    textPrimary: isDarkMode.value ? 'text-white' : 'text-black',
    textMuted: baseTextMuted,
    textMutedLight: isDarkMode.value ? 'text-gray-400' : 'text-gray-500',
    statBubble: isDarkMode.value ? 'border-gray-500 text-gray-200' : 'border-gray-400',
    editButton: isDarkMode.value ? 'border-gray-500 text-gray-200 hover:bg-gray-800' : 'border-gray-400 text-gray-700',
    border: baseBorder,
    formInput: formInput,
    formContainer: isDarkMode.value ? `border-gray-600 bg-gray-900` : `${baseBorder} bg-gray-50`,
    editFormContainer: isDarkMode.value ? 'border-yellow-600 bg-gray-900' : 'border-yellow-400 bg-yellow-50',
    status: {
      success: isDarkMode.value ? 'bg-green-900/70 text-green-200 border border-green-700' : 'bg-green-100 text-green-800',
      error: isDarkMode.value ? 'bg-red-900/70 text-red-200 border border-red-700' : 'bg-red-100 text-red-800',
    },
    loginWarning: isDarkMode.value ? 'border-red-600 bg-red-900/50 text-red-200' : 'border-red-400 bg-red-100 text-red-800',
    noAccessWarning: isDarkMode.value ? 'border-yellow-600 bg-yellow-900/50 text-yellow-200' : 'border-yellow-400 bg-yellow-100 text-yellow-800',
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
  if (isDarkMode.value) {
    // Tema oscuro
    const styles = {
      info: {
        bg: 'bg-green-900/30 border border-green-700',
        icon: 'bg-green-600',
      },
      warning: {
        bg: 'bg-yellow-900/30 border border-yellow-700',
        icon: 'bg-yellow-600',
      },
      alert: {
        bg: 'bg-red-900/30 border border-red-700',
        icon: 'bg-red-600',
      },
      default: {
        bg: 'bg-gray-800/70 border border-gray-600',
        icon: 'bg-gray-600',
      }
    };
    return styles[type as keyof typeof styles] || styles.default;
  } else {
    // Tema claro
    const styles = {
      info: {
        bg: 'bg-green-50 border border-green-200',
        icon: 'bg-green-500',
      },
      warning: {
        bg: 'bg-yellow-50 border border-yellow-200',
        icon: 'bg-yellow-500',
      },
      alert: {
        bg: 'bg-red-50 border border-red-200',
        icon: 'bg-red-500',
      },
      default: {
        bg: 'bg-gray-100 border border-gray-300',
        icon: 'bg-gray-500',
      }
    };
    return styles[type as keyof typeof styles] || styles.default;
  }
};

const toastStyles = (type: ToastNotification['type']) => {
  const baseClasses = 'backdrop-blur-md border shadow-2xl';
  const styles = {
    info: {
      bg: isDarkMode.value 
        ? `${baseClasses} bg-blue-900/90 border-blue-700 text-blue-100` 
        : `${baseClasses} bg-blue-50/95 border-blue-200 text-blue-900`,
      icon: 'text-blue-500',
      iconBg: isDarkMode.value ? 'bg-blue-800' : 'bg-blue-100',
    },
    success: {
      bg: isDarkMode.value 
        ? `${baseClasses} bg-green-900/90 border-green-700 text-green-100` 
        : `${baseClasses} bg-green-50/95 border-green-200 text-green-900`,
      icon: 'text-green-500',
      iconBg: isDarkMode.value ? 'bg-green-800' : 'bg-green-100',
    },
    warning: {
      bg: isDarkMode.value 
        ? `${baseClasses} bg-yellow-900/90 border-yellow-700 text-yellow-100` 
        : `${baseClasses} bg-yellow-50/95 border-yellow-200 text-yellow-900`,
      icon: 'text-yellow-500',
      iconBg: isDarkMode.value ? 'bg-yellow-800' : 'bg-yellow-100',
    },
    alert: {
      bg: isDarkMode.value 
        ? `${baseClasses} bg-red-900/90 border-red-700 text-red-100` 
        : `${baseClasses} bg-red-50/95 border-red-200 text-red-900`,
      icon: 'text-red-500',
      iconBg: isDarkMode.value ? 'bg-red-800' : 'bg-red-100',
    },
    error: {
      bg: isDarkMode.value 
        ? `${baseClasses} bg-red-900/90 border-red-700 text-red-100` 
        : `${baseClasses} bg-red-50/95 border-red-200 text-red-900`,
      icon: 'text-red-500',
      iconBg: isDarkMode.value ? 'bg-red-800' : 'bg-red-100',
    }
  };
  return styles[type] || styles.info;
};

// --- HELPERS ---
function showStatus(text: string, success: boolean, duration: number = 3000) {
  statusMessage.value = { text, success };
  setTimeout(() => statusMessage.value = null, duration);
}

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

// --- TOAST NOTIFICATIONS ---
function showToastNotification(title: string, content: string, type: ToastNotification['type'] = 'info', duration: number = 6000) {
  const toast: ToastNotification = {
    id: Date.now().toString() + Math.random(),
    title,
    content,
    type,
    timestamp: new Date(),
    isVisible: false,
    isLeaving: false,
  };

  toastNotifications.value.unshift(toast);
  
  setTimeout(() => {
    toast.isVisible = true;
  }, 100);

  setTimeout(() => {
    removeToast(toast.id);
  }, duration);
}

function removeToast(id: string) {
  const toast = toastNotifications.value.find(t => t.id === id);
  if (toast) {
    toast.isLeaving = true;
    setTimeout(() => {
      const index = toastNotifications.value.findIndex(t => t.id === id);
      if (index > -1) {
        toastNotifications.value.splice(index, 1);
      }
    }, 300);
  }
}

function getToastIcon(type: ToastNotification['type']) {
  const icons = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z',
    alert: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return icons[type] || icons.info;
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
  localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(persisted.slice(0, 50)));
}

async function fetchNotifications() {
  if (!currentUser.value?.sub) return;
  isLoading.value = true;
  try {
    const { data } = await apiFetch(`/notifications?userId=${currentUser.value.sub}`);
    const fetched: Notification[] = Array.isArray(data) ? data : [];
    const persisted = getPersistentNotifications();
    
    const fetchedIds = new Set(fetched.map(n => n._id));
    const allNotifications = [...fetched, ...persisted.filter(p => !fetchedIds.has(p._id))];
    
    const lastCheck = localStorage.getItem(LS_LAST_NOTIFICATION_CHECK);
    const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(0);
    
    const newNotifications = allNotifications.filter(n => {
      const notificationTime = n.createdAt ? new Date(n.createdAt) : new Date();
      return notificationTime > lastCheckTime && !n.read;
    });

    newNotifications.forEach(notification => {
      showToastNotification(
        notification.title,
        notification.content,
        notification.type as ToastNotification['type'],
        8000
      );
    });

    notifications.value = allNotifications;
    localStorage.setItem(LS_LAST_NOTIFICATION_CHECK, new Date().toISOString());

  } catch (error: any) {
    showStatus(error.message, false);
    notifications.value = getPersistentNotifications();
  } finally {
    isLoading.value = false;
  }
}

async function createNotification() {
  if (!isAdmin.value) {
    showStatus('Solo los administradores pueden crear notificaciones.', false);
    showToastNotification('Acceso denegado', 'Solo los administradores pueden crear notificaciones', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const payload: any = {
      ...newNotification.value,
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      userName: `${currentUser.value.firstName} ${currentUser.value.lastName}`
    };
    
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
    showToastNotification('¡Notificación enviada!', 'La notificación se ha enviado correctamente', 'success');
  } catch (error: any) {
    showStatus(error.message, false);
    showToastNotification('Error', error.message, 'error');
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
    showToastNotification('¡Actualizado!', 'La notificación se ha actualizado', 'success');
    editingNotification.value = null;
  } catch (error: any) {
    showStatus(error.message, false);
    showToastNotification('Error', error.message, 'error');
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

// Polling para nuevas notificaciones cada 30 segundos
let notificationInterval: NodeJS.Timeout | null = null;

function startNotificationPolling() {
  if (notificationInterval) clearInterval(notificationInterval);
  notificationInterval = setInterval(() => {
    if (currentUser.value?.sub) {
      fetchNotifications();
    }
  }, 30000); // 30 segundos
}

function stopNotificationPolling() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}

// --- CICLO DE VIDA ---
onMounted(() => {
  if (initializeUser()) {
    fetchUserData();
    fetchNotifications();
    startNotificationPolling();
  } else {
    showStatus('Debes iniciar sesión para ver tu perfil.', false);
  }
});

// Limpiar interval al desmontar
onUnmounted(() => {
  stopNotificationPolling();
});
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen overflow-hidden" :class="ui.container">
    <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <TransitionGroup name="toast" tag="div">
        <div 
          v-for="toast in toastNotifications" 
          :key="toast.id"
          class="pointer-events-auto max-w-sm w-full rounded-xl p-4 transform transition-all duration-300"
          :class="[
            toastStyles(toast.type).bg,
            toast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
            toast.isLeaving ? 'translate-x-full opacity-0' : ''
          ]"
        >
          <div class="flex items-start">
            <div 
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
              :class="toastStyles(toast.type).iconBg"
            >
              <svg 
                class="w-5 h-5" 
                :class="toastStyles(toast.type).icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToastIcon(toast.type)" />
              </svg>
            </div>
            <div class="flex-grow">
              <h4 class="text-sm font-semibold mb-1">{{ toast.title }}</h4>
              <p class="text-xs opacity-90 leading-relaxed">{{ toast.content }}</p>
              <p class="text-xs opacity-70 mt-2">{{ toast.timestamp.toLocaleTimeString() }}</p>
            </div>
            <button 
              @click="removeToast(toast.id)"
              class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

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
          <button v-if="!editingAbout" @click="editingAbout = true" class="mt-2 md:mt-3 px-4 md:px-5 py-1 border rounded-full text-xs transition-colors" :class="ui.editButton">
            Editar "About me"
          </button>
          <form v-if="editingAbout" @submit.prevent="saveAboutMe" class="flex flex-col w-full gap-2 mt-2">
            <textarea v-model="aboutMeDraft" class="w-full rounded px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-green-500" :class="ui.formInput" rows="3" maxlength="500"></textarea>
            <div class="flex gap-2">
              <button type="button" @click="cancelEditAbout" class="px-4 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs transition-colors" :disabled="savingAboutMe">
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
          <div v-if="ownPosts.length === 0" class="text-center py-12 mt-8 mx-4">
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
              <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No hay posts disponibles</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Comparte tu primer post para conectar con la comunidad SENA</p>
            </div>
          </div>

          <div class="space-y-6 p-4">
            <div v-for="post in ownPosts" :key="post._id" class="group">
              <!-- Card Container con mejor contraste -->
              <div :class="[postCardStyles.card, 'rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border-2']">
                
                <!-- Header del post -->
                <div class="p-6 pb-4">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-green-200 dark:ring-green-800">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 :class="['font-bold text-sm', isDarkMode ? 'text-white' : 'text-gray-900']">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h3>
                        <p :class="['text-xs font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-600']">Aprendiz SENA</p>
                      </div>
                    </div>
                    
                    <!-- Badge del club -->
                    <div v-if="post.club" class="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-800/40 dark:to-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-600 shadow-sm">
                      <span class="text-xs font-bold text-green-700 dark:text-green-200">{{ post.club }}</span>
                    </div>
                  </div>

                  <!-- Título del post -->
                  <h2 :class="['text-xl font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">
                    {{ post.title }}
                  </h2>

                  <!-- Contenido del post -->
                  <div class="prose prose-sm max-w-none" :class="isDarkMode ? 'text-gray-100' : 'text-gray-700'">
                    <p class="leading-relaxed font-medium">{{ post.content }}</p>
                  </div>
                </div>

                <!-- Estadísticas y acciones -->
                <div class="px-6 pb-6">
                  <!-- Stats bar con mejor contraste -->
                  <div :class="['flex items-center justify-between py-3 px-4 rounded-xl mb-4 border', postCardStyles.statsBar, isDarkMode ? 'border-gray-600' : 'border-gray-200']">
                    <div class="flex items-center space-x-6 text-sm">
                      <div :class="['flex items-center space-x-2 font-semibold', isDarkMode ? 'text-gray-100' : 'text-gray-700']">
                        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.822-4.255-3.902-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"/>
                        </svg>
                        <span>{{ post.likesCount || 0 }}</span>
                        <span class="hidden sm:inline">Me gusta</span>
                      </div>
                      
                      <div :class="['flex items-center space-x-2 font-semibold', isDarkMode ? 'text-gray-100' : 'text-gray-700']">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{{ post.commentsCount || 0 }}</span>
                        <span class="hidden sm:inline">Comentarios</span>
                      </div>
                    </div>
                    
                    <!-- Timestamp -->
                    <div :class="['text-xs font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-500']">
                      Hace 2 horas
                    </div>
                  </div>

                  <!-- Action buttons con mejor contraste -->
                  <div class="flex items-center justify-between">
                    <div class="flex space-x-3">
                      <!-- Like button -->
                      <button :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 border-2 hover:scale-105 hover:shadow-md', postCardStyles.actionButton.like]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <!-- Comments button -->
                      <button :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 border-2 hover:scale-105 hover:shadow-md', postCardStyles.actionButton.comment]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>

                    <!-- Delete button -->
                    <button :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 border-2 group/delete hover:scale-105 hover:shadow-md', postCardStyles.actionButton.delete]">
                      <svg class="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-if="$route.path === '/Profile/notifications'">
          <div v-if="!currentUser" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="ui.loginWarning">
            Debes iniciar sesión para acceder a las notificaciones
          </div>
          <template v-else>
            <!-- Mensaje para usuarios no admin -->
            <div v-if="!isAdmin" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="ui.noAccessWarning">
              <div class="flex items-center justify-center mb-2">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span class="font-semibold">Acceso restringido</span>
              </div>
              <p class="text-sm">Solo los administradores pueden crear notificaciones. Puedes ver las notificaciones existentes a continuación.</p>
            </div>

            <!-- Formulario para crear notificaciones (solo admins) -->
            <div v-if="isAdmin" class="mx-4 my-4 p-4 border-2 rounded-lg transition-colors duration-300" :class="[ui.formContainer, isEditing ? '' : formDynamicStyles.border]">
              <h3 class="text-sm font-medium mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear nueva notificación
              </h3>
              <div class="text-xs mb-3" :class="ui.textMuted">
                Usuario: {{ currentUser.firstName }} {{ currentUser.lastName }} ({{ currentUser.email }})
              </div>
              <form @submit.prevent="createNotification">
                <input v-model="newNotification.title" type="text" placeholder="Título de la notificación" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 mb-3 transition-colors" :class="ui.formInput" required />
                
                <div>
                  <textarea v-model="newNotification.content" placeholder="Contenido de la notificación" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 transition-colors" :class="ui.formInput" rows="4" required maxlength="500"></textarea>
                  <p class="text-right text-xs mt-1" :class="ui.textMutedLight">{{ contentCharCount }} / 500</p>
                </div>

                <div class="grid grid-cols-3 gap-2 my-4">
                  <button
                    v-for="type in notificationTypes"
                    :key="type.value"
                    type="button"
                    @click="newNotification.type = type.value"
                    :class="getNotificationTypeButtonClass(type)"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" />
                    </svg>
                    <span>{{ type.label }}</span>
                  </button>
                </div>

                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    class="text-white rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 flex items-center hover:shadow-lg" 
                    :class="[formDynamicStyles.buttonBg, formDynamicStyles.buttonText]"
                    :disabled="isLoading"
                  >
                    <svg v-if="!isLoading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span v-if="!isLoading">Enviar notificación</span>
                    <span v-else>Enviando...</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Formulario de edición -->
            <div v-if="isEditing && editingNotification" class="mx-4 my-4 p-4 border-2 rounded-lg" :class="ui.editFormContainer">
              <h3 class="text-sm font-medium mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar notificación
              </h3>
              <form @submit.prevent="saveEdit">
                <input v-model="editingNotification.title" type="text" placeholder="Título" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 mb-3 transition-colors" :class="ui.formInput" required />
                <textarea v-model="editingNotification.content" placeholder="Contenido" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-green-500 h-20 mb-3 transition-colors" :class="ui.formInput" required></textarea>
                <select v-model="editingNotification.type" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-green-500 mb-3 transition-colors" :class="ui.formInput" required>
                   <option value="info">Información</option>
                  <option value="warning">Advertencia</option>
                  <option value="alert">Alerta</option>
                </select>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="cancelEdit" class="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-1 text-sm transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" class="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-4 py-1 text-sm transition-colors" :disabled="isLoading">
                    {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Mensaje de estado -->
            <div v-if="statusMessage" class="mx-4 mb-3 p-3 rounded-lg text-center text-sm font-medium" :class="statusMessage.success ? ui.status.success : ui.status.error">
              {{ statusMessage.text }}
            </div>
            
            <!-- Loading -->
            <div v-if="isLoading" class="text-center my-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <!-- Lista de notificaciones -->
            <div v-if="validNotifications.length === 0 && !isLoading" class="text-center py-8 mt-4 rounded-lg mx-4 border-2" :class="[ui.container, ui.border]">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V7H7V6h8v11z" />
              </svg>
              <p class="font-medium">No hay notificaciones disponibles</p>
            </div>
            
            <div v-for="(notification, index) in validNotifications" :key="notification._id || index" class="mx-4 mb-4 mt-4">
              <div class="p-4 rounded-lg border-2" :class="notificationStyles(notification.type).bg">
                <div class="flex">
                  <div class="mr-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="notificationStyles(notification.type).icon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow">
                    <h3 :class="['text-sm font-bold mb-2', isDarkMode ? 'text-white' : 'text-gray-900']">{{ notification.title }}</h3>
                    <p :class="['text-sm mb-3 leading-relaxed', isDarkMode ? 'text-gray-200' : 'text-gray-700']">{{ notification.content }}</p>
                    <div class="flex justify-between items-center mt-3">
                      <span :class="['text-xs font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                        {{ notification.timestamp || 'Hace un momento' }}
                        <span v-if="notification.userName" class="ml-2 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">{{ notification.userName }}</span>
                      </span>
                      <div class="flex space-x-3 items-center">
                        <button v-if="!notification.read" @click="markAsRead(notification._id!, index)" :class="['text-xs hover:underline font-medium transition-colors', isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800']">
                          Marcar como leída
                        </button>
                        <span v-else class="text-xs text-green-500 font-semibold bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">✓ Leída</span>
                        <button v-if="isAdmin" @click="startEdit(notification)" :class="['text-xs hover:underline font-medium transition-colors', isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-800']">
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

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>