<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import jwt_decode from 'jwt-decode'
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

// Pinia stores
const clubsStore = useClubsStore()
const loginStore = useLoginStore()

// Modal state
const showModal = ref(false)
const newClub = ref({ name: '', description: '' })

// Decode JWT on load
let payload: JwtPayload | null = null
const token = localStorage.getItem('token')
if (token) {
  try {
    payload = jwt_decode<JwtPayload>(token)
  } catch {
    console.warn('Token inválido o expirado')
  }
}

// On mount: fetch clubs and hydrate loginStore.user
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

// Computed props
const isAdmin = computed(() => loginStore.user?.role === 'admin')
const userClubs = computed(() => loginStore.user?.clubs || [])
const sports = computed(() =>
  clubsStore.clubs.map(c => ({
    _id: c._id,
    name: c.name,
    description: c.description || ''
  }))
)

// Modal controls
function openModal() {
  showModal.value = true
}
function closeModal() {
  showModal.value = false
  newClub.value = { name: '', description: '' }
}

// Create club
async function submitClub() {
  if (!newClub.value.name || !newClub.value.description) return
  await clubsStore.createClub({
    name: newClub.value.name,
    description: newClub.value.description
  })
  closeModal()
}

// Delete club
async function onDeleteClub(id: string) {
  if (confirm('¿Estás seguro de eliminar este club?')) {
    await clubsStore.deleteClub(id)
  }
}

// Join / Leave
async function joinClub(clubId: string) {
  try {
    await loginStore.joinClub(clubId)
  } catch {
    alert('Error al unirte al club')
  }
}
async function leaveClub(clubId: string) {
  try {
    await loginStore.leaveClub(clubId)
  } catch {
    alert('Error al salir del club')
  }
}
function hasJoined(clubId: string): boolean {
  return loginStore.user?.clubs.includes(clubId) ?? false
}

// Prevent body scroll when modal open
watch(showModal, open => {
  document.body.classList.toggle('modal-open', open)
})

// Logout
function logout() {
  loginStore.logout()
  window.location.href = '/login'
}
</script>

<template>
  <div
    class="h-screen w-screen overflow-hidden flex"
    :class="isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'"
  > 
    <!-- Modal Crear Club - Estilo más limpio -->
    <div v-if="showModal" class="absolute inset-0 backdrop-blur-sm bg-black/50 z-40"></div>
    <div v-if="showModal" class="fixed z-50 inset-0 flex items-center justify-center p-4">
      <div
        class="p-6 rounded-2xl shadow-xl w-full max-w-md relative border"
        :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
      >
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors duration-200"
        >
          ×
        </button>
        <h3 class="text-xl mb-4 font-semibold text-emerald-500">
          Crear nuevo club
        </h3>
        <form @submit.prevent="submitClub" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Nombre
            </label>
            <input
              v-model="newClub.name"
              type="text"
              required
              class="w-full p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500'"
              placeholder="Nombre del club"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Descripción
            </label>
            <textarea
              v-model="newClub.description"
              required
              rows="3"
              class="w-full p-3 rounded-xl border transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none outline-none"
              :class="isDarkMode ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500'"
              placeholder="Descripción del club"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-xl text-white font-semibold transition-colors duration-200"
          >
            Crear Club
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
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-emerald-500 mb-1">
          SELECT YOUR FAVORITES
        </h2>
        <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
          Descubre y únete a los clubs que más te interesen
        </p>
      </div>

      <!-- Sección Clubs -->
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
          Todos los Clubs
        </h3>
        <div class="grid gap-4">
          <div
            v-for="item in sports"
            :key="item._id"
            class="p-4 rounded-2xl flex justify-between items-center border transition-all duration-200 hover:shadow-md"
            :class="isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
          >
            <div class="flex-1 min-w-0">
              <router-link
                :to="{ name: 'UserPosts', query: { club: item._id } }"
                class="font-semibold text-emerald-500 hover:text-emerald-600 block truncate transition-colors duration-200"
              >
                {{ item.name }}
              </router-link>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm mt-1 line-clamp-2">
                {{ item.description }}
              </p>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
              <button
                v-if="!hasJoined(item._id)"
                @click="joinClub(item._id)"
                class="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-white font-medium transition-colors duration-200 text-sm"
              >
                Unirse
              </button>
              <button
                v-else
                @click="leaveClub(item._id)"
                class="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl text-white font-medium transition-colors duration-200 text-sm"
              >
                Salir
              </button>
              <button
                v-if="isAdmin"
                @click="onDeleteClub(item._id)"
                class="bg-red-500 hover:bg-red-600 rounded-xl px-3 py-2 text-xs text-white font-medium transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección Mis Clubs -->
      <section v-if="userClubs.length" class="mb-8">
        <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
          Mis Clubs
        </h3>
        <div class="grid gap-4">
          <div
            v-for="clubId in userClubs"
            :key="clubId"
            class="p-4 rounded-2xl flex justify-between items-center border transition-all duration-200 hover:shadow-md"
            :class="isDarkMode ? 'bg-emerald-900/20 border-emerald-800/50 hover:border-emerald-700/50' : 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'"
          >
            <router-link
              :to="{ name: 'UserPosts', query: { club: clubId } }"
              class="font-semibold text-emerald-500 hover:text-emerald-600 flex-1 min-w-0 truncate transition-colors duration-200"
            >
              {{ clubsStore.clubs.find(c => c._id === clubId)?.name || clubId }}
            </router-link>
            <button
              @click="leaveClub(clubId)"
              class="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl text-white font-medium transition-colors duration-200 text-sm flex-shrink-0 ml-4"
            >
              Salir
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Sidebar derecha -->
    <aside
      class="w-80 flex-shrink-0 border-l p-0 relative h-full overflow-hidden"
      :class="isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'"
    >
      <News />
    </aside>

    <!-- Botones flotantes más discretos -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="fixed bottom-20 right-6 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 z-30 font-medium"
    >
      Crear Club
    </button>
    <button
      @click="logout"
      class="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 z-30 font-medium"
    >
      Cerrar sesión
    </button>
  </div>
</template>

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