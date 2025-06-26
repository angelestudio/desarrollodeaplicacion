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

    <!-- FOOTER -->
    <footer class="relative z-10 p-12 text-center text-sm" :class="[theme === 'light' ? 'bg-white text-gray-600' : 'bg-black text-gray-500']">
      © 2025 SenaClub - Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const notifications = ref<any[]>([])

onMounted(() => {
  // Intenta cargar notificaciones de localStorage (persistentes)
  const raw = localStorage.getItem('persistent_notifications')
  let persisted: any[] = []
  try {
    persisted = raw ? JSON.parse(raw) : []
  } catch { persisted = [] }

  // Carga también las globales si existen (ejemplo, puedes incluir fetch de backend aquí si lo necesitas)
  // Aquí solo usamos las persistidas para la demo
  notifications.value = persisted
})
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