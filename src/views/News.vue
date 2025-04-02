<template>
    <div class="w-full bg-black border-t md:border-t-0 md:border-l border-gray-800">
      <!-- Search -->
      <div class="p-3 md:p-4 flex justify-end">
        <div class="relative w-full">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </span>
          <input type="text" placeholder="Search" class="w-full bg-gray-900 rounded-full py-1 pl-8 pr-4 text-xs" />
        </div>
      </div>
  
      <div class="p-3 md:p-4">
        <div class="text-blue-500 font-semibold text-xs md:text-sm mb-1">NEWS</div>
        <div class="text-gray-500 text-xs mb-4 md:mb-6">noticias.cat</div>
  
        <!-- Noticia 1 -->
        <div class="mb-3 md:mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-2 md:p-3">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="font-medium text-xs md:text-sm">Evento Terraza</div>
              <div class="text-xs text-gray-500 mt-1">
                <div class="w-16 md:w-20 h-1 bg-gray-700 rounded"></div>
                <div class="w-12 md:w-16 h-1 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Noticia 2 -->
        <div class="mb-3 md:mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-2 md:p-3">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="font-medium text-xs md:text-sm">Película Auditorio</div>
              <div class="text-xs text-gray-500 mt-1">
                <div class="w-16 md:w-20 h-1 bg-gray-700 rounded"></div>
                <div class="w-12 md:w-16 h-1 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Noticia 3 -->
        <div class="mb-3 md:mb-6 bg-gray-900 bg-opacity-70 rounded-lg p-2 md:p-3">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="font-medium text-xs md:text-sm">Emprendimiento</div>
              <div class="text-xs text-gray-500 mt-1">
                <div class="w-16 md:w-20 h-1 bg-gray-700 rounded"></div>
                <div class="w-12 md:w-16 h-1 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>