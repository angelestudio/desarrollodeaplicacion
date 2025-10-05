<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" :class="theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-to-br from-gray-900 to-black'">
    
    <!-- Elementos de fondo minimalistas -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Grid sutil -->
      <div class="absolute inset-0 opacity-5"
           :class="theme === 'light' ? 'bg-green-900' : 'bg-green-400'"
           style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 50px 50px;">
      </div>
      
      <!-- Líneas geométricas elegantes -->
      <svg class="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
          </linearGradient>
        </defs>
        <g class="animate-subtle-float">
          <line x1="0%" y1="30%" x2="100%" y2="70%" stroke="url(#lineGrad)" stroke-width="1"/>
          <line x1="0%" y1="70%" x2="100%" y2="30%" stroke="url(#lineGrad)" stroke-width="1"/>
        </g>
      </svg>
    </div>

    <div class="w-full max-w-lg relative z-10">
      <!-- Header profesional -->
      <div class="text-center mb-12 animate-header-entrance">
        <div class="relative inline-flex items-center justify-center mb-8">
          <!-- Anillo exterior elegante -->
          <div class="absolute w-20 h-20 rounded-full border border-green-500/20 animate-rotate-elegant"></div>
          
          <!-- Logo/Ícono central -->
          <div class="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg animate-icon-subtle">
            <div class="absolute inset-1 rounded-full bg-gradient-to-br from-green-500/30 to-transparent"></div>
            <svg class="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <!-- Título elegante -->
        <h2 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 animate-title-entrance">
          {{ displayedTitle }}
        </h2>
        
        <!-- Línea decorativa profesional -->
        <div class="w-24 h-px bg-gradient-to-r from-transparent via-green-600 to-transparent mx-auto mb-4 animate-line-grow"></div>
        
        <p :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'" class="text-lg font-medium animate-subtitle-fade">
          Accede a tu cuenta SENA
        </p>
      </div>

      <!-- Formulario elegante -->
      <div class="relative backdrop-blur-sm rounded-2xl shadow-2xl border overflow-hidden animate-form-slide"
           :class="theme === 'light' ? 'bg-white/95 border-gray-200/50' : 'bg-gray-900/95 border-gray-700/30'">
        
        <!-- Borde superior verde sutil -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 animate-border-glow"></div>
        
        <div class="p-10">
          <form @submit.prevent="loginUser" class="space-y-6">
            
            <!-- Campo Email profesional -->
            <div class="group text-left animate-field-slide" style="animation-delay: 0.2s;">
              <label for="email" class="block text-sm font-semibold mb-3 transition-colors duration-300" 
                     :class="theme === 'light' ? 'text-gray-700 group-focus-within:text-green-600' : 'text-gray-300 group-focus-within:text-green-400'">
                Correo Electrónico
              </label>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  placeholder="tu@misena.edu.co"
                  class="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 hover:border-green-400/50"
                  :class="theme === 'light' ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50' : 'border-gray-600 bg-gray-800 text-white hover:bg-gray-750'"
                />
                <!-- Indicador de focus sutil -->
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            <!-- Campo Password profesional -->
            <div class="group text-left animate-field-slide" style="animation-delay: 0.3s;">
              <label for="password" class="block text-sm font-semibold mb-3 transition-colors duration-300" 
                     :class="theme === 'light' ? 'text-gray-700 group-focus-within:text-green-600' : 'text-gray-300 group-focus-within:text-green-400'">
                Contraseña
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  placeholder="Ingresa tu contraseña"
                  class="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 hover:border-green-400/50"
                  :class="theme === 'light' ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50' : 'border-gray-600 bg-gray-800 text-white hover:bg-gray-750'"
                />
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>
              
              <!-- Link profesional de olvido -->
              <div class="text-right mt-3">
                <button type="button" @click="showModal = true" 
                        class="text-sm font-medium transition-colors duration-200 hover:underline"
                        :class="theme === 'light' ? 'text-green-600 hover:text-green-700' : 'text-green-400 hover:text-green-300'">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <!-- Campo Admin Code elegante -->
            <div v-if="showAdminCodeField" class="text-left animate-admin-slide">
              <div class="relative p-6 rounded-xl border-2 border-green-500/30 bg-green-50/50 dark:bg-green-900/20">
                <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                
                <label for="adminCode" class="block text-sm font-semibold mb-3" 
                       :class="theme === 'light' ? 'text-green-800' : 'text-green-300'">
                  <span class="inline-flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    Código de Administrador
                  </span>
                </label>
                <input
                  type="password"
                  id="adminCode"
                  v-model="adminCode"
                  placeholder="Ingresa el código de seguridad"
                  class="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 font-mono text-center tracking-wider"
                  :class="theme === 'light' ? 'border-green-300 bg-white text-green-800' : 'border-green-600 bg-gray-800 text-green-200'"
                />
              </div>
            </div>

            <!-- Botón principal elegante -->
            <div class="pt-6 animate-field-slide" style="animation-delay: 0.4s;">
              <button
                type="submit"
                :disabled="isLoading"
                class="relative w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:translate-y-0 group overflow-hidden"
              >
                <!-- Efecto de brillo sutil -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <span class="relative flex items-center justify-center">
                  <svg v-if="!isLoading" class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <div v-else class="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </span>
              </button>
            </div>

            <!-- Link de registro elegante -->
            <div class="text-center mt-8 pt-6 border-t animate-field-slide" 
                 :class="theme === 'light' ? 'border-gray-200' : 'border-gray-700'" 
                 style="animation-delay: 0.5s;">
              <p class="text-sm font-medium" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
                ¿No tienes cuenta en el SENA?
              </p>
              <router-link to="/signup" class="inline-flex items-center mt-2 font-semibold transition-colors duration-200 hover:underline"
                          :class="theme === 'light' ? 'text-green-600 hover:text-green-700' : 'text-green-400 hover:text-green-300'">
                Regístrate aquí
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de recuperación elegante -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-modal-fade"
      @click.self="closeModal"
    >
      <div class="relative rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-slide"
           :class="theme === 'light' ? 'bg-white' : 'bg-gray-900'">
        
        <!-- Header del modal profesional -->
        <div class="relative bg-gradient-to-r from-green-600 to-green-700 p-6">
          <button
            class="absolute top-4 right-4 w-8 h-8 text-white hover:text-gray-200 transition-colors duration-200 rounded-full hover:bg-white/20 flex items-center justify-center"
            @click="closeModal"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white">Recuperar Contraseña</h3>
          </div>
        </div>

        <div class="p-6">
          <p class="mb-6 text-sm" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
          
          <div class="group mb-6">
            <label class="block text-sm font-semibold mb-2" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Correo Electrónico
            </label>
            <input
              type="email"
              v-model="forgotEmail"
              placeholder="tu@misena.edu.co"
              class="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-gray-50 text-gray-900' : 'border-gray-600 bg-gray-800 text-white'"
            />
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
          </div>

          <div class="space-y-3">
            <button
              @click="sendRecoveryEmail"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:cursor-not-allowed"
            >
              <span class="flex items-center justify-center">
                <div v-if="isLoading" class="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ isLoading ? 'Enviando...' : 'Enviar Enlace' }}
              </span>
            </button>
            
            <button
              @click="closeModal"
              class="w-full border-2 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="theme === 'light' ? 'border-gray-300 text-gray-700' : 'border-gray-600 text-gray-300'"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- =============================== 
         NUEVA VENTANA DE BIENVENIDA
         =============================== -->
    <div
      v-if="showWelcomeModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[60] animate-modal-fade"
    >
      <div class="relative w-full max-w-sm mx-4 animate-welcome-entrance">
        <!-- Partículas decorativas -->
        <div class="absolute -inset-4 pointer-events-none">
          <div class="absolute top-0 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-welcome-particles" style="animation-delay: 0.5s;"></div>
          <div class="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-green-300 rounded-full animate-welcome-particles" style="animation-delay: 1s;"></div>
          <div class="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-green-500 rounded-full animate-welcome-particles" style="animation-delay: 1.5s;"></div>
          <div class="absolute bottom-0 right-1/3 w-1 h-1 bg-green-200 rounded-full animate-welcome-particles" style="animation-delay: 2s;"></div>
        </div>

        <!-- Contenedor principal de bienvenida -->
        <div class="relative welcome-gradient rounded-3xl shadow-2xl overflow-hidden animate-welcome-glow">
          <!-- Efecto shimmer en el borde -->
          <div class="absolute inset-0 rounded-3xl animate-welcome-shimmer"></div>
          
          <!-- Contenido -->
          <div class="relative p-8 text-center text-white">
            <!-- Ícono de usuario con animación -->
            <div class="relative inline-block mb-6 animate-welcome-icon">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <!-- Ícono de admin o aprendiz según el rol -->
                  <svg v-if="userRole === 'admin'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Anillo exterior con rotación -->
              <div class="absolute inset-0 border-2 border-white/30 rounded-full animate-rotate-elegant"></div>
            </div>

            <!-- Mensaje de bienvenida -->
            <h2 class="text-2xl font-bold mb-3">
              ¡Bienvenido{{ userRole === 'admin' ? ' Admin' : ' Aprendiz' }}!
            </h2>
            
            <div class="w-16 h-0.5 bg-white/60 mx-auto mb-4"></div>
            
            <p class="text-white/90 text-sm mb-6 leading-relaxed">
              {{ userRole === 'admin' ? 'Has iniciado sesión como administrador del sistema SENA' : 'Has iniciado sesión exitosamente en el sistema SENACLUB' }}
            </p>

            <!-- Botón elegante para continuar -->
            <button
              @click="continueToHome"
              class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30 hover:border-white/50 group"
            >
              <span class="flex items-center justify-center">
                <span class="mr-2">Continuar</span>
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification profesional -->
    <div
      v-if="toastMessage"
      class="fixed bottom-6 right-6 max-w-sm px-6 py-4 rounded-xl shadow-lg border text-sm font-medium z-50 animate-toast-slide"
      :class="[
        toastType === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-700 dark:text-green-200' 
          : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-700 dark:text-red-200'
      ]"
    >
      <div class="flex items-center">
        <div class="mr-3">
          <svg v-if="toastType === 'success'" class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span>{{ toastMessage }}</span>
        
        <!-- Barra de progreso sutil -->
        <div class="absolute bottom-0 left-0 h-0.5 rounded-full animate-toast-progress"
             :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'"
             style="width: 100%;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
