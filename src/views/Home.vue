<template>
  <div class="min-h-screen overflow-y-auto bg-black text-white flex relative">
    <!-- Backdrop & Modal -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md relative overflow-y-auto max-h-[80vh]">
        <button @click="closeModal" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold">×</button>
        <h3 class="text-xl mb-4 font-semibold">Crear nuevo post</h3>
        <form @submit.prevent="submitPost">
          <!-- Club selector -->
          <div class="mb-3" v-if="!selectedClub">
            <label class="block text-sm mb-1">Selecciona un club</label>
            <select v-model="selectedFormClub" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" required>
              <option disabled value="">-- Selecciona un club --</option>
              <option v-for="club in userClubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="mb-3" v-else>
            <p class="text-sm text-green-400">
              Este post se asociará al club: <strong>{{ selectedClub }}</strong>
            </p>
          </div>

          <!-- Título -->
          <div class="mb-3">
            <label class="block text-sm mb-1">Título</label>
            <input
              v-model="newPost.title"
              type="text"
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Título del post"
              required
            />
          </div>

          <!-- Contenido -->
          <div class="mb-3">
            <label class="block text-sm mb-1">Contenido</label>
            <textarea
              v-model="newPost.content"
              rows="4"
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Escribe el contenido aquí..."
              required
            ></textarea>
          </div>

          <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded my-5">Crear</button>
        </form>
      </div>
    </div>

    <!-- Sidebar izquierdo -->
    <Sidebarizquierda class="w-full md:w-1/5 lg:w-1/5 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-gray-800" />

    <!-- Contenido principal ocupa todo el espacio restante -->
    <main class="flex-1 bg-black flex flex-col relative p-4">
      <!-- Navegación de clubs -->
      

      <!-- Header Posts centrado -->
      <div class="flex justify-center items-center mb-4 relative">
        <h2 class="text-2xl font-bold text-center w-full">Posts</h2>
        <button
          @click="onAddPost"
          title="Agregar post"
          class="absolute right-0 bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center"
        >
          +
        </button>
      </div>

      <!-- Filtros por club -->
      <div class="overflow-x-auto whitespace-nowrap mb-4">
        <button
          v-for="club in userClubs"
          :key="club"
          @click="filterByClub(club)"
          class="inline-block px-4 py-2 my-5 mr-2 bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          {{ club }}
        </button>
        <button
          @click="filterByClub('')"
          class="inline-block px-4 py-2 my-5 bg-gray-600 hover:bg-gray-500 rounded-full"
        >
          Todos
        </button>
      </div>

      <!-- Listado de posts -->
      <div v-if="filteredPosts.length">
        <div
          v-for="post in filteredPosts"
          :key="post._id"
          class="bg-gray-800 p-4 rounded mb-2 relative"
        >
          <h3 class="text-xl font-semibold">{{ post.title }}</h3>
          <p class="text-gray-400 mb-2">{{ post.content }}</p>
          <span class="text-sm text-gray-500">Club: {{ post.club }}</span>
          <button
            v-if="userRole === 'admin'"
            @click="onDeletePost(post._id)"
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No hay posts disponibles.</p>
    </main>

    <!-- Sidebar derecho -->
    <aside class="w-[297px] flex-shrink-0 bg-black border-l border-gray-900 p-0 relative">
      
      <News />
      
    </aside>
    <button
        @click="logout"
        class="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Cerrar sesión
      </button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { JwtPayload } from '@/composables/useAuth'
import { getUserFromToken } from '@/composables/useAuth'

import Sidebarizquierda from '@/components/molecules/Sidebarizquierda.vue'
import News from '@/components/molecules/News.vue'

import { useClubsStore } from '@/stores/clubsStore'
import { usePostsStore } from '@/stores/postsStore'

const router = useRouter()
const route = useRoute()

const username    = ref('')
const userRole    = ref('')
const userClubs   = ref<string[]>([])    // inicializado a arreglo vacío

// Extraemos los datos del JWT
const payload = getUserFromToken()
if (!payload) {
  router.replace({ name: 'SignUp' })
} else {
  username.value    = `${payload.firstName} ${payload.lastName}`
  userRole.value    = payload.rol
  // Nos aseguramos de asignar un arreglo aunque payload.clubs sea undefined
  userClubs.value   = payload.clubs ?? []

  axios.defaults.headers.common['Authorization'] =
    `Bearer ${localStorage.getItem('token')}`
}

const clubsStore = useClubsStore()
const postsStore = usePostsStore()

const showModal        = ref(false)
const selectedClub     = ref('')
const selectedFormClub = ref('')
const newPost          = reactive({ title: '', content: '' })

// Computed con defensas: usamos coalescencia para clubs y posts
const filteredPosts = computed(() => {
  const clubsArr   = userClubs.value ?? []
  const clubsToShow = selectedClub.value
    ? [selectedClub.value]
    : clubsArr

  // Por si postsStore.posts aún no está poblado
  const allPosts = postsStore.posts ?? []

  return allPosts.filter(p =>
    clubsToShow.includes(p.club)
  )
})

onMounted(async () => {
  await clubsStore.fetchClubs()
  await postsStore.fetchPosts()
  if (route.query.club) {
    selectedClub.value = route.query.club as string
  }
})

function filterByClub(club: string) {
  selectedClub.value = club
}
function onAddPost() {
  showModal.value = true
}
function closeModal() {
  showModal.value        = false
  newPost.title          = ''
  newPost.content        = ''
  selectedFormClub.value = ''
}
async function submitPost() {
  const clubToSend = selectedClub.value || selectedFormClub.value
  if (!clubToSend) {
    alert('Debes seleccionar un club para asociar el post.')
    return
  }
  await postsStore.addPost({
    title:   newPost.title,
    content: newPost.content,
    club:    clubToSend,
    user:    username.value,
  })
  closeModal()
}
async function onDeletePost(id: string) {
  if (userRole.value !== 'admin') return
  if (confirm('¿Seguro que deseas eliminar este post?')) {
    await postsStore.removePost(id)
  }
}
watch(showModal, open => {
  document.body.classList.toggle('modal-open', open)
})

function logout() {
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
  router.push({ name: 'SignUp' })
}
</script>