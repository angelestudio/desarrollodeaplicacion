<template>
  <div class="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
    <!-- Sidebar izquierda - Fondo negro sólido (ahora más pequeña) -->
    <div class="w-full md:w-1/5 lg:w-1/5 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-gray-800">
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

    <!-- Contenido principal (ahora un poco más amplio) -->
    <div class="w-full md:w-3/5 lg:w-3/5 flex flex-col bg-black relative overflow-y-auto">
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

    <!-- Sidebar derecha - Noticias (ahora con scroll explícito) -->
    <div class="hidden md:block w-full md:w-1/5 lg:w-1/5 bg-black border-l border-gray-800 flex flex-col">
      <!-- Barra de búsqueda -->
      <div class="p-3 border-b border-gray-800">
        <div class="bg-gray-900 rounded-full px-4 py-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input type="text" placeholder="Search" class="bg-transparent border-none w-full ml-2 text-sm focus:outline-none text-gray-300">
        </div>
      </div>
      
      <!-- Contenedor de noticias con scroll explícito -->
      <div class="flex-1 overflow-y-auto h-full">
        <div class="p-4 border border-gray-700 rounded-lg m-4">
          <!-- Encabezado NEWS -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-indigo-500 font-bold">NEWS</h2>
            <div class="grid grid-cols-3 gap-1">
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
              <div class="h-1 w-1 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <p class="text-sm text-gray-400 mb-4">noticias csf</p>
          <hr class="border-gray-700 mb-4">
          
          <!-- Noticia 1 -->
          <div class="bg-gray-200 p-3 mb-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Evento Terraza</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 2 -->
          <div class="bg-gray-200 p-3 mb-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Película Auditorio</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 3 -->
          <div class="bg-gray-200 p-3 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Emprendimiento</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <!-- Noticias adicionales para probar el scroll -->
          <div class="bg-gray-200 p-3 mt-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Seminario Web</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-200 p-3 mt-4 rounded">
            <div class="flex">
              <div class="mr-3">
                <div class="border border-black p-1 w-12 h-12 flex flex-col items-center justify-center">
                  <span class="text-xs font-bold text-black">NEWS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-black font-medium text-sm">Taller</h3>
                <div class="h-px bg-gray-400 my-1"></div>
                <div class="h-px bg-gray-400 my-1"></div>
              </div>
            </div>
          </div>
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