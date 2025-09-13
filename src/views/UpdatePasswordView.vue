<!-- UpdatePasswordView.vue -->

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-100">
      <!-- Header con ícono -->
      <div class="text-center mb-8">
        <div class="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Actualizar Contraseña</h2>
        <p class="text-gray-600 text-sm">Ingresa tu nueva contraseña de forma segura</p>
      </div>


  <form @submit.prevent="handleUpdate" class="space-y-6">
    <!-- Campo Nueva Contraseña -->
    <div class="group">
      <label class="block text-gray-700 text-sm font-medium mb-2 transition-colors group-focus-within:text-green-600">
        Nueva Contraseña
      </label>
      <div class="relative">
        <input
          type="password"
          v-model="newPassword"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
          placeholder="Ingresa tu nueva contraseña"
          required
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Campo Confirmar Contraseña -->
    <div class="group">
      <label class="block text-gray-700 text-sm font-medium mb-2 transition-colors group-focus-within:text-green-600">
        Confirmar Contraseña
      </label>
      <div class="relative">
        <input
          type="password"
          v-model="confirmPassword"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
          placeholder="Confirma tu nueva contraseña"
          required
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Botón de actualizar -->
    <button
      type="submit"
      class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
    >
      <span class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Actualizar Contraseña
      </span>
    </button>

    <!-- Indicador de seguridad -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <div>
          <p class="text-sm font-medium text-green-800">Seguridad</p>
          <p class="text-xs text-green-700 mt-1">Tu contraseña será encriptada y almacenada de forma segura</p>
        </div>
      </div>
    </div>
  </form>
</div>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/milogin';

const newPassword = ref('');
const confirmPassword = ref('');
const router = useRouter();
const store = useLoginStore();

const handleUpdate = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden');
    return;
  }
  try {
    await store.updatePassword(newPassword.value);
    alert('Contraseña actualizada correctamente');
    router.push('/acceder');
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    alert('Error al actualizar la contraseña');
  }
};
</script>