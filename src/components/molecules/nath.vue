<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-black text-white flex flex-col justify-center items-center px-10">
      <div class="text-center w-3/4">
      <!-- <img :src="logo" alt="Logo" class="w-12 mb-6 mx-auto" /> -->
        <div class="w-12 h-12 bg-green-700 rounded mb-6 mx-auto"></div>
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
          <a href="#" class="text-green-700 text-sm block text-right mt-2" @click.prevent="showModal = true">
            Forgot password?
          </a>
        </div>

        <button
          @click="loginUser"
          class="w-full bg-green-700 hover:bg-indigo-600 text-white font-bold py-2 rounded"
        >
          Sign in
        </button>

        <p class="text-center mt-4 text-gray-400">
          Not a member?
          <router-link to="/signup" class="text-green-700 font-semibold">Start here</router-link>
        </p>
      </div>
    </div>

    <div class="w-1/2 flex justify-center items-center bg-gray-100">
      <div class="w-3/4 h-3/4 bg-gray-300"></div>
    </div>
  </div>

  <!-- Modal para olvidar contraseña -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click.self="showModal = false"
  >
    <div class="bg-white rounded-lg p-6 w-80 relative">
      <button
        class="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        @click="showModal = false"
      >
        &times;
      </button>
      <h3 class="text-xl font-semibold mb-4 text-black">Recuperar contraseña</h3>
      <p class="mb-2 text-black">Ingresa tu correo electrónico:</p>
      <input
        type="email"
        v-model="forgotEmail"
        placeholder="Correo electrónico"
        class="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black"
      />
      <button
        @click="sendRecoveryEmail"
        class="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded"
      >
        Enviar
      </button>
    </div>
  </div>

  <!-- Toast message -->
  <div
    v-if="toastMessage"
    :class="[
      'fixed bottom-6 right-6 px-6 py-4 rounded-md shadow-xl text-white font-semibold z-50',
      toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]"
  >
    <div class="flex items-center">
      <span class="mr-2" v-if="toastType === 'success'">✅</span>
      <span class="mr-2" v-else>❌</span>
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | ''>('')
const showModal = ref(false)
const forgotEmail = ref('')

const router = useRouter()

const showToast = (text: string, type: 'success' | 'error') => {
  toastMessage.value = text
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 3000)
}

const loginUser = async () => {
  console.log('Intentando login...') // Para debugging
  
  if (!email.value || !password.value) {
    showToast('Por favor completa todos los campos', 'error')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      password: password.value
    })

    const { token, rol } = response.data
    
    // Guardar en localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)

    // Configurar axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    showToast('¡Inicio de sesión exitoso!', 'success')
    
    setTimeout(() => { 
      router.push('/home') 
    }, 1000)
    
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error)
    const errorMessage = error.response?.data?.message || 'Error de conexión'
    showToast(errorMessage, 'error')
  }
}

const sendRecoveryEmail = () => {
  if (!forgotEmail.value) {
    showToast('Por favor ingresa un correo válido.', 'error')
    return
  }
  
  showToast('Correo de recuperación enviado.', 'success')
  showModal.value = false
  forgotEmail.value = ''
}
</script>

<style scoped>
/* Estilos básicos sin transiciones complejas */
</style>