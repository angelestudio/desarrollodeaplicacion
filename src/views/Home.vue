<template>
  <div class="min-h-screen overflow-y-auto bg-black text-white flex relative">
    <!-- Backdrop y modal de creación de post -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md relative overflow-y-auto max-h-[80vh] border border-green-700">
        <button @click="closeModal" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold">×</button>
        <h3 class="text-xl mb-4 font-semibold text-green-500">Crear nuevo post</h3>
        <form @submit.prevent="submitPost">
          <div class="mb-3" v-if="!selectedClub">
            <label class="block text-sm mb-1 text-green-400">Selecciona un club</label>
            <select v-model="selectedFormClub" required
                    class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700">
              <option disabled value="">-- Selecciona un club --</option>
              <option v-for="club in userClubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="mb-3" v-else>
            <p class="text-sm text-green-400">
              Este post se asociará al club: <strong>{{ selectedClub }}</strong>
            </p>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1 text-green-400">Título</label>
            <input v-model="newPost.title" type="text" required
                   class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"/>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1 text-green-400">Contenido</label>
            <textarea
              v-model="newPost.content"
              rows="4"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="Escribe el contenido aquí..."
            ></textarea>
          </div>
          <button type="submit"
                  class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition">
            Crear
          </button>
        </form>
      </div>
    </div>

    <!-- Sidebar -->
    <Sidebarizquierda class="w-full md:w-1/5 bg-black border-b md:border-b-0 md:border-r border-gray-800"/>

    <!-- Contenido principal -->
    <main class="flex-1 bg-black p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-green-500">Posts</h2>
        <button @click="onAddPost"
                class="bg-green-600 hover:bg-green-700 rounded-full w-8 h-8 flex items-center justify-center text-white">+
        </button>
      </div>

      <!-- Filtros por club -->
      <div class="overflow-x-auto whitespace-nowrap mb-4">
        <button v-for="club in userClubs" :key="club" @click="filterByClub(club)"
                class="inline-block px-4 py-2 my-2 mr-2 bg-gray-700 hover:bg-gray-600 rounded-full">
          {{ club }}
        </button>
        <button @click="filterByClub('')"
                class="inline-block px-4 py-2 my-2 bg-gray-600 hover:bg-gray-500 rounded-full">
          Todos
        </button>
      </div>

      <!-- Listado de posts -->
      <div v-if="filteredPosts.length">
        <div v-for="post in filteredPosts" :key="post._id"
             class="bg-gray-900 p-4 rounded mb-4 border border-gray-700 relative">
          <!-- Título y expandir -->
          <h3 class="text-xl font-semibold text-green-400 cursor-pointer"
              @click="toggleExpand(post._id)">
            {{ post.title }}
          </h3>
          <p class="text-gray-300 mb-2">{{ post.content }}</p>

          <!-- Contador de likes y club -->
          <div class="flex items-center text-sm text-gray-500 mb-2">
            <span class="mr-4">Club: {{ post.club }}</span>
            <span>{{ post.likesCount || 0 }} 👍</span>
          </div>

          <!-- Botones Like / Comentarios -->
          <div class="flex space-x-2 mb-2">
            <button @click="onToggleLike(post._id)"
                    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              {{ likedPosts.has(post._id) ? 'Unlike' : 'Like' }}
            </button>
            <button @click="toggleExpand(post._id)"
                    class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
              {{ expandedPostId === post._id ? 'Ocultar comentarios' : 'Comentarios' }}
            </button>
          </div>

          <!-- Sección de comentarios -->
          <div v-if="expandedPostId === post._id" class="mt-2 border-t border-gray-700 pt-2">
            <!-- Lista de comentarios -->
            <div v-if="commentsMap[post._id]?.length" class="space-y-2 mb-4">
              <div v-for="c in commentsMap[post._id]" :key="c._id"
                   class="bg-gray-800 p-2 rounded mb-2 relative">
                <!-- Botón eliminar comentario -->
                <button @click="onDeleteComment(post._id, c._id)"
                        class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs text-white">
                  🗑
                </button>
                <p class="text-gray-200">{{ c.content }}</p>
                <p class="text-xs text-gray-500">— {{ c.user }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 mb-4">No hay comentarios.</p>

            <!-- Formulario nuevo comentario -->
            <form @submit.prevent="onSubmitComment(post._id)" class="flex items-center space-x-2">
              <input
                v-model="newCommentMap[post._id]"
                type="text"
                maxlength="100"
                placeholder="Escribe un comentario..."
                class="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
              <button type="submit"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                Enviar
              </button>
            </form>
          </div>

          <!-- Botón eliminar post (solo admin) -->
          <button v-if="userRole === 'admin'" @click="onDeletePost(post._id)"
                  class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm text-white">
            Delete
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No hay posts disponibles.</p>
    </main>

    <!-- Aside de noticias -->
    <aside class="w-[297px] bg-black border-l border-gray-900 p-4">
      <News />
    </aside>

    <!-- Logout -->
    <button @click="logout"
            class="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
      Cerrar sesión
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getUserFromToken } from '@/composables/useAuth'

