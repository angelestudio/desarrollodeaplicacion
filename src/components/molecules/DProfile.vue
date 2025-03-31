<template>
    <div class="flex h-screen bg-black text-white">
      <!-- Sidebar izquierda - Fondo negro sólido -->
      <div class="w-52 bg-black flex flex-col relative">
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
        
        <!-- Menú de navegación -->
        <nav class="flex-1 mt-8 px-4">
          <div class="space-y-3">
            <a href="#" class="block py-2 px-6 rounded-full bg-gray-900 text-center text-white">Home</a>
            <a href="#" class="block py-2 px-6 rounded-full bg-gray-900 text-center text-white">Explore</a>
            <a href="#" class="block py-2 px-6 rounded-full bg-indigo-800 text-center text-white">News</a>
            <a href="#" class="block py-2 px-6 rounded-full bg-indigo-800 text-center text-white">Notifications</a>
            <a href="#" class="block py-2 px-6 rounded-full bg-indigo-800 text-center text-white">Profile</a>
            <a href="#" class="block py-2 px-6 rounded-full bg-gray-900 text-center text-white">Posts</a>
          </div>
        </nav>
        
        <!-- Perfil del usuario en sidebar -->
        <div class="p-4 flex items-center mt-auto">
          <img src="https://i.pravatar.cc/300" alt="User" class="w-8 h-8 rounded-full" />
          <span class="ml-2">Roberta Jimenez</span>
        </div>
      </div>
      
      <!-- Contenido principal -->
      <div class="w-1/2 flex flex-col bg-black relative">
        <!-- Imagen de fondo en la parte superior - patrón de líneas -->
        <div class="absolute top-0 left-0 right-0 h-52 z-0 overflow-hidden bg-gray-700">
          <img src="" alt="Background Pattern" class="w-full h-full object-cover" style="filter: brightness(0.5) grayscale(0.5);" />
        </div>
        
        <!-- Sección de perfil -->
        <div class="flex flex-col items-center pt-12 relative z-10 mt-8">
          <img src="https://i.pravatar.cc/300" alt="Roberta Jimenez" class="w-20 h-20 rounded-full border-2 border-white" />
          <h1 class="mt-2 font-medium text-lg text-white">Roberta Jimenez</h1>
          <p class="text-gray-400 text-sm">Aprendiz</p>
          
          <!-- Contador y botón -->
          <div class="flex space-x-6 mt-3">
            <div class="px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">50 Posts</div>
            <div class="px-3 py-1 bg-transparent border border-gray-700 rounded-full text-xs">30 Saved</div>
          </div>
          
          <button class="mt-3 px-5 py-1 border border-gray-600 rounded-full text-xs text-gray-300">
            About me
          </button>
          
          <p class="mt-2 text-xs text-center max-w-xs px-4 text-gray-400">
            Soy aprendiz de SENA, me gusta el diseño soy lo mejor me gusta el baloncesto me gusta pintar y demás
          </p>
        </div>
        
        <!-- Navegación de contenido -->
        <div class="border-b border-gray-800 text-center mt-4">
          <div class="flex justify-center">
            <button class="px-8 py-2 text-gray-400">Posts</button>
            <button class="px-8 py-2 border-b-2 border-blue-500 text-blue-500">Notifications</button>
          </div>
        </div>
        
        <!-- Feed de notificaciones -->
        <div class="flex-1 overflow-y-auto">
          <!-- Notification 1 -->
          <div class="border-b border-gray-800 p-4">
            <div class="flex">
              <img src="https://i.pravatar.cc/300?img=5" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-3 flex-1">
                <div class="font-medium text-sm">Tania Rodriguez</div>
                <div class="text-gray-500 mt-2">
                  <div class="w-full h-2 bg-gray-800 rounded mb-2"></div>
                  <div class="w-5/6 h-2 bg-gray-800 rounded mb-2"></div>
                  <div class="w-4/6 h-2 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Notification 2 -->
          <div class="border-b border-gray-800 p-4">
            <div class="flex">
              <img src="https://i.pravatar.cc/300?img=12" alt="User" class="w-8 h-8 rounded-full" />
              <div class="ml-3 flex-1">
                <div class="font-medium text-sm">Camilo Sanchez</div>
                <div class="text-gray-500 mt-2">
                  <div class="w-full h-2 bg-gray-800 rounded mb-2"></div>
                  <div class="w-3/6 h-2 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar derecha - Noticias -->
      <div class="w-64 bg-black border-l border-gray-800">
        <!-- Search -->
        <div class="p-4 flex justify-end">
          <div class="relative w-full max-w-xs">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </span>
            <input type="text" placeholder="Search" class="w-full bg-gray-900 rounded-full py-1 pl-8 pr-4 text-xs" />
          </div>
        </div>
        
        <div class="p-4">
          <div class="text-blue-500 font-semibold text-sm mb-1">NEWS</div>
          <div class="text-gray-500 text-xs mb-6">noticias.cat</div>
          
          <!-- Patrón de puntos -->
          <div class="absolute right-0 top-20 w-24 h-24 opacity-30">
            <div class="grid grid-cols-6 gap-2">
              <div v-for="i in 30" :key="i" class="w-1 h-1 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <!-- Noticia 1 -->
          <div class="mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">Evento Terraza</div>
                <div class="text-xs text-gray-500 mt-1">
                  <div class="w-20 h-1 bg-gray-700 rounded"></div>
                  <div class="w-16 h-1 bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 2 -->
          <div class="mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">Película Auditorio</div>
                <div class="text-xs text-gray-500 mt-1">
                  <div class="w-20 h-1 bg-gray-700 rounded"></div>
                  <div class="w-16 h-1 bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Noticia 3 -->
          <div class="mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <div class="font-medium text-sm">Emprendimiento</div>
                <div class="text-xs text-gray-500 mt-1">
                  <div class="w-20 h-1 bg-gray-700 rounded"></div>
                  <div class="w-16 h-1 bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Componente configurado con script setup
  </script>
  
  <style>
  /* Estilos adicionales si son necesarios */
  </style>