<template>

  <aside class="w-52 bg-black flex flex-col justify-between h-screen">
    <!-- Logo / título -->
    <div class="px-2 pt-3 pb-6 flex items-center space-x-2">
      <div class="mt-[2px] ml-[6px] flex items-center justify-center border-2 border-white rounded-full w-[32px] h-[32px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
        </svg>
      </div>
      <span class="mt-[2px] text-white font-semibold text-[16px]">SENACLUB</span>

   
</div>

    <!-- Menú -->
    <nav class="flex-1 pl-[17px] pr-3 mt-[24px] space-y-[20px]">
      <router-link
        to="/home"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200"
      >
        Home
      </router-link>

      <a
        @click="$emit('explore')"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white cursor-pointer transition-colors duration-200"
      >
        Explore
      </a>

      <router-link
        to="/Profile/news"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200"
      >
        News
      </router-link>

      <router-link
        to="/Profile/notifications"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200"
      >
        Notifications
      </router-link>

      <router-link
        to="/Profile"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200"
      >
        Profile
      </router-link>

      <router-link
        to="/Profile/posts"
        class="block w-full py-2 text-center text-sm font-medium rounded-full bg-gray-900 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200"
      >
        Posts
      </router-link>
    </nav>

    <!-- Perfil abajo -->
    <div class="px-3 pb-6 flex items-center space-x-2">
      <img
        src="https://i.pravatar.cc/300"
        alt="Avatar"
        class="w-10 h-10 rounded-full border-2 border-gray-700"
      />
      <span class="text-white text-sm">Usuario</span>
    </div>
  </aside>
</template>