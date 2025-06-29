<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Sidebarizquierda from '@/components/molecules/Sidebarizquierda.vue'
import News from '@/components/molecules/News.vue'
import { useClubsStore } from '@/stores/clubsStore'
import { useLoginStore } from '@/stores/milogin'
import { useThemeStore } from '@/stores/theme'

interface JwtPayload {
  sub: string
  email: string
  rol: string
  firstName: string
  lastName: string
  clubs: string[]
  iat: number
  exp: number
}

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')

// Configuración de axios
const token = localStorage.getItem('token') || ''
if (token) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Cargas de store
const clubsStore = useClubsStore()
const loginStore = useLoginStore()

// Modal y modelo de nuevo club
const showModal = ref(false)
const newClub = ref({ name: '', description: '' })

// JWT payload
let payload: JwtPayload | null = null
try {
  if (token) payload = jwt_decode<JwtPayload>(token)
} catch {
  console.warn('Token inválido o expirado')
}

// On mounted: fetch y setUser
onMounted(async () => {
  await clubsStore.fetchClubs()
  if (payload) {
    loginStore.setUser({
      _id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.rol,
      clubs: payload.clubs || []
    })
  }
})

// Computeds
const isAdmin = computed(() => payload?.rol === 'admin')
const userClubs = computed(() => loginStore.user?.clubs || [])
// Ahora Sports salen del store
const sports = computed(() =>
  clubsStore.clubs.map(c => ({
    _id: c._id,
    name: c.name,
    description: c.description || ''
  }))
)

// Funciones modal
function openModal() { showModal.value = true }
function closeModal() {
  showModal.value = false
  newClub.value = { name: '', description: '' }
}

// Crear club
async function submitClub() {
  if (!newClub.value.name || !newClub.value.description) return
  await clubsStore.createClub({
    name: newClub.value.name,
    description: newClub.value.description
  })
  closeModal()
}

// Eliminar club (admin)
const onDeleteClub = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este club?')) {
    await clubsStore.deleteClub(id)
  }
}

// Unirse / Salir
async function joinClub(clubName: string) {
  try {
    await loginStore.joinClub(clubName)
  } catch {
    alert('Error al unirte al club')
  }
}
async function leaveClub(clubName: string) {
  try {
    await loginStore.leaveClub(clubName)
  } catch {
    alert('Error al salir del club')
  }
}
function hasJoined(clubName: string): boolean {
  return loginStore.user?.clubs.includes(clubName) ?? false
}

// Ajustes UI
watch(showModal, open => {
  document.body.classList.toggle('modal-open', open)
})
function logout() {
  loginStore.logout()
  window.location.href = '/login'
}
</script>

<template>
  <div
    class="min-h-screen overflow-y-auto flex relative"
    :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'"
  >
    <!-- Modal Crear Club -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div
        class="p-6 rounded-xl shadow-lg w-full max-w-md relative border"
        :class="isDarkMode ? 'bg-gray-900 border-green-700' : 'bg-white border-green-400'"
      >
        <button @click="closeModal" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold">
          ×
        </button>
        <h3 class="text-xl mb-4 font-semibold text-green-500">Crear nuevo club</h3>
        <form @submit.prevent="submitClub">
          <div class="mb-3">
            <label class="block text-sm mb-1 text-green-400">Nombre</label>
            <input
              v-model="newClub.name"
              type="text"
              required
              class="w-full p-2 rounded border placeholder-gray-500"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1 text-green-400">Descripción</label>
            <textarea
              v-model="newClub.description"
              required
              class="w-full p-2 rounded border placeholder-gray-500"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'"
            ></textarea>
          </div>
          <button type="submit" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition duration-300">
            Crear Club
          </button>
        </form>
      </div>
    </div>

    <!-- Sidebar izquierda -->
    <Sidebarizquierda
      class="w-1/5 flex flex-col border-r"
      :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'"
    />

    <!-- Contenido principal -->
    <main
      class="w-3/5 flex flex-col p-4 overflow-y-auto border-r"
      :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'"
    >
      <h2 class="text-2xl font-bold mb-6 text-green-500">SELECT YOUR FAVORITES</h2>

      <!-- Sección Sports dinámica -->
      <section class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-green-400">Clubs</h3>
        <div class="space-y-4">
          <div
            v-for="item in sports"
            :key="item._id"
            class="p-4 rounded flex justify-between items-center border"
            :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
          >
            <div>
              <router-link
                :to="{ name: 'UserPosts', query: { club: item.name } }"
                class="font-semibold text-green-400 hover:underline"
              >
                {{ item.name }}
              </router-link>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
                {{ item.description }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="!hasJoined(item.name)"
                @click="joinClub(item.name)"
                class="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white transition duration-300"
              >
                Join
              </button>
              <button
                v-else
                @click="leaveClub(item.name)"
                class="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 text-white transition duration-300"
              >
                Leave
              </button>
              <button
                v-if="isAdmin"
                @click="onDeleteClub(item._id)"
                class="bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm text-white transition duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección Mis Clubs -->
      <section v-if="userClubs.length" class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-green-400">Mis Clubs</h3>
        <div class="space-y-4">
          <div
            v-for="club in userClubs"
            :key="club"
            class="p-4 rounded flex justify-between items-center border"
            :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
          >
            <router-link
              :to="{ name: 'UserPosts', query: { club } }"
              class="text-lg font-semibold text-green-400 hover:underline"
            >
              {{ club }}
            </router-link>
            <button
              @click="leaveClub(club)"
              class="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 text-white transition duration-300"
            >
              Leave
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Sidebar derecha -->
    <aside
      class="w-[295px] flex-shrink-0 border-l p-0 relative"
      :class="isDarkMode ? 'bg-black border-gray-900' : 'bg-white border-gray-200'"
    >
      <News />
    </aside>

    <!-- Botón para admins -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="absolute bottom-20 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300"
    >
      Crear Club
    </button>

    <!-- Botón cerrar sesión -->
    <button
      @click="logout"
      class="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300"
    >
      Cerrar sesión
    </button>
  </div>
</template>

<style scoped>
.modal-open { overflow: hidden; }
</style>
