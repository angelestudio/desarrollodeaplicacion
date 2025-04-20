<template>
  <div class="flex h-screen bg-black text-white relative">
    <!-- Modal para crear club -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center">
      <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
        >×</button>
        <h3 class="text-xl mb-4 font-semibold">Crear nuevo club</h3>
        <form @submit.prevent="submitClub">
          <div class="mb-3">
            <label class="block text-sm mb-1">Nombre</label>
            <input
              v-model="newClub.name"
              type="text"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Descripción</label>
            <textarea
              v-model="newClub.description"
              required
              class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            ></textarea>
          </div>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Crear Club
          </button>
        </form>
      </div>
    </div>

    <!-- Aside Izquierdo -->
    <aside class="w-1/4 p-4 flex flex-col justify-between border-r border-gray-700">
      <miSidebarMenu />
      <div class="mt-4">
        <button
          v-if="isAdmin"
          @click="openModal"
          class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-center font-semibold mb-4"
        >+ Club</button>
        <!-- CORRECCIÓN: interpolación Vue sin '@' -->
        <p class="text-gray-400">{{ userName }}</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6">SELECT YOUR FAVORITES</h2>

      <!-- Sección Sports -->
      <section class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Sports</h3>
        <div class="space-y-4">
          <div
            v-for="item in sports"
            :key="item._id"
            class="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <router-link
                :to="{ name: 'UserPosts', query: { club: item.name } }"
                class="font-semibold text-white hover:underline"
              >{{ item.name }}</router-link>
              <p class="text-sm text-gray-400">{{ item.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="!hasJoined(item.name)"
                @click="joinClub(item.name)"
                class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >Join</button>
              <button
                v-else
                @click="leaveClub(item.name)"
                class="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
              >Leave</button>
              <button
                v-if="isAdmin"
                @click="onDeleteClub(item._id)"
                class="bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm text-white"
              >Eliminar</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección Mis Clubs -->
      <section v-if="userClubs.length" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Mis Clubs</h3>
        <div class="space-y-4">
          <div
            v-for="club in userClubs"
            :key="club"
            class="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <router-link
              :to="{ name: 'UserPosts', query: { club } }"
              class="text-lg font-semibold hover:underline"
            >{{ club }}</router-link>
            <button
              @click="leaveClub(club)"
              class="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
            >Leave</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Aside Derecho -->
    <aside class="w-1/4 p-4 border-l border-gray-700">
      <miTextInputAtom placeholder="Search" class="mb-4" />
      <div class="bg-gray-800 p-4 rounded">
        <h3 class="font-semibold mb-2">What happens?</h3>
        <ul class="text-sm space-y-1">
          <li>noticias cef</li>
          <li>actividad terraza</li>
          <li>apoyo de sostenimiento</li>
          <li>película sabrosona</li>
          <li>talleres</li>
          <li>inglés y otras oportunidades</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import miSidebarMenu from '@/components/molecules/miSidebarMenu.vue'
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue'
import { useClubsStore } from '@/stores/clubsStore'
import { useLoginStore } from '@/stores/milogin'

// --- JWT payload interface
interface JwtPayload {
  sub: string
  email: string
  role: string
  firstName: string
  lastName: string
  clubs: string[]
  iat: number
  exp: number
}

// --- Configurar axios
const token = localStorage.getItem('token') || ''
if (token) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// --- Decodificar token
let payload: JwtPayload | null = null
try {
  if (token) payload = jwt_decode<JwtPayload>(token)
} catch {
  console.warn('Token inválido o expirado')
}

// --- Stores
const clubsStore = useClubsStore()
const loginStore = useLoginStore()

// --- Estado local
const showModal = ref(false)
const newClub = ref({ name: '', description: '' })
const sports = [
  { name: 'Fútbol', description: 'Donde nacen los verdaderos cracks', _id: 'sport1' },
  { name: 'Ping Pong', description: 'Reflejos, ritmo y diversión', _id: 'sport2' },
  { name: 'Ajedrez', description: 'Mueve tu mente, gana estrategia', _id: 'sport3' }
]

// --- On mounted: cargar clubs y sincronizar usuario
onMounted(async () => {
  await clubsStore.fetchClubs()
  if (payload) {
    loginStore.setUser({
      _id:       payload.sub,
      firstName: payload.firstName,
      lastName:  payload.lastName,
      role:      payload.role,
      clubs:     payload.clubs || []
    })
  }
})

// --- Computed
const userName  = computed(() => payload?.firstName || 'Usuario')
const isAdmin   = computed(() => payload?.role === 'admin')
const userClubs = computed(() => loginStore.user?.clubs || [])

// --- Métodos
function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  newClub.value = { name: '', description: '' }
}

async function submitClub() {
  if (!newClub.value.name || !newClub.value.description) return
  await clubsStore.createClub({
    name:        newClub.value.name,
    description: newClub.value.description
  })
  closeModal()
}

const onDeleteClub = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este club?')) {
    await clubsStore.deleteClub(id)
  }
}

function joinClub(clubName: string) {
  loginStore.joinClub(clubName)
}

function leaveClub(clubName: string) {
  loginStore.leaveClub(clubName)
}

function hasJoined(clubName: string): boolean {
  return loginStore.user?.clubs.includes(clubName) ?? false
}

// Modal scroll lock
watch(showModal, open => {
  document.body.classList.toggle('modal-open', open)
})
</script>

<style scoped>
.modal-open {
  overflow: hidden;
}
</style>