const isLoading = ref(false)

// Nuevas variables para la ventana de bienvenida
const showWelcomeModal = ref(false)
const userRole = ref('')

const URLS = import.meta.env.VITE_API_URL

// Efecto de máquina de escribir elegante
const displayedTitle = ref('')
const fullTitle = 'Iniciar Sesión'

const router = useRouter()

onMounted(() => {
  // Animación de escritura más profesional
  let i = 0
  const typeWriter = () => {
    if (i < fullTitle.length) {
      displayedTitle.value += fullTitle.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }
  setTimeout(typeWriter, 600)
})

const showToast = (text: string, type: 'success' | 'error') => {
  toastMessage.value = text
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
    toastType.value = ''
  }, 4000)
}

const closeModal = () => {
  showModal.value = false
  forgotEmail.value = ''
}

// Login con manejo elegante - LÓGICA EXACTAMENTE IGUAL + ventana bienvenida
const loginUser = async () => {
  if (!email.value || !password.value) {
    showToast('Por favor completa todos los campos requeridos', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    const payload: any = {
      email: email.value,
      password: password.value,
    }
    
    if (showAdminCodeField.value && adminCode.value) {
      payload.adminCode = adminCode.value
    }

    const response = await axios.post(`${URLS}/auth/login`, payload)
    const { token, rol, requireAdminCode, message } = response.data

    if (requireAdminCode) {
      showAdminCodeField.value = true
      showToast(message || 'Se requiere código de administrador', 'error')
      isLoading.value = false
      return
    }

    // Éxito - GUARDAMOS EL ROL PARA LA VENTANA DE BIENVENIDA
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Guardamos el rol del usuario para mostrar en la ventana de bienvenida
    userRole.value = rol

    showToast('Inicio de sesión exitoso', 'success')
    
    // Mostramos la ventana de bienvenida después del toast de éxito
    setTimeout(() => {
      isLoading.value = false
      showWelcomeModal.value = true
    }, 1500)

  } catch (error: any) {
    console.error('Error al iniciar sesión:', error)
    const errorMessage = error.response?.data?.message || 'Error de conexión'
    showToast(errorMessage, 'error')
    isLoading.value = false
  }
}

// Nueva función para continuar al home desde la ventana de bienvenida
const continueToHome = () => {
  showWelcomeModal.value = false
  router.push('/SignIn')
}

// Recuperación de contraseña profesional
const sendRecoveryEmail = async () => {
  if (!forgotEmail.value) {
    showToast('Por favor ingresa un correo electrónico válido', 'error')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(forgotEmail.value)) {
    showToast('Formato de correo electrónico inválido', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    await axios.post(`${URLS}/auth/forgot-password`, {
      email: forgotEmail.value
    })
    
    
    showToast('Correo de recuperación enviado exitosamente', 'success')
    closeModal()
    
  } catch (error: any) {
    console.error('Error al enviar correo de recuperación:', error)
    const errorMessage = error.response?.data?.message || 'Error al enviar el correo'
    showToast(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ===============================
   ANIMACIONES PROFESIONALES
   =============================== */

/* Animaciones base elegantes */
@keyframes subtle-float {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes rotate-elegant {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes header-entrance {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes icon-subtle {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 6px 30px rgba(16, 185, 129, 0.3);
  }
}

@keyframes title-entrance {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes line-grow {
  0% {
    width: 0;
  }
  100% {
    width: 6rem;
  }
}

@keyframes subtitle-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes form-slide {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes border-glow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes field-slide {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes admin-slide {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 200px;
  }
}

@keyframes modal-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-slide {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-slide {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* ===============================
   NUEVAS ANIMACIONES PARA BIENVENIDA
   =============================== */

@keyframes welcome-entrance {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  50% {
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes welcome-icon-bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  40%, 43% {
    transform: translate3d(0, -20px, 0) scale(1.1);
  }
  70% {
    transform: translate3d(0, -10px, 0) scale(1.05);
  }
  90% {
    transform: translate3d(0, -2px, 0) scale(1.02);
  }
}

@keyframes welcome-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes welcome-particles {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(0.5);
  }
}

@keyframes welcome-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
  }
}

/* ===============================
   CLASES DE ANIMACIÓN
   =============================== */

.animate-subtle-float {
  animation: subtle-float 6s ease-in-out infinite;
}

.animate-rotate-elegant {
  animation: rotate-elegant 20s linear infinite;
}

.animate-header-entrance {
  animation: header-entrance 1s ease-out;
}

.animate-icon-subtle {
  animation: icon-subtle 4s ease-in-out infinite;
}

.animate-title-entrance {
  animation: title-entrance 1s ease-out 0.3s both;
}

.animate-line-grow {
  animation: line-grow 1.5s ease-out 0.8s both;
}

.animate-subtitle-fade {
  animation: subtitle-fade 1s ease-out 1.2s both;
}

.animate-form-slide {
  animation: form-slide 1s ease-out 0.4s both;
}

.animate-border-glow {
  animation: border-glow 3s ease-in-out infinite;
}

.animate-field-slide {
  animation: field-slide 0.6s ease-out both;
}

.animate-admin-slide {
  animation: admin-slide 0.5s ease-out both;
}

.animate-modal-fade {
  animation: modal-fade 0.3s ease-out;
}

.animate-modal-slide {
  animation: modal-slide 0.4s ease-out;
}

.animate-toast-slide {
  animation: toast-slide 0.4s ease-out;
}

.animate-toast-progress {
  animation: toast-progress 4s linear;
}

/* Nuevas clases para bienvenida */
.animate-welcome-entrance {
  animation: welcome-entrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.animate-welcome-icon {
  animation: welcome-icon-bounce 1.5s ease-out 0.3s both;
}

.animate-welcome-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200% 100%;
  animation: welcome-shimmer 2s infinite;
}

.animate-welcome-particles {
  animation: welcome-particles 2s ease-out infinite;
}

.animate-welcome-glow {
  animation: welcome-glow 2s ease-in-out infinite;
}

.welcome-gradient {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
</style>