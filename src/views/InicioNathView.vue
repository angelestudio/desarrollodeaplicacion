<template>
  <div class="relative min-h-screen flex flex-col" :class="theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'">
    <!-- Fondo decorativo -->
    <div class="absolute inset-0 opacity-30 z-0" :class="theme === 'light' ? 'bg-gradient-to-br from-white via-green-100 to-white' : 'bg-gradient-to-br from-black via-green-950 to-black'"></div>

    <!-- NAVBAR -->
    <nav class="flex justify-between items-center px-10 py-6 relative z-10">
      <div class="flex items-center space-x-4">
        <img src="@/assets/logo-del-sena-01.png" alt="Logo SENA" class="w-10 h-10" />
        <div class="text-3xl font-extrabold">SENACLUB</div>
      </div>

      <div class="relative group">
        <button class="hover:text-[#39A900] focus:outline-none">
          Información
        </button>
        <div class="absolute hidden group-hover:block border border-[#39A900] text-sm mt-2 p-4 rounded-lg shadow-lg z-20 w-64" :class="theme === 'light' ? 'bg-white' : 'bg-black'">
          <p>Esta plataforma está diseñada para que aprendices, instructores y administrativos del SENA se conecten a través de clubes de interés.</p>
        </div>
      </div>

      <div class="flex space-x-6 items-center">
        <button 
          @click="themeStore.toggleTheme()"
          class="hover:text-[#39A900] focus:outline-none"
        >
          {{ theme === 'light' ? '🌙' : '☀️' }}
        </button>
        <RouterLink to="/signin" class="hover:text-[#39A900]">Sign In</RouterLink>
        <RouterLink
          to="/signup"
          class="bg-[#39A900] text-white px-6 py-3 rounded-xl text-lg hover:bg-[#39A900]"
        >
          Sign Up
        </RouterLink>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 flex flex-1 justify-center items-center p-16 flex-wrap gap-16 text-center">
      <div class="max-w-xl">
        <p class="text-xl text-[#39A900] font-medium mb-2 animate-pulse">
          ¡Forma parte de la comunidad SENA!
        </p>
        <h1 class="text-5xl font-bold text-[#39A900] mb-6">¡Bienvenidos a SenaClub!</h1>
        <p class="text-lg mb-8">
          Explora nuestros clubes y encuentra el ideal para ti. Desde deportes hasta tecnología y finanzas,
          únete a una comunidad que comparte tus intereses.
        </p>
        <RouterLink to="/clubs" class="text-[#3B9D30] hover:text-[#39A900] text-xl underline">
          Explorar Clubes
        </RouterLink>
      </div>

      <!-- IMAGEN -->
      <div class="max-w-md animate-fade-in">
        <img
          src="@/assets/inicio.png.jpeg"
          alt="Imagen de Inicio"
          class="w-full rounded-2xl shadow-2xl"
        />
      </div>
    </main>

    <!-- SECCIÓN NOTIFICACIONES -->
    <section class="relative z-10 px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10" :class="theme === 'light' ? 'bg-white' : 'bg-black'">
      <div
        v-for="(notification, idx) in notifications"
        :key="notification._id || idx"
        class="cursor-pointer p-6 rounded-xl shadow-lg hover:scale-105 transition"
        :class="[ 
          theme === 'light' ? 'bg-green-100 bg-opacity-50' : 'bg-green-900 bg-opacity-10',
          notification.type === 'info' && 'border border-green-400',
          notification.type === 'warning' && 'border border-yellow-400',
          notification.type === 'alert' && 'border border-red-400'
        ]"
      >
        <h3 class="text-xl font-bold mb-2"
            :class="notification.type === 'info'
              ? 'text-green-700'
              : notification.type === 'warning'
                ? 'text-yellow-700'
                : notification.type === 'alert'
                  ? 'text-red-700'
                  : 'text-[#39A900]'">
          {{ notification.title }}
        </h3>
        <p class="mb-2">{{ notification.content }}</p>
        <p class="text-xs text-gray-500 mb-1">
          {{ notification.timestamp }}
          <template v-if="notification.userName">
            &mdash; por {{ notification.userName }}
          </template>
        </p>
        <span v-if="notification.type==='alert'" class="inline-block px-2 py-1 text-xs rounded bg-red-200 text-red-800">Alerta</span>
        <span v-else-if="notification.type==='warning'" class="inline-block px-2 py-1 text-xs rounded bg-yellow-200 text-yellow-800">Advertencia</span>
        <span v-else-if="notification.type==='info'" class="inline-block px-2 py-1 text-xs rounded bg-green-200 text-green-800">Información</span>
      </div>
      <div
        v-if="notifications.length === 0"
        class="col-span-3 text-center text-gray-500"
      >
        No hay notificaciones disponibles en este momento.
      </div>
    </section>

    <!-- SECCIÓN NOTICIAS -->
    <section class="relative z-10 px-12 py-16" :class="theme === 'light' ? 'bg-white' : 'bg-black'">
      <!-- Header con botón de actualización -->
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-green-700 dark:text-green-400">
          Últimas Noticias
          <span v-if="newsItems.length > 0" class="text-sm font-normal text-gray-500 ml-2">
            ({{ newsItems.length }} {{ newsItems.length === 1 ? 'noticia' : 'noticias' }})
          </span>
        </h2>
        
        <button 
          @click="fetchNews"
          :disabled="isLoadingNews"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          :class="[
            theme === 'light' 
              ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' 
              : 'bg-green-900 border-green-700 text-green-300 hover:bg-green-800',
            isLoadingNews ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <svg 
            class="w-4 h-4 transition-transform"
            :class="{ 'animate-spin': isLoadingNews }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ isLoadingNews ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>

      <!-- Loading spinner -->
      <div v-if="isLoadingNews && newsItems.length === 0" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <span class="ml-3 text-green-600 dark:text-green-400">Cargando noticias...</span>
      </div>

      <!-- Grid de noticias -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="(news, idx) in newsItems"
          :key="news._id || idx"
          class="cursor-pointer p-6 rounded-xl shadow-lg hover:scale-105 transition relative"
          :class="theme === 'light' ? 'bg-green-50 bg-opacity-50 border border-green-200' : 'bg-green-900 bg-opacity-10 border border-green-700'"
        >
          <!-- Indicador de noticia nueva -->
          <div 
            v-if="isRecentNews(news.createdAt)"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse"
          >
            ¡NUEVO!
          </div>
          
          <h3 class="text-xl font-bold mb-2 text-green-700 dark:text-green-400">
            {{ news.title }}
          </h3>
          <p class="mb-2 line-clamp-3">{{ news.content }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {{ formatDate(news.createdAt) || 'Fecha desconocida' }}
            <template v-if="news.author">
              &mdash; por {{ news.author }}
            </template>
          </p>
        </div>
        
        <div
          v-if="newsItems.length === 0"
          class="col-span-3 text-center text-gray-500"
        >
          No hay noticias disponibles en este momento.
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="relative z-10 p-12 text-center text-sm" :class="[theme === 'light' ? 'bg-white text-gray-600' : 'bg-black text-gray-500']">
      © 2025 SenaClub - Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const notifications = ref<any[]>([])
const newsItems = ref<any[]>([])
const isLoadingNews = ref(false)
const refreshInterval = ref<NodeJS.Timeout | null>(null)

const API_URL = 'http://localhost:3000/news'

onMounted(async () => {
  // ------------------ NOTIFICACIONES ------------------
  const rawNotifications = localStorage.getItem('persistent_notifications')
  let persistedNotifications: any[] = []
  try {
    persistedNotifications = rawNotifications ? JSON.parse(rawNotifications) : []
  } catch {
    persistedNotifications = []
  }
  notifications.value = persistedNotifications

  // ------------------ NOTICIAS desde API ------------------
  await fetchNews()
  
  // Iniciar auto-refresh cada 60 segundos (1 minuto)
  startAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

const fetchNews = async () => {
  try {
    isLoadingNews.value = true
    
    // Hacer llamada a la API con timestamp para evitar caché
    const response = await fetch(`${API_URL}?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Ordenar las noticias por fecha de creación (más recientes primero)
    const sortedData = data.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA // Orden descendente (más recientes primero)
    })
    
    newsItems.value = sortedData
    
    // También guardar en localStorage como respaldo
    localStorage.setItem('persistent_news', JSON.stringify(sortedData))
    
    console.log('Noticias cargadas desde API (ordenadas por fecha):', sortedData)
    
  } catch (error) {
    console.error('Error al obtener noticias desde API:', error)
    
    // Como fallback, intentar cargar desde localStorage
    const rawNews = localStorage.getItem('persistent_news')
    try {
      const persistedNews = rawNews ? JSON.parse(rawNews) : []
      // También ordenar las noticias del localStorage por si acaso
      const sortedPersistedNews = persistedNews.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      newsItems.value = sortedPersistedNews
      console.log('Cargadas noticias desde localStorage como fallback (ordenadas)')
    } catch {
      newsItems.value = []
      console.log('No se pudieron cargar noticias')
    }
  } finally {
    isLoadingNews.value = false
  }
}

const startAutoRefresh = () => {
  // Auto-refresh cada 60 segundos
  refreshInterval.value = setInterval(() => {
    fetchNews()
  }, 60000)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Fecha desconocida'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Fecha desconocida'
  }
}

const isRecentNews = (dateString: string): boolean => {
  if (!dateString) return false
  
  try {
    const newsDate = new Date(dateString)
    const now = new Date()
    const diffHours = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60)
    
    // Considerar como "nuevo" si tiene menos de 24 horas
    return diffHours < 24
  } catch (error) {
    return false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>