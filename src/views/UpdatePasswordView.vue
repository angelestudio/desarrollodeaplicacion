<!-- UpdatePasswordView.vue -->
<template>
    <div class="p-8 max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">Actualizar Contraseña</h2>
      <form @submit.prevent="handleUpdate">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Nueva Contraseña</label>
          <input
            type="password"
            v-model="newPassword"
            class="w-full border p-2 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Confirmar Contraseña</label>
          <input
            type="password"
            v-model="confirmPassword"
            class="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
        >
          Actualizar Contraseña
        </button>
      </form>
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