<!-- LoginView.vue -->
<template>
  <div class="flex h-screen">
    <!-- Sección izquierda: formulario -->
    <div class="w-1/2 bg-black text-white flex flex-col justify-center items-center px-10">
      <div class="text-center w-3/4">
        <img :src="logo" alt="Logo" class="w-12 mb-6 mx-auto" />
        <h2 class="text-2xl font-bold mb-6">Sign in to your account</h2>

        <div class="mb-4 text-left">
          <miTextInputAtom
            v-model="formData.email"
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-6 text-left">
          <miTextInputAtom
            v-model="formData.password"
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
          />
          <RouterLink
            to="/actualizar-contrasena"
            class="text-indigo-400 text-sm block text-right mt-2"
          >
            Forgot password?
          </RouterLink>
        </div>

        <miButtonAtom
          @click="handleLogin"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded"
        >
          Iniciar sesión
        </miButtonAtom>

        <p class="text-center mt-4 text-gray-400">
          ¿No tienes una cuenta?
          <RouterLink to="/natinfluencer" class="text-indigo-400 font-semibold">
            Regístrate aquí
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Sección derecha -->
    <div class="w-1/2 flex justify-center items-center bg-gray-100">
      <div class="w-3/4 h-3/4 bg-gray-300 rounded-lg shadow-md"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/milogin';
import miTextInputAtom from '@/components/atoms/miTextInputAtom.vue';
import miButtonAtom from '@/components/atoms/miButtonAtom.vue';
import logo from '@/assets/logo.png';  // <-- Importa el logo correctamente

const router = useRouter();
const store = useLoginStore();

const formData = reactive({ email: '', password: '' });

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    alert('Por favor completa todos los campos');
    return;
  }
  try {
    const userData = await store.loginUser(formData);
    console.log('Usuario logueado:', userData);
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error en el login:', error);
    alert('Error al iniciar sesión, revisa la consola.');
  }
};
</script>
