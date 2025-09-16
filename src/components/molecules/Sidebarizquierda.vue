<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getUserFromToken } from '@/composables/useAuth'
import type { JwtPayload as UserJwtPayload } from '@/composables/useAuth'
import { useRoute } from 'vue-router'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')
const currentUser = ref<UserJwtPayload | null>(null)
const route = useRoute()
onMounted(() => {
  currentUser.value = getUserFromToken()
})

const getUserDisplayName = (): string => {
  if (!currentUser.value) return 'Usuario'
  
  const firstName = currentUser.value.firstName || ''
  const lastName = currentUser.value.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  }
  
  return 'Usuario'
}

const getUserInitials = (): string => {
  if (!currentUser.value) return 'U'
  
  const firstName = currentUser.value.firstName || ''
  const lastName = currentUser.value.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  } else if (firstName) {
    return firstName.substring(0, 2).toUpperCase()
  } else if (lastName) {
    return lastName.substring(0, 2).toUpperCase()
  }
  
  return 'U'
}

const menuItems = [
  { 
    name: 'Home', 
    path: '/home', 
    icon: '🏠',
    badge: null,
    gradient: 'from-green-400 to-green-600'
  },
  { 
    name: 'Clubs', 
    path: '/clubs', 
    icon: '👥',
    badge: null,
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    name: 'Notifications', 
    path: '/Profile/notifications', 
    icon: '🔔',
    badge: null,
    gradient: 'from-yellow-400 to-orange-500'
  },
  { 
    name: 'Profile', 
    path: '/Profile', 
    icon: '👤',
    badge: null,
    gradient: 'from-purple-400 to-purple-600'
  },
  { 
    name: 'Posts', 
    path: '/Profile/posts', 
    icon: '📝',
    badge: null,
    gradient: 'from-pink-400 to-pink-600'
  },
  { 
    name: 'Reportes', 
    path: '/reportes', 
    icon: '📊',
    badge: null,
    gradient: 'from-red-400 to-red-600'
  }
]

const isActiveRoute = (path: string): boolean => {
  return route.path === path || (path === '/home' && route.path === '/')
}
</script>


<template>
  <aside
    :class="[
      'w-64 md:w-80 flex flex-col justify-between h-screen border-r relative overflow-hidden',
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white border-gray-800'
        : 'bg-gradient-to-b from-white via-gray-50 to-white text-green-700 border-gray-200'
    ]"
    style="min-width: 320px;"
  >
    <!-- Fondo decorativo animado -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="floating-particle particle-1"></div>
      <div class="floating-particle particle-2"></div>
      <div class="floating-particle particle-3"></div>
    </div>

    <!-- Header con Logo -->
    <div class="relative z-10">
      <div class="px-4 pt-6 pb-6 flex items-center space-x-3">
        <div class="relative group">
          <img
            src="@/assets/logo-del-sena-01.png"
            alt="Logo SENA"
            class="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          />
          <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
        </div>
        <div class="transition-all duration-300">
          <span
            :class="[
              'text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300',
              isDarkMode 
                ? 'from-green-400 to-green-300' 
                : 'from-green-600 to-green-800'
            ]"
          >
            SENACLUB
          </span>
          <div class="w-16 h-0.5 bg-gradient-to-r from-green-400 to-transparent mt-1"></div>
        </div>
      </div>
    </div>

    <!-- Menú de navegación mejorado -->
    <nav class="flex-1 px-4 pb-4 relative z-10">
      <div class="space-y-3">
        <div v-for="item in menuItems" :key="item.path" class="group">
          <router-link
            :to="item.path"
            class="relative flex items-center p-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 overflow-hidden group"
            :class="[
              isActiveRoute(item.path) 
                ? isDarkMode
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                : isDarkMode
                  ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-green-500/50'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-green-600 border border-gray-200 hover:border-green-300 hover:shadow-md'
            ]"
          >
            <!-- Efecto de brillo en hover -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <!-- Icono con gradiente -->
            <div class="relative flex items-center justify-center w-8 h-8 rounded-xl mr-3 transition-all duration-300"
                 :class="isActiveRoute(item.path) ? 'bg-white/20' : 'group-hover:scale-110'">
              <span class="text-lg" :class="{ 'animate-pulse': isActiveRoute(item.path) }">
                {{ item.icon }}
              </span>
            </div>
            
            <!-- Texto del menú -->
            <div class="flex items-center justify-between flex-1 transition-all duration-300">
              <span class="font-semibold tracking-wide">{{ item.name }}</span>
              
              <!-- Badge de notificaciones -->
              <div v-if="item.badge" 
                   class="flex items-center justify-center w-6 h-6 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full animate-bounce">
                {{ item.badge }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Perfil de Usuario Elegante Horizontal -->
    <div class="relative z-10 p-4 border-t border-opacity-20" 
         :class="isDarkMode ? 'border-gray-700' : 'border-gray-300'">
      <div class="flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
           :class="isDarkMode 
             ? 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50' 
             : 'bg-gray-50/50 hover:bg-white border border-gray-200 hover:shadow-lg'">
        
        <!-- Avatar elegante con efectos -->
        <div class="relative">
          <div v-if="currentUser" 
               class="w-14 h-14 rounded-2xl border-3 flex items-center justify-center text-lg font-black bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
               :class="isDarkMode ? 'border-gray-600' : 'border-white'">
            {{ getUserInitials() }}
          </div>
          <img
            v-else
            src="@/assets/images/user.jpg"
            alt="Avatar"
            class="w-14 h-14 rounded-2xl border-3 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            :class="isDarkMode ? 'border-gray-600' : 'border-white'"
          />
          
          <!-- Status online indicator sofisticado -->
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg"
               :class="isDarkMode ? 'border-gray-800' : 'border-white'">
            <div class="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <!-- Glow effect -->
          <div class="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
        </div>
        
        <!-- Info del usuario horizontal -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <h3 class="text-base font-bold truncate transition-colors duration-300"
                :class="[
                  isDarkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900',
                ]">
              {{ getUserDisplayName() }}
            </h3>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span v-if="currentUser && currentUser.rol"
                  class="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold shadow-sm">
              {{ currentUser.rol }}
            </span>
            <span class="text-xs opacity-60 font-medium">En línea</span>
          </div>
        </div>

        <!-- Indicador de perfil activo -->
        <div class="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-30 group-hover:opacity-100 transition-all duration-300"></div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.floating-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 10s linear infinite;
}

.particle-1 {
  background: #22c55e;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  background: #16a34a;
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.particle-3 {
  background: #15803d;
  bottom: 30%;
  left: 20%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.6;
  }
  66% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.9;
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #22c55e, #16a34a);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #16a34a, #15803d);
}
</style>