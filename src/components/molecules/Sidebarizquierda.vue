<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')
</script>

<template>
  <aside
    :class="[
      'md:w-72',
      'md:mt-[4px] flex flex-col justify-between h-screen border-r',
      isDarkMode
        ? 'bg-black text-white border-gray-800'
        : 'bg-white text-green-700 border-gray-200'
    ]"
  >
   
    
<div class="px-4 pt-3 pb-6 flex items-center space-x-3">
  <img
    src="@/assets/logo-del-sena-01.png"
    alt="Logo SENA"
    class="w-10 h-10 object-contain"
  />
  <span
    :class="isDarkMode ? 'text-green-400 text-lg' : 'text-green-600 font-semibold text-lg'"
  >
    SENACLUB
  </span>
</div>


    <!-- Menú de navegación -->
    <nav class="flex-1 mt-[10px] md:mt-[24px] px-4">
      <div class="flex flex-col gap-6 md:gap-5">
        <router-link
          to="/home"
          class="block py-2 px-4 md:px-16 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
          exact
        >
          Home
        </router-link>

        <router-link
          to="/clubs"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
        >
          Clubs
        </router-link>

        <router-link
          to="/Profile/notifications"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
        >
          Notifications
        </router-link>

        <router-link
          to="/Profile"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
        >
          Profile
        </router-link>

        <router-link
          to="/Profile/posts"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
        >
          Posts
        </router-link>

        <router-link
          to="/reportes"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white'"
          active-class="!bg-[#21c25a] !text-white"
        >
          Reportes
        </router-link>
      </div>
    </nav>

    <!-- Usuario abajo -->
    <div class="hidden md:flex p-6 items-center mt-auto">
      <img
        src="@/assets/images/user.jpg"
        alt="Avatar"
        class="w-8 h-8 rounded-full border-2"
        :class="isDarkMode ? 'border-gray-700' : 'border-gray-300'"
      />
      <span
        :class="isDarkMode ? 'ml-2 text-sm text-gray-200' : 'ml-2 text-sm text-gray-600'"
      >
        Usuario
      </span>
    </div>
  </aside>
</template>
