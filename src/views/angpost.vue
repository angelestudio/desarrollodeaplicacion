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
  clubs: any[] // puede venir string[] o Array<{_id: string, ...}>
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

// Bloqueos para evitar clicks concurrentes
const leavingClubId = ref<string | null>(null)
const joiningClubId = ref<string | null>(null)

// Decode JWT on load
let payload: JwtPayload | null = null
const token = localStorage.getItem('token')
if (token) {
  try {
    payload = jwt_decode<JwtPayload>(token)
  } catch (e) {
    console.warn('Token inválido o expirado')
  }
}

// On mount: fetch clubs and hydrate loginStore.user
onMounted(async () => {
  try {
    await clubsStore.fetchClubs()
  } catch (err) {
    console.error('Error fetching clubs:', err)
  }

  if (payload) {
    // Normalizamos clubs al setear el usuario
    const rawClubs = payload.clubs || []
    const clubIds = Array.isArray(rawClubs)
      ? rawClubs.map((c: any) => (typeof c === 'object' && c._id ? String(c._id) : String(c)))
      : []

    loginStore.setUser({
      _id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.rol,
      clubs: clubIds
    })
  }
})

// Helpers para normalizar clubs desde el store (puede venir string[] o object[])
function normalizeClubs(raw: any): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c: any) => (typeof c === 'object' && c._id ? String(c._id) : String(c)))
}

// Computed props
const isAdmin = computed(() => loginStore.user?.role === 'admin')
const userClubs = computed(() => normalizeClubs(loginStore.user?.clubs))
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
  try {
    await clubsStore.createClub({
      name: newClub.value.name,
      description: newClub.value.description
    })
    closeModal()
  } catch (err) {
    console.error('Error creando club:', err)
    alert('No se pudo crear el club. Revisa la consola.')
  }
}

// Delete club
async function onDeleteClub(id: string) {
  if (!confirm('¿Estás seguro de eliminar este club?')) return
  try {
    await clubsStore.deleteClub(id)
  } catch (err) {
    console.error('Error eliminando club:', err)
    alert('No se pudo eliminar el club. Revisa la consola.')
  }
}

// Join / Leave con protección y fallback local
async function joinClub(clubId: string) {
  if (joiningClubId.value) return
  joiningClubId.value = clubId
  try {
    await loginStore.joinClub(clubId)

    // fallback: si el store no añadió el id, lo añadimos localmente
    if (loginStore.user) {
      const normalized = normalizeClubs(loginStore.user.clubs)
      if (!normalized.includes(clubId)) {
        loginStore.user.clubs = [...normalized, clubId]
      }
    }
  } catch (err) {
    console.error('Error al unirte al club:', err)
    alert('Error al unirte al club. Revisa la consola (Network) para más detalles.')
  } finally {
    joiningClubId.value = null
  }
}

async function leaveClub(clubId: string) {
  if (leavingClubId.value) return
  leavingClubId.value = clubId
  try {
    await loginStore.leaveClub(clubId)
await clubsStore.fetchClubs()
    // fallback: si el store no actualizó, lo actualizamos localmente
    if (loginStore.user) {
      const normalized = normalizeClubs(loginStore.user.clubs)
      loginStore.user.clubs = normalized.filter(id => id !== clubId)
    }
  } catch (err) {
    console.error('Error al salir del club:', err)
    alert('Error al salir del club: ' + (err?.message || 'revisa la consola y el Network tab'))
  } finally {
    leavingClubId.value = null
  }
}

// Comprobación robusta de si el usuario pertenece al club
function hasJoined(clubId: string): boolean {
  const clubs = loginStore.user?.clubs
  if (!Array.isArray(clubs)) return false
  return normalizeClubs(clubs).includes(clubId)
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
    :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'"
  >
    <!-- Modal Crear Club -->
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
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition duration-300"
          >
            Crear Club
          </button>
        </form>
      </div>
    </div>

    <!-- Sidebar izquierda - Ancho fijo similar a la imagen -->
    <Sidebarizquierda
      class="w-56 flex-shrink-0 flex flex-col border-r h-full"
      :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'"
    />

    <!-- Contenido principal - Ocupa el espacio central -->
    <main
      class="flex-1 flex flex-col p-4 overflow-y-auto border-r h-full"
      :class="isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'"
    >
      <h2 class="text-2xl font-bold mb-6 text-green-500">SELECT YOUR FAVORITES</h2>

      <!-- Sección Clubs -->
      <section class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-green-400">Clubs</h3>
        <div class="space-y-4">
          <div
            v-for="item in sports"
            :key="item._id"
            class="p-4 rounded flex justify-between items-center border"
            :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
          >
            <div class="flex-1 min-w-0">
              <router-link
                :to="{ name: 'UserPosts', query: { club: item._id } }"
                class="font-semibold text-green-400 hover:underline block truncate"
              >
                {{ item.name }}
              </router-link>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm line-clamp-2">
                {{ item.description }}
              </p>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
              <button
                v-if="!hasJoined(item._id)"
                @click="joinClub(item._id)"
                :disabled="joiningClubId === item._id"
                class="bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 text-white transition duration-300 text-sm disabled:opacity-50"
              >
                <span v-if="joiningClubId === item._id">Uniendo...</span>
                <span v-else>Join</span>
              </button>

              <button
                v-else
                @click="leaveClub(item._id)"
                :disabled="leavingClubId === item._id"
                class="bg-gray-600 px-3 py-1.5 rounded hover:bg-gray-500 text-white transition duration-300 text-sm disabled:opacity-50"
              >
                <span v-if="leavingClubId === item._id">Saliendo...</span>
                <span v-else>Leave</span>
              </button>

              <button
                v-if="isAdmin"
                @click="onDeleteClub(item._id)"
                class="bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-xs text-white transition duration-300"
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
            v-for="clubId in userClubs"
            :key="clubId"
            class="p-4 rounded flex justify-between items-center border"
            :class="isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
          >
            <router-link
              :to="{ name: 'UserPosts', query: { club: clubId } }"
              class="text-lg font-semibold text-green-400 hover:underline flex-1 min-w-0 truncate"
            >
              {{ clubsStore.clubs.find(c => c._id === clubId)?.name || clubId }}
            </router-link>

            <button
              @click="leaveClub(clubId)"
              :disabled="leavingClubId === clubId"
              class="bg-gray-600 px-3 py-1.5 rounded hover:bg-gray-500 text-white transition duration-300 text-sm flex-shrink-0 ml-4 disabled:opacity-50"
            >
              <span v-if="leavingClubId === clubId">Saliendo...</span>
              <span v-else>Leave</span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Sidebar derecha - Ancho fijo similar a la imagen -->
    <aside
      class="w-80 flex-shrink-0 border-l p-0 relative h-full overflow-hidden"
      :class="isDarkMode ? 'bg-black border-gray-900' : 'bg-white border-gray-200'"
    >
      <News />
    </aside>

    <!-- Botones flotantes -->
    <button
      v-if="isAdmin"
      @click="openModal"
      class="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 z-30"
    >
      Crear Club
    </button>
    <button
      @click="logout"
      class="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 z-30"
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
</style>
