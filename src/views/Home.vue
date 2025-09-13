<template>
  <div
    class="h-screen w-screen overflow-hidden flex"
    :class="isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'"
  >
    <!-- Backdrop y modal de creación de post -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center p-4">
      <div
  class="p-6 rounded-2xl shadow-xl w-full max-w-[480px] relative border"
  :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
>


        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors duration-200"
        >
          ×
        </button>
        <h3 class="text-xl mb-4 font-semibold text-emerald-500">
          Crear nuevo post
        </h3>
        <form @submit.prevent="submitPost" class="space-y-4">
          <div class="space-y-2" v-if="!selectedClub">
            <label class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Selecciona un club
            </label>
            <select v-model="selectedFormClub" required
                    class="w-full p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'">
              <option disabled value="">-- Selecciona un club --</option>
              <option v-for="club in userClubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="space-y-2" v-else>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              Este post se asociará al club: <strong class="text-emerald-500">{{ selectedClub }}</strong>
            </p>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Título</label>
            <input v-model="newPost.title" type="text" required
                   class="w-full p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                   :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500'"
                   placeholder="Título del post" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Contenido</label>
            <textarea
              v-model="newPost.content"
              rows="4"
              required
              class="w-full p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none outline-none"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500'"
              placeholder="Escribe el contenido aquí..."
            ></textarea>
          </div>
          <button type="submit"
                  class="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-xl text-white font-semibold transition-colors duration-200">
            Crear Post
          </button>
        </form>
      </div>
    </div>

    <!-- Sidebar izquierda -->
    <Sidebarizquierda
      class="w-56 flex-shrink-0 flex flex-col border-r h-full"
      :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
    />

    <!-- Contenido principal -->
    <main
      class="flex-1 flex flex-col p-8 overflow-y-auto border-r h-full"
      :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
    >
      <!-- Header más limpio -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-emerald-500 mb-1">Posts</h2>
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            Comparte y descubre contenido de la comunidad
          </p>
        </div>
        <button @click="onAddPost"
                class="bg-emerald-500 hover:bg-emerald-600 rounded-2xl w-12 h-12 flex items-center justify-center text-white text-xl font-bold transition-colors duration-200 shadow-lg">
          +
        </button>
      </div>

      <!-- Filtros por club -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button v-for="club in userClubs" :key="club" @click="filterByClub(club)"
                  class="px-4 py-2 rounded-xl border transition-all duration-200 hover:shadow-md"
                  :class="selectedClub === club
                    ? (isDarkMode ? 'bg-emerald-900/50 border-emerald-700 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-700')
                    : (isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300')">
            {{ club }}
          </button>
          <button @click="filterByClub('')"
                  class="px-4 py-2 rounded-xl border transition-all duration-200 hover:shadow-md"
                  :class="selectedClub === ''
                    ? (isDarkMode ? 'bg-emerald-900/50 border-emerald-700 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-700')
                    : (isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500' : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400')">
            Todos
          </button>
        </div>
      </div>

      <!-- Listado de posts -->
      <div v-if="filteredPosts.length" class="space-y-6">
        <article v-for="post in filteredPosts" :key="post._id"
             class="p-6 rounded-2xl border transition-all duration-200 hover:shadow-md relative"
             :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'">
          <!-- Título y expandir -->
          <header class="mb-4">
            <h3 class="text-xl font-semibold text-emerald-500 cursor-pointer hover:text-emerald-600 transition-colors duration-200 mb-2"
                @click="toggleExpand(post._id)">
              {{ post.title }}
            </h3>
            <p class="leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ post.content }}</p>
          </header>

          <!-- Metadata -->
          <div class="flex items-center justify-between text-sm mb-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'">
                {{ post.club }}
              </span>
              <span class="flex items-center space-x-1">
                <span>{{ post.likesCount || 0 }}</span>
                <span>👍</span>
              </span>
            </div>
          </div>

          <!-- Botones Like / Comentarios -->
          <div class="flex space-x-3 mb-4">
            <button @click="onToggleLike(post._id)"
                    class="px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-200"
                    :class="likedPosts.has(post._id)
                      ? (isDarkMode ? 'bg-blue-900/50 border-blue-800 text-blue-400' : 'bg-blue-100 border-blue-300 text-blue-800')
                      : (isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400')">
              {{ likedPosts.has(post._id) ? 'Unlike' : 'Like' }}
            </button>
            <button @click="toggleExpand(post._id)"
                    class="px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-200"
                    :class="isDarkMode ? 'bg-purple-900/50 border-purple-800 text-purple-400' : 'bg-purple-100 border-purple-300 text-purple-800'">
              {{ expandedPostId === post._id ? 'Ocultar comentarios' : 'Ver comentarios' }}
            </button>
          </div>

          <!-- Sección de comentarios -->
          <div v-if="expandedPostId === post._id" class="border-t pt-4" :class="isDarkMode ? 'border-gray-800' : 'border-gray-200'">
            <!-- Lista de comentarios -->
            <div v-if="commentsMap[post._id]?.length" class="space-y-3 mb-6">
              <div v-for="c in commentsMap[post._id]" :key="c._id"
                   class="p-4 rounded-xl relative border"
                   :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                <!-- Botón eliminar comentario -->
                <button @click="onDeleteComment(post._id, c._id)"
                        class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                        :class="isDarkMode ? 'bg-red-900/50 hover:bg-red-800/70 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'">
                  🗑
                </button>
                <p class="pr-10 mb-2" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">{{ c.content }}</p>
                <p class="text-xs font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">— {{ c.username }}</p>
              </div>
            </div>
            <p v-else class="text-center py-8" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>

            <!-- Formulario nuevo comentario -->
            <form @submit.prevent="onSubmitComment(post._id)" class="flex items-center space-x-3">
              <input
                v-model="newCommentMap[post._id]"
                type="text"
                maxlength="100"
                placeholder="Escribe un comentario..."
                class="flex-1 p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                :class="isDarkMode ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'"
                required
              />
              <button type="submit"
                      class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-colors duration-200">
                Enviar
              </button>
            </form>
          </div>

          <!-- Botón eliminar post (solo admin) -->
          <button v-if="userRole === 'admin'" @click="onDeletePost(post._id)"
                  class="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors duration-200"
                  :class="isDarkMode ? 'bg-red-900/50 hover:bg-red-800/70 text-red-400 border border-red-800' : 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-300'">
            ×
          </button>
        </article>
      </div>
      <div v-else class="text-center py-16">
        <p class="text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          No hay posts disponibles
        </p>
        <p class="text-sm mt-2" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
          ¡Crea el primer post de la comunidad!
        </p>
      </div>
    </main>

    <!-- Sidebar derecha -->
    <aside
      class="w-80 flex-shrink-0 border-l p-0 relative h-full overflow-hidden"
      :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
    >
      <News />
    </aside>

    <!-- Botón logout flotante -->
    <button
      @click="logout"
      class="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 z-30 font-medium"
    >
      Cerrar sesión
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getUserFromToken } from '@/composables/useAuth'
import Sidebarizquierda from '@/components/molecules/Sidebarizquierda.vue'
import News from '@/components/molecules/News.vue'
import { useClubsStore } from '@/stores/clubsStore'
import { usePostsStore } from '@/stores/postsStore'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

const router = useRouter()

const payload = getUserFromToken()
if (!payload) {
  router.replace({ name: 'SignUp' })
}
const username = payload ? `${payload.firstName} ${payload.lastName}`.trim() : ''
const userRole = payload ? payload.rol : ''
const userClubs = payload?.clubs ?? []
// Asegura header Authorization ya configurado en main.ts; si no, vuelve a asignar:
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

// --- Stores ---
const clubsStore = useClubsStore()
const postsStore = usePostsStore()

// --- Estado UI ---
const showModal = ref(false)
const selectedClub = ref('')
const selectedFormClub = ref('')
const newPost = reactive({ title: '', content: '' })

// Filtrado de posts
const filteredPosts = computed(() => {
  const all = postsStore.posts ?? []
  const clubs = selectedClub.value ? [selectedClub.value] : userClubs
  return all.filter(p => clubs.includes(p.club))
})

// Comentarios y likes
const expandedPostId = ref<string | null>(null)
const commentsMap = reactive<Record<string, Array<{ _id: string; content: string; username: string }>>>({})
const newCommentMap = reactive<Record<string, string>>({})
const likedPosts = reactive(new Set<string>(postsStore.likedByUser ?? []))

watch(
  () => postsStore.likedByUser,
  (newVal) => {
    likedPosts.clear()
    newVal.forEach(pid => likedPosts.add(pid))
  }
)

// Prevent body scroll when modal open
watch(showModal, open => {
  document.body.classList.toggle('modal-open', open)
})

// Ciclo inicial
onMounted(async () => {
  await clubsStore.fetchClubs()
  await postsStore.fetchPosts()
})

// Funciones UI
function filterByClub(c: string) { selectedClub.value = c }
function onAddPost() { showModal.value = true }
function closeModal() {
  showModal.value = false
  newPost.title = ''
  newPost.content = ''
  selectedFormClub.value = ''
}

// CRUD Posts
async function submitPost() {
  const clubToSend = selectedClub.value || selectedFormClub.value
  if (!clubToSend) return alert('Debes seleccionar un club.')
  // Llamada corregida: enviar solo title, content, club
  await postsStore.addPost({ title: newPost.title, content: newPost.content, club: clubToSend })
  closeModal()
}
async function onDeletePost(id: string) {
  if (userRole !== 'admin') return
  if (confirm('¿Eliminar este post?')) {
    await postsStore.removePost(id)
  }
}

// Expandir comentarios
async function toggleExpand(postId: string) {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null
  } else {
    expandedPostId.value = postId
    const comments = await postsStore.fetchComments(postId)
    commentsMap[postId] = comments.map(c => ({
      _id: c._id,
      content: c.content,
      username: c.username,
    }))
    newCommentMap[postId] = ''
  }
}

