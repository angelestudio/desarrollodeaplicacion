<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.theme === 'dark')
</script>

<template>
  <aside
    :class="[
      'md:mt-[4px] flex flex-col justify-between h-screen border-r',
      isDarkMode
        ? 'bg-black text-white border-gray-800'
        : 'bg-white text-green-700 border-gray-200'
    ]"
  >
    <!-- Logo / título -->
    <div class="px-4 pt-3 pb-6 flex items-center space-x-2">
      <div
        :class="[
          'flex items-center justify-center border-2 rounded-full w-8 h-8',
          isDarkMode ? 'border-green-500' : 'border-green-500'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          :class="isDarkMode ? 'text-green-500' : 'text-green-500'"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
        </svg>
      </div>
      <span :class="isDarkMode ? 'text-green-400' : 'text-green-600 font-semibold text-base'">
        SENACLUB
      </span>
    </div>

    <!-- Menú -->
    <nav class="flex-1 mt-[10px] md:mt-[24px] px-4">
      <div class="flex flex-col gap-6 md:gap-5">
        <router-link
          to="/home"
          class="block py-2 px-4 md:px-16 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
          "
          active-class="!bg-[#21c25a] !text-white"
          exact
        >
          Home
        </router-link>
        <router-link
          to="/clubs"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
          "
          active-class="!bg-[#21c25a] !text-white"
        >
          Clubs
        </router-link>
        <router-link
          to="/Profile/notifications"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
          "
          active-class="!bg-[#21c25a] !text-white"
        >
          Notifications
        </router-link>
        <router-link
          to="/Profile"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
          "
          active-class="!bg-[#21c25a] !text-white"
        >
          Profile
        </router-link>
        <router-link
          to="/Profile/posts"
          class="block py-2 px-4 md:px-6 rounded-full text-center text-sm font-semibold border transition-colors duration-200"
          :class="isDarkMode
            ? 'bg-black border-green-400 text-green-400 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
            : 'bg-white border-green-400 text-green-500 hover:bg-[#21c25a] hover:text-white focus:bg-[#21c25a] focus:text-white'
          "
          active-class="!bg-[#21c25a] !text-white"
        >
          Posts
        </router-link>
      </div>
    </nav>

    <!-- Perfil abajo -->
    <div class="hidden md:flex p-6 items-center mt-auto">
      <img
        src="@/assets/images/user.jpg"
        alt="Avatar"
        class="w-8 h-8 rounded-full border-2"
        :class="isDarkMode ? 'border-gray-700' : 'border-gray-300'"
      />
      <span :class="isDarkMode ? 'ml-2 text-sm text-gray-200' : 'ml-2 text-sm text-gray-600'">Usuario</span>
    </div>
  </aside>
</template>