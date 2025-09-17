<template>
  <div :class="wrapperCls">
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 backdrop-blur-sm bg-black/50" @click="closeModal"></div>
      <form @submit.prevent="submitPost" class="relative z-10 w-full max-w-md p-6 rounded-2xl shadow-xl border" :class="panelCls">
        <button type="button" @click="closeModal" class="absolute top-4 right-4 text-xl">×</button>
        <h3 class="text-xl mb-4 font-semibold text-emerald-500">Crear nuevo post</h3>

        <div v-if="!selectedClub" class="mb-3">
          <label class="block text-sm mb-2" :class="muted">Selecciona un club</label>
          <select v-model="selectedFormClub" required class="w-full p-3 rounded-xl border" :class="inputCls">
            <option disabled value="">-- Selecciona un club --</option>
            <option v-for="id in userClubs" :key="id" :value="id">{{ clubName(id) }}</option>
          </select>
        </div>

        <p v-else class="text-sm mb-3" :class="muted">Este post se asociará al club: <strong class="text-emerald-500">{{ clubName(selectedClub) }}</strong></p>

        <input v-model="newPost.title" required placeholder="Título del post" class="w-full p-3 rounded-xl border mb-3" :class="inputCls" />
        <textarea v-model="newPost.content" rows="4" required placeholder="Escribe el contenido..." class="w-full p-3 rounded-xl border mb-4 resize-none" :class="inputCls"></textarea>
        <button class="w-full px-4 py-3 rounded-xl text-white font-semibold" :class="['bg-emerald-500 hover:bg-emerald-600']">Crear Post</button>
      </form>
    </div>

    <!-- Left sidebar -->
    <Sidebarizquierda class="w-56 flex-shrink-0 h-full border-r" :class="sidebarCls" />

    <!-- Main -->
    <main class="flex-1 flex flex-col p-8 overflow-y-auto h-full" :class="mainCls">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-emerald-500 mb-1">Posts</h2>
          <p class="text-sm" :class="muted">Comparte y descubre contenido de la comunidad</p>
        </div>
        <button @click="showModal = true" class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" :class="['bg-emerald-500 hover:bg-emerald-600']">+</button>
      </header>

      <!-- Club filters (club names always green) -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button v-for="id in userClubs" :key="id" @click="filterByClub(id)" class="px-4 py-2 rounded-xl border" :class="chipCls(id)">
            <span class="text-emerald-500">{{ clubName(id) }}</span>
          </button>
          <button @click="filterByClub('')" class="px-4 py-2 rounded-xl border" :class="selectedClub === '' ? selectedChipCls : defaultChipCls">Todos</button>
        </div>
      </div>

      <!-- Posts list -->
      <div v-if="filteredPosts.length" class="space-y-6">
        <article v-for="post in filteredPosts" :key="post._id" class="p-6 rounded-2xl border relative" :class="postCls">
          <header class="mb-4">
            <h3 class="text-xl font-semibold text-emerald-500 cursor-pointer mb-2" @click="toggleExpand(post._id)">{{ post.title }}</h3>
            <p class="text-xs mb-2" :class="muted">Publicado por <strong class="text-emerald-500">{{ authorDisplay(post) }}</strong></p>
            <p class="leading-relaxed" :class="textCls">{{ post.content }}</p>
          </header>

          <div class="flex items-center justify-between text-sm mb-4" :class="muted">
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 rounded-full text-xs font-medium" :class="['bg-emerald-100 text-emerald-700']">{{ clubName(post.club) }}</span>
              <span class="flex items-center space-x-1"><span>{{ post.likesCount || 0 }}</span><span>👍</span></span>
            </div>
          </div>

          <div class="flex space-x-3 mb-4">
            <button @click="onToggleLike(post._id)" class="px-4 py-2 rounded-xl border font-medium text-sm" :class="likeCls(post._id)">{{ isLiked(post._id) ? 'Unlike' : 'Like' }}</button>
            <button @click="toggleExpand(post._id)" class="px-4 py-2 rounded-xl border font-medium text-sm" :class="['bg-green-100 border-green-300 text-green-800']">{{ isExpanded(post._id) ? 'Ocultar comentarios' : 'Ver comentarios' }}</button>
          </div>

          <div v-if="isExpanded(post._id)" class="border-t pt-4" :class="borderCls">
            <div v-if="commentsMap[post._id]?.length" class="space-y-3 mb-6">
              <div v-for="c in commentsMap[post._id]" :key="c._id" class="p-4 rounded-xl relative border" :class="commentCls">
                <button @click="onDeleteComment(post._id, c._id)" class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center">🗑</button>
                <p class="pr-10 mb-2" :class="textCls">{{ c.content }}</p>
                <p class="text-xs font-medium" :class="muted">— {{ c.username }}</p>
              </div>
            </div>
            <p v-else class="text-center py-8" :class="muted">No hay comentarios aún. ¡Sé el primero en comentar!</p>

            <form @submit.prevent="onSubmitComment(post._id)" class="flex items-center space-x-3">
              <input v-model="newCommentMap[post._id]" type="text" maxlength="100" placeholder="Escribe un comentario..." class="flex-1 p-3 rounded-xl border" :class="inputCls" required />
              <button type="submit" class="px-6 py-3 rounded-xl text-white font-medium" :class="['bg-emerald-500 hover:bg-emerald-600']">Enviar</button>
            </form>
          </div>

          <button v-if="canDeletePost(post)" @click="onDeletePost(post._id, post)" class="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center">×</button>
        </article>
      </div>

      <div v-else class="text-center py-16">
        <p class="text-lg" :class="muted">No hay posts disponibles</p>
        <p class="text-sm mt-2" :class="muted">¡Crea el primer post de la comunidad!</p>
      </div>
    </main>

    <!-- Right sidebar -->
    <aside class="w-80 flex-shrink-0 border-l h-full" :class="sidebarCls"><News /></aside>

    <button @click="logout" class="fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-lg text-white" :class="['bg-red-500 hover:bg-red-600']">Cerrar sesión</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebarizquierda from '@/components/molecules/Sidebarizquierda.vue'
