<template>
  <div
    :class="[
      'h-screen w-screen overflow-hidden flex relative',
      isDarkMode
        ? 'bg-black text-white'
        : 'bg-white text-green-700'
    ]"
  >
    <!-- Backdrop y modal de creación de post -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div
        :class="[ 
          'p-6 rounded-xl shadow-lg w-full max-w-md relative overflow-y-auto max-h-[80vh] border',
          isDarkMode
            ? 'bg-gray-900 border-green-700'
            : 'bg-white border-green-200'
        ]"
      >
        <button @click="closeModal" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold">×</button>
        <h3 :class="isDarkMode ? 'text-xl mb-4 font-semibold text-green-500' : 'text-xl mb-4 font-semibold text-green-600'">
          Crear nuevo post
        </h3>
        <form @submit.prevent="submitPost">
          <div class="mb-3" v-if="!selectedClub">
            <label :class="isDarkMode ? 'block text-sm mb-1 text-green-400' : 'block text-sm mb-1 text-green-600'">
              Selecciona un club
            </label>
            <select v-model="selectedFormClub" required
                    :class="isDarkMode
                      ? 'w-full p-2 rounded bg-gray-800 text-white border border-gray-700'
                      : 'w-full p-2 rounded bg-white text-green-700 border border-green-200'">
              <option disabled value="">-- Selecciona un club --</option>
              <option v-for="club in userClubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="mb-3" v-else>
            <p :class="isDarkMode ? 'text-sm text-green-400' : 'text-sm text-green-600'">
              Este post se asociará al club: <strong>{{ selectedClub }}</strong>
            </p>
          </div>
          <div class="mb-3">
            <label :class="isDarkMode ? 'block text-sm mb-1 text-green-400' : 'block text-sm mb-1 text-green-600'">Título</label>
            <input v-model="newPost.title" type="text" required
                   :class="isDarkMode
                     ? 'w-full p-2 rounded bg-gray-800 text-white border border-gray-700'
                     : 'w-full p-2 rounded bg-white text-green-700 border border-green-200'" />
          </div>
          <div class="mb-3">
            <label :class="isDarkMode ? 'block text-sm mb-1 text-green-400' : 'block text-sm mb-1 text-green-600'">Contenido</label>
            <textarea
              v-model="newPost.content"
              rows="4"
              required
              :class="isDarkMode
                ? 'w-full p-2 rounded bg-gray-800 text-white border border-gray-700'
                : 'w-full p-2 rounded bg-white text-green-700 border border-green-200'"
              placeholder="Escribe el contenido aquí..."
            ></textarea>
          </div>
          <button type="submit"
                  :class="isDarkMode
                    ? 'bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition'
                    : 'bg-[#21c25a] hover:bg-green-700 px-4 py-2 rounded text-white transition'">
            Crear
          </button>
        </form>
      </div>
    </div>

    <!-- Sidebar izquierda - Ancho fijo -->
    <Sidebarizquierda
      :class="[
        'w-56 flex-shrink-0 border-r h-full',
        isDarkMode
          ? 'bg-black border-gray-800'
          : 'bg-white border-gray-200'
      ]"
    />

    <!-- Contenido principal - Flex para ocupar espacio disponible -->
    <main :class="[
      'flex-1 p-4 overflow-y-auto h-full',
      isDarkMode ? 'bg-black' : 'bg-white'
    ]">
      <div class="flex justify-between items-center mb-4">
        <h2 :class="isDarkMode ? 'text-2xl font-bold text-green-500' : 'text-2xl font-bold text-green-600'">Posts</h2>
        <button @click="onAddPost"
                :class="isDarkMode
                  ? 'bg-green-600 hover:bg-green-700 rounded-full w-8 h-8 flex items-center justify-center text-white'
                  : 'bg-[#21c25a] hover:bg-green-700 rounded-full w-8 h-8 flex items-center justify-center text-white'">
          +
        </button>
      </div>

      <!-- Filtros por club -->
      <div class="overflow-x-auto whitespace-nowrap mb-4">
        <button v-for="club in userClubs" :key="club" @click="filterByClub(club)"
                :class="isDarkMode
                  ? 'inline-block px-4 py-2 my-2 mr-2 bg-gray-900 hover:bg-gray-800 rounded-full border border-green-700 text-green-400'
                  : 'inline-block px-4 py-2 my-2 mr-2 bg-green-50 hover:bg-green-100 rounded-full border border-green-200 text-green-700'">
          {{ club }}
        </button>
        <button @click="filterByClub('')"
                :class="isDarkMode
                  ? 'inline-block px-4 py-2 my-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-green-700 text-green-400'
                  : 'inline-block px-4 py-2 my-2 bg-green-100 hover:bg-green-200 rounded-full border border-green-300 text-green-700'">
          Todos
        </button>
      </div>

      <!-- Listado de posts -->
      <div v-if="filteredPosts.length" class="space-y-4">
        <div v-for="post in filteredPosts" :key="post._id"
             :class="isDarkMode
               ? 'bg-gray-900 p-4 rounded mb-4 border border-gray-700 relative'
               : 'bg-green-50 p-4 rounded mb-4 border border-green-200 relative'">
          <!-- Título y expandir -->
          <h3 :class="isDarkMode ? 'text-xl font-semibold text-green-400 cursor-pointer' : 'text-xl font-semibold text-green-600 cursor-pointer'"
              @click="toggleExpand(post._id)">
            {{ post.title }}
          </h3>
          <p :class="isDarkMode ? 'text-gray-300 mb-2' : 'text-green-900 mb-2'">{{ post.content }}</p>

          <!-- Contador de likes y club -->
          <div :class="isDarkMode ? 'flex items-center text-sm text-green-400 mb-2' : 'flex items-center text-sm text-green-500 mb-2'">
            <span class="mr-4">Club: {{ post.club }}</span>
            <span>{{ post.likesCount || 0 }} 👍</span>
          </div>

          <!-- Botones Like / Comentarios -->
          <div class="flex space-x-2 mb-2">
            <button @click="onToggleLike(post._id)"
                    :class="isDarkMode
                      ? 'px-3 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-900 rounded text-sm text-blue-400'
                      : 'px-3 py-1 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-sm text-blue-800'">
              {{ likedPosts.has(post._id) ? 'Unlike' : 'Like' }}
            </button>
            <button @click="toggleExpand(post._id)"
                    :class="isDarkMode
                      ? 'px-3 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-900 rounded text-sm text-purple-300'
                      : 'px-3 py-1 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded text-sm text-purple-800'">
              {{ expandedPostId === post._id ? 'Ocultar comentarios' : 'Comentarios' }}
            </button>
          </div>

          <!-- Sección de comentarios -->
          <div v-if="expandedPostId === post._id" :class="isDarkMode ? 'mt-2 border-t border-gray-700 pt-2' : 'mt-2 border-t border-green-200 pt-2'">
            <!-- Lista de comentarios -->
            <div v-if="commentsMap[post._id]?.length" class="space-y-2 mb-4">
              <div v-for="c in commentsMap[post._id]" :key="c._id"
                   :class="isDarkMode
                     ? 'bg-gray-800 p-2 rounded mb-2 relative border border-gray-700'
                     : 'bg-green-100 p-2 rounded mb-2 relative border border-green-200'">
                <!-- Botón eliminar comentario -->
                <button @click="onDeleteComment(post._id, c._id)"
                        :class="isDarkMode
                          ? 'absolute top-2 right-2 bg-red-900 hover:bg-red-800 px-2 py-1 rounded text-xs text-white'
                          : 'absolute top-2 right-2 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs text-red-700'">
                  🗑
                </button>
                <p :class="isDarkMode ? 'text-gray-200' : 'text-green-900'">{{ c.content }}</p>
                <p :class="isDarkMode ? 'text-xs text-gray-400' : 'text-xs text-green-500'">— {{ c.username }}</p>
              </div>
            </div>
            <p v-else :class="isDarkMode ? 'text-gray-400 mb-4' : 'text-green-500 mb-4'">No hay comentarios.</p>

            <!-- Formulario nuevo comentario -->
            <form @submit.prevent="onSubmitComment(post._id)" class="flex items-center space-x-2">
              <input
                v-model="newCommentMap[post._id]"
                type="text"
                maxlength="100"
                placeholder="Escribe un comentario..."
                :class="isDarkMode
                  ? 'flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700'
                  : 'flex-1 p-2 rounded bg-white text-green-900 border border-green-200'"
                required
              />
              <button type="submit"
                      :class="isDarkMode
                        ? 'px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white'
                        : 'px-3 py-1 bg-[#21c25a] hover:bg-green-700 rounded text-sm text-white'">
                Enviar
              </button>
            </form>
          </div>

          <!-- Botón eliminar post (solo admin) -->
          <button v-if="userRole === 'admin'" @click="onDeletePost(post._id)"
                  :class="isDarkMode
                    ? 'absolute top-2 right-2 bg-red-900 hover:bg-red-800 px-2 py-1 rounded text-sm text-white border border-red-900'
                    : 'absolute top-2 right-2 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-sm text-red-700 border border-red-300'">
            Delete
          </button>
        </div>
      </div>
      <p v-else :class="isDarkMode ? 'text-center text-gray-400' : 'text-center text-green-500'">No hay posts disponibles.</p>
    </main>

    <!-- Sidebar derecha - Ancho fijo -->
    <aside
      :class="[
        'w-80 flex-shrink-0 border-l p-0 h-full overflow-hidden',
        isDarkMode
          ? 'bg-black border-gray-900'
          : 'bg-white border-green-200'
      ]">
      <News />
    </aside>

    <!-- Botón logout flotante -->
    <button @click="logout"
            :class="isDarkMode
              ? 'fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 z-30'
              : 'fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 z-30'">
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

// Tema
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

// Router
const router = useRouter()

// --- Usuario ---
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
</style>