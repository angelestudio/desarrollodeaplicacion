<template>
  <aside class=" bg-black md:mt-[4px] flex flex-col justify-between h-screen">
    <!-- Logo / título -->
    <div class="px-4 pt-3 pb-6 flex items-center space-x-2">
      <div class="flex items-center justify-center border-2 border-white rounded-full w-8 h-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
        </svg>
      </div>
      <span class="text-white font-semibold text-base">SENACLUB</span>
    </div>

    <!-- Menú -->
    <nav class="flex-1 mt-[10px] md:mt-[24px] px-4">
      <div class="flex flex-col gap-6 md:gap-5">
        <router-link
          to="/home"
          class="block py-2 px-4 md:px-16 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
        >
          Home
        </router-link>

        <router-link
          to="/clubs"
          class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
        >
          clubs
        </router-link>

        <router-link
          to="/Profile/news"
          class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
        >
          News
        </router-link>

        <router-link
          to="/Profile/notifications"
          class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
        >
          Notifications
        </router-link>

        <router-link
          to="/Profile"
          class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
        >
          Profile
        </router-link>

        <router-link
          to="/Profile/posts"
          class="block py-2 px-4 md:px-6 rounded-full bg-gray-900 text-center text-white text-sm hover:bg-purple-700 transition-colors duration-200"
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
        class="w-8 h-8 rounded-full border-2 border-gray-700"
      />
      <span class="ml-2 text-sm text-white">Usuario</span>
    </div>
  </aside>
</template>