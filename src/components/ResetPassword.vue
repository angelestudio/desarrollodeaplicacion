<!-- UpdatePasswordView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Restablecer contraseña</h2>
      
      <form @submit.prevent="handleUpdate" class="space-y-5">
        <div>
          <input
            type="password"
            v-model="newPassword"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="Ingrese su nueva contraseña"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            v-model="confirmPassword"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
        
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Cambiar contraseña
        </button>
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