import News from '@/components/molecules/News.vue'
import { useClubsStore } from '@/stores/clubsStore'
import { usePostsStore } from '@/stores/postsStore'
import { useThemeStore } from '@/stores/theme'
import { getUserFromToken } from '@/composables/useAuth'

const router = useRouter()
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

const payload = getUserFromToken()
if (!payload) router.replace({ name: 'SignUp' })
const username = computed(() => payload ? `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim() : '')
const userRole = payload?.rol ?? ''
const userClubs = (payload?.clubs ?? []).map(String)
const userId = String(payload?.sub ?? payload?._id ?? '')

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const clubsStore = useClubsStore()
const postsStore = usePostsStore()

const clubMap = computed(() => Object.fromEntries((clubsStore.clubs ?? []).map((c: any) => [String(c._id ?? c.id ?? ''), c.name ?? ''])))
const clubName = (c: any) => { if (!c) return ''; if (typeof c === 'object') return String(c.name ?? c._id ?? ''); return clubMap.value[String(c)] ?? String(c) }

const showModal = ref(false)
const selectedClub = ref<string>('')
const selectedFormClub = ref<string>('')
const newPost = reactive({ title: '', content: '' })

const filteredPosts = computed(() => {
  const all = postsStore.posts ?? []
  const clubs = selectedClub.value ? [String(selectedClub.value)] : userClubs
  return all.filter(p => clubs.includes(String(p.club ?? p.club?._id ?? p.club?._id ?? '')))
})

const expandedPostId = ref<string | null>(null)
const commentsMap = reactive<Record<string, any[]>>({})
const newCommentMap = reactive<Record<string, string>>({})
const likedPosts = ref(new Set((postsStore.likedByUser ?? []).map(String)))

watch(() => postsStore.likedByUser, v => likedPosts.value = new Set((v ?? []).map(String)))
watch(showModal, open => document.body.classList.toggle('modal-open', open))

onMounted(async () => { await clubsStore.fetchClubs(); await postsStore.fetchPosts() })

const isLiked = (id: string) => likedPosts.value.has(id)
const isExpanded = (id: string) => expandedPostId.value === id

const getPostAuthorId = (post: any) => post?.author ? (typeof post.author === 'object' ? String(post.author._id ?? post.author.id ?? '') : String(post.author)) : String(post?.authorId ?? post?.userId ?? '')
const authorDisplay = (post: any) => {
  const a = post?.author
  if (a && typeof a === 'object') return (a.name ?? `${a.firstName ?? ''} ${a.lastName ?? ''}`).trim() || a.username || a.email || a._id
  return post?.authorName ?? (post?.author ? `Usuario ${String(post.author)}` : '')
}
const canDeletePost = (post: any) => userRole === 'admin' || getPostAuthorId(post) === userId

function filterByClub(c = '') { selectedClub.value = c }
function closeModal() { showModal.value = false; newPost.title = ''; newPost.content = ''; selectedFormClub.value = '' }

async function submitPost() {
  const clubToSend = selectedClub.value || selectedFormClub.value
  if (!clubToSend) return alert('Debes seleccionar un club.')
  try { await postsStore.addPost({ title: newPost.title, content: newPost.content, club: clubToSend }); await postsStore.fetchPosts(); closeModal() }
  catch (e: any) { console.error(e); alert(e?.response?.data?.message ?? 'Error al crear el post.') }
}

async function onDeletePost(id: string, post?: any) {
  if (post && !canDeletePost(post)) return alert('No tienes permiso para eliminar este post.')
  if (!confirm('¿Eliminar este post?')) return
  try { await postsStore.removePost(id); await postsStore.fetchPosts() }
  catch (e: any) { console.error(e); alert(e?.response?.data?.message ?? 'Error eliminando post') }
}

async function toggleExpand(postId: string) {
  if (expandedPostId.value === postId) { expandedPostId.value = null; return }
  expandedPostId.value = postId
  const comments = await postsStore.fetchComments(postId)
  commentsMap[postId] = (comments || []).map((c: any) => ({ _id: c._id, content: c.content, username: c.username }))
  newCommentMap[postId] = ''
}

async function onToggleLike(postId: string) {
  if (likedPosts.value.has(postId)) { await postsStore.removeLike(postId); likedPosts.value = new Set([...likedPosts.value].filter(id => id !== postId)) }
  else { await postsStore.addLike(postId); likedPosts.value = new Set([...likedPosts.value, postId]) }
}

async function onSubmitComment(postId: string) {
  const text = (newCommentMap[postId] ?? '').trim()
  if (!text) return
  await postsStore.addComment(postId, text.slice(0, 100))
  const comments = await postsStore.fetchComments(postId)
  commentsMap[postId] = (comments || []).map((c: any) => ({ _id: c._id, content: c.content, username: c.username }))
  newCommentMap[postId] = ''
}

async function onDeleteComment(postId: string, commentId: string) {
  if (!confirm('¿Eliminar este comentario?')) return
  try { await postsStore.removeComment(postId, commentId); const comments = await postsStore.fetchComments(postId); commentsMap[postId] = (comments || []).map((c: any) => ({ _id: c._id, content: c.content, username: c.username })) }
  catch (e: any) { console.error(e); alert('No tienes permiso para eliminar este comentario.') }
}

function logout() { localStorage.removeItem('token'); delete axios.defaults.headers.common['Authorization']; router.push({ name: 'SignUp' }) }

// --- UI helpers (compact classes) ---
const wrapperCls = computed(() => `${isDarkMode.value ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} h-screen w-screen overflow-hidden flex`)
const panelCls = computed(() => isDarkMode.value ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900')
const sidebarCls = computed(() => isDarkMode.value ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100')
const mainCls = computed(() => isDarkMode.value ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100')
const muted = computed(() => isDarkMode.value ? 'text-gray-400' : 'text-gray-600')
const inputCls = computed(() => isDarkMode.value ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500')
const postCls = computed(() => isDarkMode.value ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300')
const textCls = computed(() => isDarkMode.value ? 'text-gray-300' : 'text-gray-700')
const borderCls = computed(() => isDarkMode.value ? 'border-gray-800' : 'border-gray-200')
const commentCls = computed(() => isDarkMode.value ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
const selectedChipCls = 'bg-emerald-100 border-emerald-300 text-emerald-700'
const defaultChipCls = computed(() => isDarkMode.value ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700')
const chipCls = (id: string) => selectedClub.value === id ? selectedChipCls : defaultChipCls.value
const likeCls = (id: string) => isLiked(id) ? (isDarkMode.value ? 'bg-green-900/50 border-green-800 text-green-400' : 'bg-green-100 border-green-300 text-green-800') : (isDarkMode.value ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700')
</script>

<style scoped>
.modal-open{ overflow:hidden }
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }
*{ transition: color .15s, background-color .15s, border-color .15s }
</style>
