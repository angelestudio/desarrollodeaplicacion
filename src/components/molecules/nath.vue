<template>
  <div class="min-h-screen flex items-center justify-center p-4" :class="theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-to-br from-gray-900 to-black'">
    <div class="w-full max-w-md">
      <div class="text-center mb-10 animate-slideDown">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
          Iniciar Sesión
        </h2>
        <p :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'" class="mt-2">
          Accede a tu cuenta
        </p>
      </div>

      <div class="backdrop-blur-sm rounded-2xl shadow-2xl p-8 border animate-slideUp"
           :class="theme === 'light' ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-gray-700'">
        <form @submit.prevent="loginUser" class="space-y-6">
          <div class="mb-4 text-left">
            <label for="email" class="block font-semibold mb-2" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Tu correo electrónico"
              class="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black hover:border-gray-400' : 'border-gray-600 bg-gray-800 text-white hover:border-gray-500'"
            />
          </div>
          <div class="mb-6 text-left">
            <label for="password" class="block font-semibold mb-2" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Tu contraseña"
              class="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black hover:border-gray-400' : 'border-gray-600 bg-gray-800 text-white hover:border-gray-500'"
            />
            
          </div>

          <div v-if="showAdminCodeField" class="mb-6 text-left animate-slideDown">
            <label for="adminCode" class="block font-semibold mb-2" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Código de Administrador
            </label>
            <input
              type="password"
              id="adminCode"
              v-model="adminCode"
              placeholder="Ingresa el código secreto"
              class="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black hover:border-gray-400' : 'border-gray-600 bg-gray-800 text-white hover:border-gray-500'"
            />
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </span>
            </button>
          </div>

          <p class="text-center mt-4 animate-fadeIn" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            ¿No eres miembro?
            <router-link to="/signup" class="text-green-500 hover:text-green-600 font-semibold hover:underline ml-1 transition-colors duration-200">
              Regístrate aquí
            </router-link>
          </p>
        </form>
      </div>
    </div>

    <!-- Modal de Recuperación de Contraseña -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      @click.self="showModal = false"
    >
      <div class="relative rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-scaleIn"
           :class="theme === 'light' ? 'bg-white' : 'bg-gray-900'">
        <button
          class="absolute top-3 right-4 hover:text-gray-900 text-3xl font-bold transition-colors duration-200"
          :class="theme === 'light' ? 'text-gray-600' : 'text-gray-300'"
          @click="showModal = false"
        >
          &times;
        </button>
        <h3 class="text-2xl font-bold mb-4" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">Recuperar Contraseña</h3>
        <p class="mb-4" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Ingresa tu correo electrónico para recibir un enlace de recuperación:</p>
        <input
          type="email"
          v-model="forgotEmail"
          placeholder="tu@email.com"
          class="w-full border-2 rounded-xl px-4 py-3 mb-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          :class="theme === 'light' ? 'border-gray-300 text-black bg-white hover:border-gray-400' : 'border-gray-600 text-white bg-gray-700 hover:border-gray-500'"
        />
        <button
          @click="sendRecoveryEmail"
          class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Enviar Enlace
        </button>
      </div>
    </div>

    <!-- Modal de Bienvenida -->
    <div
      v-if="showWelcomeModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div class="relative rounded-3xl shadow-2xl w-full max-w-lg p-10 mx-4 animate-bounceIn"
           :class="theme === 'light' ? 'bg-white' : 'bg-gray-900'">
        <!-- Icono del usuario según el rol -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg animate-pulse"
               :class="userRole === 'admin' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-green-500 to-green-600'">
            <!-- Icono de Admin -->
            <svg v-if="userRole === 'admin'" class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <!-- Icono de Aprendiz -->
            <svg v-else class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <!-- Mensaje de bienvenida personalizado -->
          <h2 class="text-4xl font-bold mb-3" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
            ¡Bienvenido {{ userRole === 'admin' ? 'Administrador' : 'Aprendiz' }}!
          </h2>
          
          <p class="text-lg mb-6" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            {{ userRole === 'admin' ? 'Tienes acceso para crear noticias, notificaciones, posts y clubs. ¡Disfrútalo!' : 'Puedes crear posts y expresar tus ideas en cada club. ¡Comparte tu conocimiento!' }}
          </p>

          <!-- Badges decorativos -->
          <div class="flex justify-center mb-8">
            <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                  :class="userRole === 'admin' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
              <span class="w-2 h-2 rounded-full mr-2"
                    :class="userRole === 'admin' ? 'bg-green-500' : 'bg-green-500'"></span>
              {{ userRole === 'admin' ? 'Privilegios de Administrador' : 'Modo Aprendizaje' }}
            </span>
          </div>

          <!-- Botón para continuar -->
          <button
            @click="closeWelcomeModal"
            class="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2"
            :class="userRole === 'admin' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500'"
          >
            <span class="mr-2">Continuar</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de notificaciones -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const email = ref('')
const password = ref('')
const adminCode = ref('')
const showAdminCodeField = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | ''>('')
const showModal = ref(false)
const forgotEmail = ref('')
const showWelcomeModal = ref(false)
const userRole = ref('')

const router = useRouter()

const showToast = (text: string, type: 'success' | 'error') => {
  toastMessage.value = text
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 3000)
}

// Función para cerrar el modal de bienvenida y redirigir
const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  setTimeout(() => {
    router.push('/home')
  }, 300)
}

// El campo de código de admin solo se muestra si el backend lo pide
const loginUser = async () => {
  if (!email.value || !password.value) {
    showToast('Por favor completa todos los campos', 'error')
    return
  }
  try {
    const payload: any = {
      email: email.value,
      password: password.value,
    }
    // Si el campo es visible y hay código, lo incluimos
    if (showAdminCodeField.value && adminCode.value) {
      payload.adminCode = adminCode.value
    }

    const response = await axios.post('http://localhost:3000/auth/login', payload)
    const { token, rol, requireAdminCode, message } = response.data

    // Si el backend pide el código de admin
    if (requireAdminCode) {
      showAdminCodeField.value = true
      showToast(message || 'Debes ingresar el código de administrador', 'error')
      return
    }

    // Éxito
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Guardar el rol para el modal de bienvenida
    userRole.value = rol

    showToast('¡Inicio de sesión exitoso!', 'success')
    
    // Mostrar modal de bienvenida después de un breve delay
    setTimeout(() => {
      showWelcomeModal.value = true
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
  // Aquí iría la lógica real para enviar el correo de recuperación
  showToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.', 'success')
  showModal.value = false
  forgotEmail.value = ''
}
</script>

<style scoped>
/* Animaciones para una entrada más suave */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out;
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

.animate-bounceIn {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Estilos para hover y focus de inputs */
input:hover {
  @apply border-gray-400 dark:border-gray-500;
}

input:focus {
  @apply ring-2 ring-green-500 border-green-500;
}
</style>