<!-- ResetPassword.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
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
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Actualizando...' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const newPassword = ref('');
const confirmPassword = ref('');
const router = useRouter();
const route = useRoute();

const API_URL = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const error = ref('');

// Validar que la URL de la API esté configurada
if (!API_URL) {
  console.error('La variable de entorno VITE_API_URL no está configurada');
  error.value = 'Error de configuración del servidor';
}

const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    alert('La contraseña debe tener al menos 8 caracteres');
    return false;
  }
  if (!hasUpperCase || !hasLowerCase) {
    alert('La contraseña debe contener mayúsculas y minúsculas');
    return false;
  }
  if (!hasNumbers) {
    alert('La contraseña debe contener al menos un número');
    return false;
  }
  if (!hasSpecialChar) {
    alert('La contraseña debe contener al menos un carácter especial');
    return false;
  }
  return true;
};

const handleUpdate = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (!validatePassword(newPassword.value)) {
    return;
  }

  const token = route.query.token as string;
  if (!token) {
    alert('Token no encontrado en la URL');
    return;
  }

  isLoading.value = true;
  try {
    if (!API_URL) throw new Error('URL de API no configurada');
    
    await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword: newPassword.value,
    });

    alert('Contraseña actualizada correctamente');
    router.push('/acceder');
  } catch (error: any) {
    console.error('Error actualizando la contraseña:', error);
    alert(error.response?.data?.message || 'Error al actualizar la contraseña');
  } finally {
    isLoading.value = false;
  }
};
</script>
