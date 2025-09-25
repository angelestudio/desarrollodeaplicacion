<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import News from './News.vue'
import Sidebarizquierda from './Sidebarizquierda.vue'
import { useThemeStore } from '@/stores/theme'
import jwtDecode from 'jwt-decode'

interface Post { _id?: string; title?: string; content: string; user?: string; club?: string; likesCount?: number; commentsCount?: number; saved?: boolean; createdAt?: string }
interface Notification { _id?: string; title: string; content: string; type: 'info' | 'warning' | 'alert' | string; timestamp?: string; read?: boolean; userId?: string; userName?: string; createdAt?: string }
interface Toast { id: string; title: string; content: string; type: 'info' | 'warning' | 'alert' | 'success' | 'error'; timestamp: Date; isVisible: boolean; isLeaving: boolean }
interface Status { text: string; success: boolean }

const theme = useThemeStore()
const route = useRoute()
const isDark = computed(() => theme.theme === 'dark')
const user = ref<any>(null)
const posts = ref<Post[]>([])
const about = ref('')
const notifs = ref<Notification[]>([])
const toasts = ref<Toast[]>([])
const postCount = computed(() => posts.value.filter(p => p.user === user.value?.sub).length)
const savedCount = computed(() => posts.value.filter(p => p.saved).length)
const ownPosts = computed(() => posts.value.filter(p => p.user === user.value?.sub))
const validNotifs = computed(() => notifs.value.filter(n => n?.title?.trim() || n?.content?.trim()))
const editAbout = ref(false)
const aboutDraft = ref('')
const newNotif = ref<Omit<Notification, '_id'>>({ title: '', content: '', type: 'info' })
const editNotif = ref<Notification | null>(null)
const isEditing = computed(() => !!editNotif.value)
const loading = ref(false)
const saving = ref(false)
const status = ref<Status | null>(null)
const LS_NOTIFS = 'persistent_notifications'
const LS_CHECK = 'last_notification_check'
const isAdmin = computed(() => user.value?.rol?.toLowerCase() === 'admin')
const showCommentInput = ref<Record<string, boolean>>({})
const newComment = ref<Record<string, string>>({})