import Sidebarizquierda from '@/components/molecules/Sidebarizquierda.vue'
import News from '@/components/molecules/News.vue'
import { useClubsStore } from '@/stores/clubsStore'
import { usePostsStore } from '@/stores/postsStore'

const router = useRouter()

// --- Usuario ---
const payload = getUserFromToken()
if (!payload) router.replace({ name: 'SignUp' })
const username = `${payload.firstName} ${payload.lastName}`
const userRole = payload.rol
const userClubs = payload.clubs ?? []
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

// --- Stores ---
const clubsStore = useClubsStore()
const postsStore = usePostsStore()

// --- Estado UI ---
const showModal = ref(false)
const selectedClub = ref('')
const selectedFormClub = ref('')
const newPost = reactive({ title: '', content: '' })

// --- Filtrado de posts ---
const filteredPosts = computed(() => {
  const all = postsStore.posts ?? []
  const clubs = selectedClub.value ? [selectedClub.value] : userClubs
  return all.filter(p => clubs.includes(p.club))
})

// --- Comentarios y likes ---
const expandedPostId = ref<string | null>(null)
const commentsMap = reactive<Record<string, Array<{_id:string, content:string, user:string}>>>({})
const newCommentMap = reactive<Record<string, string>>({})
const likedPosts = reactive<Set<string>>(new Set(postsStore.likedByUser ?? []))

// --- Ciclo inicial ---
onMounted(async () => {
  await clubsStore.fetchClubs()
  await postsStore.fetchPosts()
})

// --- Funciones UI ---
function filterByClub(c: string) { selectedClub.value = c }
function onAddPost() { showModal.value = true }
function closeModal() {
  showModal.value = false
  newPost.title = ''
  newPost.content = ''
  selectedFormClub.value = ''
}

// --- CRUD Posts ---
async function submitPost() {
  const clubToSend = selectedClub.value || selectedFormClub.value
  if (!clubToSend) return alert('Debes seleccionar un club.')
  await postsStore.addPost({ ...newPost, club: clubToSend, user: username })
  closeModal()
}
async function onDeletePost(id: string) {
  if (userRole !== 'admin') return
  if (confirm('¿Eliminar este post?')) {
    await postsStore.removePost(id)
    // refrescar listado
    await postsStore.fetchPosts()
  }
}

// --- Expandir comentarios ---
async function toggleExpand(postId: string) {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null
  } else {
    expandedPostId.value = postId
    commentsMap[postId] = await postsStore.fetchComments(postId)
    newCommentMap[postId] = ''
  }
}

// --- Likes ---
async function onToggleLike(postId: string) {
  if (likedPosts.has(postId)) {
    await postsStore.removeLike(postId)
    likedPosts.delete(postId)
  } else {
    await postsStore.addLike(postId)
    likedPosts.add(postId)
  }
  // refrescar contador
  await postsStore.fetchPosts()
}

// --- Comentarios ---
async function onSubmitComment(postId: string) {
  const text = newCommentMap[postId]?.trim()
  if (!text) return
  await postsStore.addComment({ postId, content: text.slice(0, 100), user: username })
  commentsMap[postId] = await postsStore.fetchComments(postId)
  newCommentMap[postId] = ''
}
async function onDeleteComment(postId: string, commentId: string) {
  await postsStore.removeComment(postId, commentId)
  commentsMap[postId] = await postsStore.fetchComments(postId)
}

// --- Logout ---
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
