<template>
    <div class="flex-1 overflow-y-auto">
      <!-- Notificación 1 -->
      <div class="border-b border-gray-800 p-3 md:p-4">
        <div class="flex">
          <img src="https://i.pravatar.cc/300?img=5" alt="User" class="w-8 h-8 rounded-full" />
          <div class="ml-3 flex-1">
            <div class="font-medium text-xs md:text-sm">Tania Rodriguez</div>
            <div class="text-gray-500 mt-2">
              <div class="w-full h-2 bg-gray-800 rounded mb-2"></div>
              <div class="w-5/6 h-2 bg-gray-800 rounded mb-2"></div>
              <div class="w-4/6 h-2 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Notificación 2 -->
      <div class="border-b border-gray-800 p-3 md:p-4">
        <div class="flex">
          <img src="https://i.pravatar.cc/300?img=12" alt="User" class="w-8 h-8 rounded-full" />
          <div class="ml-3 flex-1">
            <div class="font-medium text-xs md:text-sm">Camilo Sanchez</div>
            <div class="text-gray-500 mt-2">
              <div class="w-full h-2 bg-gray-800 rounded mb-2"></div>
              <div class="w-3/6 h-2 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // En tu <script setup>
import { ref, computed, onMounted } from 'vue';
import { getUserFromToken } from '@/composables/useAuth';

// Variable para controlar si el usuario es admin
const isAdmin = ref(false);

onMounted(() => {
  const currentUser = getUserFromToken();
  if (currentUser && currentUser.rol === 'admin') {
    isAdmin.value = true;
  }
});
  </script>