// Likes
async function onToggleLike(postId: string) {
  if (likedPosts.has(postId)) {
    await postsStore.removeLike(postId)
  } else {
    await postsStore.addLike(postId)
  }
}

// Comentarios
async function onSubmitComment(postId: string) {
  const text = newCommentMap[postId]?.trim()
  if (!text) return
  // Llamada corregida: solo postId y content
  await postsStore.addComment(postId, text.slice(0, 100))
  // Recargar comentarios
  const comments = await postsStore.fetchComments(postId)
  commentsMap[postId] = comments.map(c => ({
    _id: c._id,
    content: c.content,
    username: c.username,
  }))
  newCommentMap[postId] = ''
}
async function onDeleteComment(postId: string, commentId: string) {
  if (!confirm('¿Eliminar este comentario?')) return
  try {
    await postsStore.removeComment(postId, commentId)
    const comments = await postsStore.fetchComments(postId)
    commentsMap[postId] = comments.map(c => ({
      _id: c._id,
      content: c.content,
      username: c.username,
    }))
  } catch (error: any) {
    console.error(error)
    alert('No tienes permiso para eliminar este comentario.')
  }
}

// Logout
function logout() {
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
  router.push({ name: 'SignUp' })
}
</script>

<style scoped>
.modal-open {
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transiciones suaves para todos los elementos */
* {
  transition-property: colors, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>