const notifTypes = ref([
  { value: 'info', label: 'Información', color: 'green', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'warning', label: 'Advertencia', color: 'yellow', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z' },
  { value: 'alert', label: 'Alerta', color: 'red', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' }
])

const selNotifType = computed(() => notifTypes.value.find(t => t.value === newNotif.value.type) || notifTypes.value[0])
const formStyles = computed(() => {
  const { color } = selNotifType.value
  const dark = isDark.value
  const colors = { green: { border: dark ? 'border-green-700' : 'border-green-500', btnBg: 'bg-green-600 hover:bg-green-700', btnText: 'text-white' }, yellow: { border: dark ? 'border-yellow-700' : 'border-yellow-500', btnBg: 'bg-yellow-600 hover:bg-yellow-700', btnText: 'text-white' }, red: { border: dark ? 'border-red-700' : 'border-red-500', btnBg: 'bg-red-600 hover:bg-red-700', btnText: 'text-white' } }
  return colors[color as keyof typeof colors] || colors.green
})

const notifBtnClass = computed(() => (type: any) => {
  const base = 'p-2 rounded-lg text-xs flex items-center justify-center transition-all duration-200 border'
  const selected = newNotif.value.type === type.value
  const dark = isDark.value
  if (selected) {
    const colors = { green: dark ? 'bg-green-600 border-green-600 text-white' : 'bg-green-500 border-green-500 text-white', yellow: dark ? 'bg-yellow-600 border-yellow-600 text-white' : 'bg-yellow-500 border-yellow-500 text-white', red: dark ? 'bg-red-600 border-red-600 text-white' : 'bg-red-500 border-red-500 text-white' }
    return `${base} ${colors[type.color as keyof typeof colors]} shadow-lg scale-105`
  }
  return `${base} ${dark ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`
})

const postStyles = computed(() => ({ card: isDark.value ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-white shadow-xl hover:shadow-2xl' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-gray-900 shadow-md hover:shadow-lg', statsBar: isDark.value ? 'bg-gray-800/70 text-gray-100 border-gray-600' : 'bg-gray-100/70 text-gray-700 border-gray-200', actionButton: { like: isDark.value ? 'bg-gray-800 text-green-400 hover:bg-green-900/50 border-green-700 hover:border-green-500' : 'bg-white text-green-600 hover:bg-green-50 border-green-200 hover:border-green-400', comment: isDark.value ? 'bg-gray-800 text-blue-400 hover:bg-blue-900/50 border-blue-700 hover:border-blue-500' : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200 hover:border-blue-400', delete: isDark.value ? 'bg-gray-800 text-red-400 hover:bg-red-900/50 border-red-700 hover:border-red-500' : 'bg-white text-red-600 hover:bg-red-50 border-red-200 hover:border-red-400' } }))

const charCount = computed(() => newNotif.value.content.length)
const ui = computed(() => {
  const dark = isDark.value
  const border = dark ? 'border-gray-600' : 'border-gray-300'
  const muted = dark ? 'text-gray-300' : 'text-gray-600'
  const input = dark ? 'bg-gray-800 border-gray-600 text-white' : `bg-white ${border}`
  return { container: dark ? 'bg-black text-white' : 'bg-white text-black', contentBg: dark ? 'bg-black' : 'bg-white', headerBg: dark ? 'bg-gray-800' : 'bg-gray-300', profileBorder: dark ? 'border-white' : 'border-black', textPrimary: dark ? 'text-white' : 'text-black', textMuted: muted, textMutedLight: dark ? 'text-gray-400' : 'text-gray-500', statBubble: dark ? 'border-gray-500 text-gray-200' : 'border-gray-400', editButton: dark ? 'border-gray-500 text-gray-200 hover:bg-gray-800' : 'border-gray-400 text-gray-700', border, formInput: input, formContainer: dark ? 'border-gray-600 bg-gray-900' : `${border} bg-gray-50`, editFormContainer: dark ? 'border-yellow-600 bg-gray-900' : 'border-yellow-400 bg-yellow-50', status: { success: dark ? 'bg-green-900/70 text-green-200 border border-green-700' : 'bg-green-100 text-green-800', error: dark ? 'bg-red-900/70 text-red-200 border border-red-700' : 'bg-red-100 text-red-800' }, loginWarning: dark ? 'border-red-600 bg-red-900/50 text-red-200' : 'border-red-400 bg-red-100 text-red-800', noAccessWarning: dark ? 'border-yellow-600 bg-yellow-900/50 text-yellow-200' : 'border-yellow-400 bg-yellow-100 text-yellow-800' }
})

const tabClasses = (path: string) => {
  const base = 'px-4 md:px-8 py-2 text-xs md:text-sm'
  return route.path === path ? `${base} border-b-2 border-green-500 text-green-500` : `${base} ${ui.value.textMuted}`
}

const notifStyles = (type: Notification['type']) => {
  const dark = isDark.value
  const styles = { info: { bg: dark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200', icon: dark ? 'bg-green-600' : 'bg-green-500' }, warning: { bg: dark ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200', icon: dark ? 'bg-yellow-600' : 'bg-yellow-500' }, alert: { bg: dark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200', icon: dark ? 'bg-red-600' : 'bg-red-500' }, default: { bg: dark ? 'bg-gray-800/70 border border-gray-600' : 'bg-gray-100 border border-gray-300', icon: dark ? 'bg-gray-600' : 'bg-gray-500' } }
  return styles[type as keyof typeof styles] || styles.default
}

const toastStyles = (type: Toast['type']) => {
  const base = 'backdrop-blur-md border shadow-2xl'
  const dark = isDark.value
  const styles = { info: { bg: dark ? `${base} bg-blue-900/90 border-blue-700 text-blue-100` : `${base} bg-blue-50/95 border-blue-200 text-blue-900`, icon: 'text-blue-500', iconBg: dark ? 'bg-blue-800' : 'bg-blue-100' }, success: { bg: dark ? `${base} bg-green-900/90 border-green-700 text-green-100` : `${base} bg-green-50/95 border-green-200 text-green-900`, icon: 'text-green-500', iconBg: dark ? 'bg-green-800' : 'bg-green-100' }, warning: { bg: dark ? `${base} bg-yellow-900/90 border-yellow-700 text-yellow-100` : `${base} bg-yellow-50/95 border-yellow-200 text-yellow-900`, icon: 'text-yellow-500', iconBg: dark ? 'bg-yellow-800' : 'bg-yellow-100' }, alert: { bg: dark ? `${base} bg-red-900/90 border-red-700 text-red-100` : `${base} bg-red-50/95 border-red-200 text-red-900`, icon: 'text-red-500', iconBg: dark ? 'bg-red-800' : 'bg-red-100' }, error: { bg: dark ? `${base} bg-red-900/90 border-red-700 text-red-100` : `${base} bg-red-50/95 border-red-200 text-red-900`, icon: 'text-red-500', iconBg: dark ? 'bg-red-800' : 'bg-red-100' } }
  return styles[type] || styles.info
}

function showStatus(text: string, success: boolean, duration = 3000) {
  status.value = { text, success }
  setTimeout(() => (status.value = null), duration)
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Usuario no autenticado')
  const res = await fetch(`https://backend-senaclub-xtrt.onrender.com${url}`, { ...options, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers } })
  if (!res.ok) throw new Error((await res.json().catch(() => ({ message: res.statusText }))).message || 'Error en la solicitud a la API')
  return res.json()
}

function showToast(title: string, content: string, type: Toast['type'] = 'info', duration = 6000) {
  const toast: Toast = { id: Date.now().toString() + Math.random(), title, content, type, timestamp: new Date(), isVisible: false, isLeaving: false }
  toasts.value.unshift(toast)
  setTimeout(() => (toast.isVisible = true), 100)
  setTimeout(() => removeToast(toast.id), duration)
}

function removeToast(id: string) {
  const toast = toasts.value.find(t => t.id === id)
  if (toast) { toast.isLeaving = true; setTimeout(() => toasts.value.splice(toasts.value.findIndex(t => t.id === id), 1), 300) }
}

function getToastIcon(type: Toast['type']) {
  const icons = { info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z', alert: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
  return icons[type] || icons.info
}

function initUser() {
  const token = localStorage.getItem('token')
  if (token) { try { user.value = jwtDecode(token); return true } catch { user.value = null } }
  return false
}

async function fetchUserData() {
  if (!user.value?.sub) return
  try {
    const [postsData, userData] = await Promise.all([apiFetch(`/posts?userId=${user.value.sub}`), apiFetch(`/usuarios/${user.value.sub}`)])
    posts.value = Array.isArray(postsData?.data) ? postsData.data : Array.isArray(postsData) ? postsData : []
    about.value = userData.about || ''
    aboutDraft.value = about.value
  } catch (e: any) { showStatus(e.message || 'Error al cargar datos del perfil.', false); posts.value = []; about.value = '' }
}

async function saveAbout() {
  if (!user.value?.sub) return
  saving.value = true
  try {
    await apiFetch(`/usuarios/${user.value.sub}/about`, { method: 'PATCH', body: JSON.stringify({ about: aboutDraft.value }) })
    about.value = aboutDraft.value
    editAbout.value = false
    showStatus('Información actualizada correctamente.', true)
  } catch (e: any) { showStatus(e.message, false) } finally { saving.value = false }
}

function cancelEditAbout() { editAbout.value = false; aboutDraft.value = about.value }

function getPersistentNotifs(): Notification[] { try { return JSON.parse(localStorage.getItem(LS_NOTIFS) || '[]') } catch { return [] } }

function savePersistentNotif(notif: Notification) {
  if (!notif._id || getPersistentNotifs().some(n => n._id === notif._id)) return
  const persisted = getPersistentNotifs()
  persisted.unshift(notif)
  localStorage.setItem(LS_NOTIFS, JSON.stringify(persisted.slice(0, 50)))
}

async function fetchNotifs() {
  if (!user.value?.sub) return
  loading.value = true
  try {
    const { data } = await apiFetch(`/notifications?userId=${user.value.sub}`)
    const fetched: Notification[] = Array.isArray(data) ? data : []
    const persisted = getPersistentNotifs()
    const fetchedIds = new Set(fetched.map(n => n._id))
    const allNotifs = [...fetched, ...persisted.filter(p => !fetchedIds.has(p._id))]
    const lastCheck = new Date(localStorage.getItem(LS_CHECK) || 0)
    allNotifs.filter(n => (n.createdAt ? new Date(n.createdAt) : new Date()) > lastCheck && !n.read).forEach(n => showToast(n.title, n.content, n.type as Toast['type'], 8000))
    notifs.value = allNotifs
    localStorage.setItem(LS_CHECK, new Date().toISOString())
  } catch (e: any) { showStatus(e.message, false); notifs.value = getPersistentNotifs() } finally { loading.value = false }
}

async function createNotif() {
  if (!isAdmin.value) { showStatus('Solo los administradores pueden crear notificaciones.', false); showToast('Acceso denegado', 'Solo los administradores pueden crear notificaciones', 'error'); return }
  loading.value = true
  try {
    const payload = { ...newNotif.value, timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }), read: false, userName: `${user.value.firstName} ${user.value.lastName}` }
    const result = await apiFetch('/notifications', { method: 'POST', body: JSON.stringify(payload) })
    notifs.value.unshift(result.data)
    if (['info', 'warning'].includes(result.data.type)) savePersistentNotif(result.data)
    newNotif.value = { title: '', content: '', type: 'info' }
    showStatus('Notificación creada correctamente.', true)
    showToast('¡Notificación enviada!', 'La notificación se ha enviado correctamente', 'success')
  } catch (e: any) { showStatus(e.message, false); showToast('Error', e.message, 'error') } finally { loading.value = false }
}

function startEdit(notif: Notification) { editNotif.value = { ...notif } }
function cancelEdit() { editNotif.value = null }

async function saveEdit() {
  if (!editNotif.value?._id) return
  loading.value = true
  try {
    const result = await apiFetch(`/notifications/${editNotif.value._id}`, { method: 'PUT', body: JSON.stringify(editNotif.value) })
    const idx = notifs.value.findIndex(n => n._id === editNotif.value?._id)
    if (idx !== -1) notifs.value[idx] = result.data
    showStatus('Notificación actualizada correctamente.', true)
    showToast('¡Actualizado!', 'La notificación se ha actualizado', 'success')
    editNotif.value = null
  } catch (e: any) { showStatus(e.message, false); showToast('Error', e.message, 'error') } finally { loading.value = false }
}

async function markAsRead(id: string, idx: number) {
  if (!id) return
  try {
    const updated = { ...notifs.value[idx], read: true }
    await apiFetch(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(updated) })
    notifs.value[idx].read = true
    showStatus('Notificación marcada como leída.', true)
  } catch (e: any) { showStatus(e.message, false) }
}

async function deletePost(postId: string) {
  try {
    await apiFetch(`/posts/${postId}`, { method: 'DELETE' })
    posts.value = posts.value.filter(p => p._id !== postId)
    showToast('Post eliminado', 'El post ha sido eliminado correctamente', 'success')
  } catch (e: any) { showToast('Error', e.message, 'error') }
}

async function likePost(postId: string) {
  try {
    await apiFetch(`/posts/${postId}/like`, { method: 'POST' })
    const post = posts.value.find(p => p._id === postId)
    if (post) post.likesCount = (post.likesCount || 0) + 1
    showToast('Me gusta', 'Has dado me gusta al post', 'success')
  } catch (e: any) { showToast('Error', e.message, 'error') }
}

function toggleCommentInput(postId: string) {
  showCommentInput.value[postId] = !showCommentInput.value[postId]
  if (!newComment.value[postId]) newComment.value[postId] = ''
}

async function addComment(postId: string) {
  if (!newComment.value[postId].trim()) return
  try {
    await apiFetch(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content: newComment.value[postId] }) })
    const post = posts.value.find(p => p._id === postId)
    if (post) post.commentsCount = (post.commentsCount || 0) + 1
    newComment.value[postId] = ''
    showCommentInput.value[postId] = false
    showToast('Comentario agregado', 'Tu comentario ha sido agregado', 'success')
  } catch (e: any) { showToast('Error', e.message, 'error') }
}

let interval: NodeJS.Timeout | null = null
function startPolling() { if (interval) clearInterval(interval); interval = setInterval(() => user.value?.sub && fetchNotifs(), 30000) }
function stopPolling() { if (interval) clearInterval(interval); interval = null }

onMounted(() => { if (initUser()) { fetchUserData(); fetchNotifs(); startPolling() } else { showStatus('Debes iniciar sesión para ver tu perfil.', false) } })
onUnmounted(stopPolling)
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen overflow-hidden" :class="ui.container">
    <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <TransitionGroup name="toast" tag="div">
        <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto max-w-sm w-full rounded-xl p-4 transition-all duration-300" :class="[toastStyles(toast.type).bg, toast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0', toast.isLeaving ? 'translate-x-full opacity-0' : '']">
          <div class="flex items-start">
            <div :class="[toastStyles(toast.type).iconBg, 'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3']">
              <svg class="w-5 h-5" :class="toastStyles(toast.type).icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToastIcon(toast.type)" /></svg>
            </div>
            <div class="flex-grow">
              <h4 class="text-sm font-semibold mb-1">{{ toast.title }}</h4>
              <p class="text-xs opacity-90 leading-relaxed">{{ toast.content }}</p>
              <p class="text-xs opacity-70 mt-2">{{ toast.timestamp.toLocaleTimeString() }}</p>
            </div>
            <button @click="removeToast(toast.id)" class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <Sidebarizquierda class="w-full md:w-2/6 lg:w-2/6" />
    <div class="w-full md:w-4/6 lg:w-4/6 flex flex-col relative overflow-y-auto" :class="ui.contentBg">
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden" :class="ui.headerBg">
        <img src="@/assets/bg_buildings_old.png" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="@/assets/images/user.jpg" alt="Usuario" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2" :class="ui.profileBorder" />
        <h1 class="mt-2 font-medium text-base md:text-lg" :class="ui.textPrimary">{{ user?.firstName }} {{ user?.lastName }}</h1>
        <p class="text-xs md:text-sm" :class="ui.textMuted">{{ user?.rol }}</p>
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="ui.statBubble">{{ postCount }} Posts</div>
          <div class="px-2 md:px-3 py-1 bg-transparent border rounded-full text-xs" :class="ui.statBubble">{{ savedCount }} Saved</div>
        </div>
        <div class="w-full flex flex-col items-center mt-2" style="max-width: 300px;">
          <button v-if="!editAbout" @click="editAbout = true" class="mt-2 md:mt-3 px-4 md:px-5 py-1 border rounded-full text-xs transition-colors" :class="ui.editButton">Editar "About me"</button>
          <form v-if="editAbout" @submit.prevent="saveAbout" class="flex flex-col w-full gap-2 mt-2">
            <textarea v-model="aboutDraft" class="w-full rounded px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-green-500" :class="ui.formInput" rows="3" maxlength="500"></textarea>
            <div class="flex gap-2">
              <button type="button" @click="cancelEditAbout" class="px-4 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs transition-colors" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
            </div>
          </form>
          <p v-else class="mt-2 text-xs text-center max-w-xs px-4" :class="ui.textMuted">{{ about || 'Sin información personal.' }}</p>
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
          <div v-if="!ownPosts.length" class="text-center py-12 mt-8 mx-4">
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
              <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No hay posts disponibles</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Comparte tu primer post para conectar con la comunidad SENA</p>
            </div>
          </div>
          <div class="space-y-6 p-4">
            <div v-for="post in ownPosts" :key="post._id" class="group">
              <div :class="[postStyles.card, 'rounded-2xl transition-all duration-300 overflow-hidden']">
                <div class="p-6 pb-4">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-green-200 dark:ring-green-800">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div>
                        <h3 :class="['font-bold text-sm', isDark ? 'text-white' : 'text-gray-900']">{{ user?.firstName }} {{ user?.lastName }}</h3>
                        <p :class="['text-xs font-medium', isDark ? 'text-gray-200' : 'text-gray-600']">Aprendiz SENA</p>
                      </div>
                    </div>
                    <div v-if="post.club" class="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-800/40 dark:to-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-600 shadow-sm">
                      <span class="text-xs font-bold text-green-700 dark:text-green-200">{{ post.club }}</span>
                    </div>
                  </div>
                  <h2 :class="['text-xl font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200', isDark ? 'text-white' : 'text-gray-900']">{{ post.title }}</h2>
                  <div class="prose prose-sm max-w-none" :class="isDark ? 'text-gray-100' : 'text-gray-700'">
                    <p class="leading-relaxed font-medium">{{ post.content }}</p>
                  </div>
                </div>
                <div class="px-6 pb-6">
                  <div :class="['flex items-center justify-between py-3 px-4 rounded-xl mb-4 border', postStyles.statsBar]">
                    <div class="flex items-center space-x-6 text-sm">
                      <div :class="['flex items-center space-x-2 font-semibold', isDark ? 'text-gray-100' : 'text-gray-700']">
                        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.822-4.255-3.902-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"/></svg>
                        <span>{{ post.likesCount || 0 }}</span>
                        <span class="hidden sm:inline">Me gusta</span>
                      </div>
                      <div :class="['flex items-center space-x-2 font-semibold', isDark ? 'text-gray-100' : 'text-gray-700']">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span>{{ post.commentsCount || 0 }}</span>
                        <span class="hidden sm:inline">Comentarios</span>
                      </div>
                    </div>
                    <div :class="['text-xs font-medium', isDark ? 'text-gray-300' : 'text-gray-500']">Hace 2 horas</div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex space-x-3">
                      <button @click="likePost(post._id!)" :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 border-2 hover:scale-105 hover:shadow-md', postStyles.actionButton.like]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                      <button @click="toggleCommentInput(post._id!)" :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 border-2 hover:scale-105 hover:shadow-md', postStyles.actionButton.comment]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </button>
                    </div>
                    <button @click="deletePost(post._id!)" :class="['flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 border-2 group/delete hover:scale-105 hover:shadow-md', postStyles.actionButton.delete]">
                      <svg class="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <transition name="fade">
                    <div v-if="showCommentInput[post._id!]" class="mt-4">
                      <form @submit.prevent="addComment(post._id!)" class="flex flex-col gap-2">
                        <textarea v-model="newComment[post._id!]" placeholder="Escribe tu comentario..." class="w-full rounded px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500" :class="ui.formInput" rows="3"></textarea>
                        <div class="flex justify-end gap-2">
                          <button type="button" @click="toggleCommentInput(post._id!)" class="px-4 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-xs transition-colors">Cancelar</button>
                          <button type="submit" class="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors">Comentar</button>
                        </div>
                      </form>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="$route.path === '/Profile/notifications'">
          <div v-if="!user" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="ui.loginWarning">Debes iniciar sesión para acceder a las notificaciones</div>
          <template v-else>
            <div v-if="!isAdmin" class="mx-4 my-4 p-4 border rounded-lg text-center" :class="ui.noAccessWarning">
              <div class="flex items-center justify-center mb-2">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                <span class="font-semibold">Acceso restringido</span>
              </div>
              <p class="text-sm">Solo los administradores pueden crear notificaciones. Puedes ver las notificaciones existentes a continuación.</p>
            </div>
            <div v-if="isAdmin" class="mx-4 my-4 p-4 border-2 rounded-lg transition-colors duration-300" :class="[ui.formContainer, isEditing ? '' : formStyles.border]">
              <h3 class="text-sm font-medium mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Crear nueva notificación
              </h3>
              <div class="text-xs mb-3" :class="ui.textMuted">Usuario: {{ user.firstName }} {{ user.lastName }} ({{ user.email }})</div>
              <form @submit.prevent="createNotif">
                <input v-model="newNotif.title" type="text" placeholder="Título de la notificación" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 mb-3 transition-colors" :class="ui.formInput" required />
                <div>
                  <textarea v-model="newNotif.content" placeholder="Contenido de la notificación" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 transition-colors" :class="ui.formInput" rows="4" required maxlength="500"></textarea>
                  <p class="text-right text-xs mt-1" :class="ui.textMutedLight">{{ charCount }} / 500</p>
                </div>
                <div class="grid grid-cols-3 gap-2 my-4">
                  <button v-for="type in notifTypes" :key="type.value" type="button" @click="newNotif.type = type.value" :class="notifBtnClass(type)">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" /></svg>
                    <span>{{ type.label }}</span>
                  </button>
                </div>
                <div class="flex justify-end">
                  <button type="submit" class="text-white rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 flex items-center hover:shadow-lg" :class="[formStyles.buttonBg, formStyles.buttonText]" :disabled="loading">
                    <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    <span>{{ loading ? 'Enviando...' : 'Enviar notificación' }}</span>
                  </button>
                </div>
              </form>
            </div>
            <div v-if="isEditing && editNotif" class="mx-4 my-4 p-4 border-2 rounded-lg" :class="ui.editFormContainer">
              <h3 class="text-sm font-medium mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar notificación
              </h3>
              <form @submit.prevent="saveEdit">
                <input v-model="editNotif.title" type="text" placeholder="Título" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-blue-500 mb-3 transition-colors" :class="ui.formInput" required />
                <textarea v-model="editNotif.content" placeholder="Contenido" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-green-500 h-20 mb-3 transition-colors" :class="ui.formInput" required></textarea>
                <select v-model="editNotif.type" class="w-full rounded px-3 py-2 text-sm border-2 focus:outline-none focus:border-green-500 mb-3 transition-colors" :class="ui.formInput" required>
                  <option value="info">Información</option>
                  <option value="warning">Advertencia</option>
                  <option value="alert">Alerta</option>
                </select>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="cancelEdit" class="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-1 text-sm transition-colors">Cancelar</button>
                  <button type="submit" class="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-4 py-1 text-sm transition-colors" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar cambios' }}</button>
                </div>
              </form>
            </div>
            <div v-if="status" class="mx-4 mb-3 p-3 rounded-lg text-center text-sm font-medium" :class="status.success ? ui.status.success : ui.status.error">{{ status.text }}</div>
            <div v-if="loading" class="text-center my-4"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>
            <div v-if="!validNotifs.length && !loading" class="text-center py-8 mt-4 rounded-lg mx-4 border-2" :class="[ui.container, ui.border]">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V7H7V6h8v11z" /></svg>
              <p class="font-medium">No hay notificaciones disponibles</p>
            </div>
            <div v-for="(notif, idx) in validNotifs" :key="notif._id || idx" class="mx-4 mb-4 mt-4">
              <div class="p-4 rounded-lg border-2" :class="notifStyles(notif.type).bg">
                <div class="flex">
                  <div class="mr-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="notifStyles(notif.type).icon">
                      <svg class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                    </div>
                  </div>
                  <div class="flex-grow">
                    <h3 :class="['text-sm font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ notif.title }}</h3>
                    <p :class="['text-sm mb-3 leading-relaxed', isDark ? 'text-gray-200' : 'text-gray-700']">{{ notif.content }}</p>
                    <div class="flex justify-between items-center mt-3">
                      <span :class="['text-xs font-medium', isDark ? 'text-gray-300' : 'text-gray-600']">
                        {{ notif.timestamp || 'Hace un momento' }}
                        <span v-if="notif.userName" class="ml-2 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">{{ notif.userName }}</span>
                      </span>
                      <div class="flex space-x-3 items-center">
                        <button v-if="!notif.read" @click="markAsRead(notif._id!, idx)" :class="['text-xs hover:underline font-medium transition-colors', isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800']">Marcar como leída</button>
                        <span v-else class="text-xs text-green-500 font-semibold bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">✓ Leída</span>
                        <button v-if="isAdmin" @click="startEdit(notif)" :class="['text-xs hover:underline font-medium transition-colors', isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-800']">Editar</button>
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
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 flex flex-col border-l" :class="ui.border"><News /></div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active { transition: all 0.3s ease-out; }
.toast-leave-active { transition: all 0.3s ease-in; }
.toast-enter-from, .toast-leave-to { transform: translateX(100%); opacity: 0; }
.toast-move { transition: transform 0.3s ease; }
</style>