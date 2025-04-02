<template>
  <div class="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
    <!-- Sidebar izquierda - Fondo negro sólido -->
    <div class="w-full md:w-48 lg:w-52 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-gray-800">
      <div class="p-4 flex items-center">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-transparent rounded-full flex items-center justify-center border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <span class="ml-2 font-semibold text-white">SENACLUB</span>
        </div>
      </div>

      <!-- Menú de navegación (News removido) -->
      <nav class="flex-1 mt-4 md:mt-8 px-4">
        <div class="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-3">
          <router-link to="/" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Home</router-link>
          <router-link to="/explore" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Explore</router-link>
          <router-link to="/Profile/notifications" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Notifications</router-link>
          <router-link to="/Profile" class="block py-2 px-4 md:px-6 rounded-full bg-indigo-800 text-center text-white text-sm">Profile</router-link>
          <router-link to="/Profile/posts" class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm">Posts</router-link>
        </div>
      </nav>

      <!-- Perfil del usuario en sidebar - Visible solo en pantallas medianas o mayores -->
      <div class="hidden md:flex p-4 items-center mt-auto">
        <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
        <span class="ml-2 text-sm">Roberta Jimenez</span>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="w-full md:w-3/5 lg:w-2/3 flex flex-col bg-black relative overflow-y-auto">
      <!-- Imagen de fondo en la parte superior - patrón de líneas -->
      <div class="absolute top-0 left-0 right-0 h-36 md:h-52 z-0 overflow-hidden bg-gray-700">
        <img src="" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
      </div>

      <!-- Sección de perfil -->
      <div class="flex flex-col items-center pt-6 md:pt-12 relative z-10 mt-4 md:mt-8">
        <img src="https://i.pravatar.cc/300" alt="Roberta Jimenez" class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white" />
        <h1 class="mt-2 font-medium text-base md:text-lg text-white">Roberta Jimenez</h1>
        <p class="text-gray-400 text-xs md:text-sm">Aprendiz</p>

        <!-- Contador y botón -->
        <div class="flex space-x-4 md:space-x-6 mt-2 md:mt-3">
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">50 Posts</div>
          <div class="px-2 md:px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">30 Saved</div>
        </div>

        <button class="mt-2 md:mt-3 px-4 md:px-5 py-1 border border-gray-600 rounded-full text-xs text-gray-300">
          About me
        </button>

        <p class="mt-2 text-xs text-center max-w-xs px-4 text-gray-400">
          Soy aprendiz de SENA, me gusta el diseño soy lo mejor me gusta el baloncesto me gusta pintar y demás
        </p>
      </div>

      <!-- Navegación de contenido con router-link -->
      <div class="border-b border-gray-800 text-center mt-4">
        <div class="flex justify-center">
          <router-link to="/Profile/posts" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Posts</router-link>
          <router-link to="/Profile/notifications" class="px-4 md:px-8 py-2 text-xs md:text-sm" :class="$route.path === '/Profile/notifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'">Notifications</router-link>
        </div>
      </div>

      <!-- Área para renderizar las vistas (Posts o Notifications) -->
      <router-view></router-view>
    </div>

    <!-- Sidebar derecha - Noticias (implementación completa) -->
    <div class="hidden md:block w-full md:w-2/5 lg:w-1/3 bg-gray-900 border-l border-gray-800 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-gray-800 bg-black">
        <h2 class="text-lg font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/>
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>
          </svg>
          Noticias
        </h2>
      </div>
      
      <!-- Contenedor con scroll para las noticias -->
      <div class="flex-1 overflow-y-auto">
        <!-- Noticias individuales -->
        <div v-for="n in 10" :key="n" class="p-4 border-b border-gray-800 hover:bg-gray-800 transition duration-200">
          <div class="flex">
            <div class="flex-shrink-0 w-16 h-16 bg-gray-800 rounded overflow-hidden">
              <img src="" alt="News Thumbnail" class="w-full h-full object-cover" />
            </div>
            <div class="ml-3 flex-1">
              <p class="font-medium text-sm">Noticia SENA {{n}}: Nueva capacitación disponible</p>
              <p class="text-xs text-gray-400 mt-1">Hace {{n}} horas</p>
              <div class="flex mt-2 space-x-2">
                <span class="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">SENA</span>
                <span class="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">Educación</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botón para cargar más noticias -->
        <div class="p-4 flex justify-center">
          <button class="px-4 py-2 bg-indigo-800 rounded-full text-xs hover:bg-indigo-700 transition duration-200">
            Cargar más noticias
          </button>
        </div>
      </div>
      
      <!-- Footer de la sección de noticias -->
      <div class="p-3 border-t border-gray-800 bg-black">
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">© 2025 SENACLUB News</span>
          <button class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Estilos adicionales */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Personalización de la barra de desplazamiento */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #111827;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>