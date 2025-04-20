<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-black text-white flex flex-col justify-center items-center px-10">
      <div class="text-center w-3/4">
        <img :src="logo" alt="Logo" class="w-12 mb-6 mx-auto" />
        <h2 class="text-2xl font-bold mb-6">Sign in to your account</h2>

        <div class="mb-4 text-left">
          <label for="email" class="block font-semibold mb-1">Email address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800 text-white"
          />
        </div>

        <div class="mb-6 text-left">
          <label for="password" class="block font-semibold mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800 text-white"
          />
          <a href="#" class="text-indigo-400 text-sm block text-right mt-2">Forgot password?</a>
        </div>

        <button
          @click="loginUser"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded"
        >
          Sign in
        </button>

        <p class="text-center mt-4 text-gray-400">
          Not a member?
          <router-link to="/signup" class="text-indigo-400 font-semibold">Start here</router-link>
        </p>
      </div>
    </div>

    <div class="w-1/2 flex justify-center items-center bg-gray-100">
      <div class="w-3/4 h-3/4 bg-gray-300"></div>
    </div>
  </div>

  <transition name="slide-up">
    <div
      v-if="toastMessage"
      :class="[
        'fixed bottom-6 left-6 md:left-auto md:right-6 px-6 py-4 rounded-md shadow-xl text-white font-semibold z-50',
        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]"
    >
      <div class="flex items-center">
        <span class="mr-2" v-if="toastType === 'success'">🎉</span>
        <span class="mr-2" v-else>🚨</span>
        {{ toastMessage }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import logo from '@/assets/logo.png'

const email = ref('')
const password = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | ''>('')

const router = useRouter()
const showToast = (text: string, type: 'success' | 'error') => {
  toastMessage.value = text
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 3000)
}

interface JwtPayload { sub: string; email: string; rol: string }

const loginUser = async () => {
  try {
    const { data } = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      password: password.value
    })

    const { token, rol } = data
    // 1) Guardar token + rol
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)

    // 2) Configurar Axios para futuras peticiones
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // (opcional) Decodificar si necesitas más info
    const decoded = jwt_decode<JwtPayload>(token)
    console.log('Decoded JWT:', decoded)

    showToast('¡Inicio de sesión exitoso!', 'success')
    setTimeout(() => { router.push('/home') }, 800)
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    showToast('Credenciales incorrectas. Inténtalo de nuevo.', 'error')
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>