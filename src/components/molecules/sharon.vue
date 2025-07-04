<template>
  <div class="min-h-screen flex items-center justify-center p-6" :class="theme === 'light' ? 'bg-gradient-to-br from-green-50 to-gray-100' : 'bg-gradient-to-br from-gray-900 to-black'">
    <!-- Contenedor principal optimizado para pantalla completa -->
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      
      <!-- Sección izquierda - Información -->
      <div class="text-center lg:text-left space-y-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-6 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
          Únete a Nosotros
        </h1>
        <p class="text-lg" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
          Crea tu cuenta y accede a nuestra plataforma de clubs y aprendizaje
        </p>
        <div class="hidden lg:block space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Acceso a múltiples clubs</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Comunidad de aprendizaje</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">Herramientas educativas</span>
          </div>
        </div>
      </div>

      <!-- Sección derecha - Formulario -->
      <div class="backdrop-blur-sm rounded-2xl shadow-2xl p-6 border" 
           :class="theme === 'light' ? 'bg-white/95 border-gray-200' : 'bg-gray-900/95 border-gray-700'">
        
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
            Crear Cuenta
          </h2>
        </div>
        
        <form @submit.prevent="initiateVerification" class="space-y-4">
          <!-- Nombre y apellido -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Nombre
              </label>
              <input 
                id="firstName" 
                v-model="form.firstName" 
                placeholder="Tu nombre" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Apellido
              </label>
              <input 
                id="lastName" 
                v-model="form.lastName" 
                placeholder="Tu apellido" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Rol
            </label>
            <select 
              id="rol" 
              v-model="form.rol"
              required
              class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
            >
              <option disabled value="">-- Selecciona tu rol --</option>
              <option value="user">Aprendiz</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- Código admin -->
          <div v-if="form.rol === 'admin'" class="animate-slideDown">
            <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Código de Administrador
            </label>
            <input 
              id="adminCode" 
              v-model="form.adminCode" 
              type="password"
              placeholder="Código secreto" 
              class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
            />
          </div>

          <!-- Selección de clubs -->
          <div ref="clubsContainer" class="relative">
            <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
              Clubs de Interés
            </label>
            <div 
              @click="toggleClubs"
              class="w-full px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between"
              :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
            >
              <span v-if="selectedClubs.length" class="flex flex-wrap gap-1">
                <span v-for="club in selectedClubs.slice(0, 3)" :key="club" 
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  {{ club }}
                </span>
                <span v-if="selectedClubs.length > 3" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  +{{ selectedClubs.length - 3 }}
                </span>
              </span>
              <span v-else class="text-gray-400">Selecciona clubs</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': showClubs }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div v-show="showClubs" class="absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-32 overflow-auto"
                 :class="theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-600'">
              <div v-for="club in clubOptions" :key="club" 
                   class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                   @click.stop="toggleClub(club)">
                <input 
                  type="checkbox" 
                  :value="club" 
                  v-model="selectedClubs" 
                  class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span class="ml-2 capitalize text-sm" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                  {{ club }}
                </span>
              </div>
            </div>
          </div>

          <!-- Teléfono y Email -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Teléfono
              </label>
              <input 
                id="phone" 
                v-model="form.phone" 
                placeholder="1234567890" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                v-model="form.email" 
                placeholder="tu@email.com" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
          </div>

          <!-- Contraseñas -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Contraseña
              </label>
              <input 
                id="password" 
                type="password" 
                v-model="form.password" 
                placeholder="••••••••" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                Confirmar
              </label>
              <input 
                id="confirmPassword" 
                type="password" 
                v-model="form.confirmPassword" 
                placeholder="••••••••" 
                required
                class="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
              />
            </div>
          </div>

          <!-- Botón de registro -->
          <div class="pt-4">
            <button 
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Crear Cuenta
            </button>
          </div>

          <!-- Link de login -->
          <div class="text-center pt-2">
            <p class="text-sm" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
              ¿Ya tienes cuenta?
              <RouterLink to="/signin" class="text-green-500 hover:text-green-600 font-medium hover:underline ml-1">
                Inicia sesión
              </RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de verificación -->
    <div v-if="showVerificationModal" class="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative rounded-xl shadow-2xl w-full max-w-md p-6"
           :class="theme === 'light' ? 'bg-white' : 'bg-gray-900'">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
            Verificación de Email
          </h3>
          <p class="text-sm mb-4" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            Ingresa el código enviado a tu correo
          </p>
        </div>
        
        <div class="space-y-4">
          <input 
            v-model="verificationInput" 
            type="text" 
            placeholder="Código de 6 dígitos" 
            class="w-full px-4 py-3 rounded-lg border text-center text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-gray-800 text-white'"
            maxlength="6"
          />
          
          <div class="flex gap-3">
            <button 
              @click="cancelVerification" 
              class="flex-1 px-4 py-2 rounded-lg border font-medium transition-colors"
              :class="theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-800'"
            >
              Cancelar
            </button>
            <button 
              @click="verifyCode" 
              class="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition-all"
            >
              Verificar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { toast, type Content } from 'vue3-toastify'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import router from '@/router'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

interface SignupForm {
  firstName: string
  lastName: string
  rol: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  adminCode?: string
}

const form = ref<SignupForm>({
  firstName: '', lastName: '', rol: '', phone: '',
  email: '', password: '', confirmPassword: '', adminCode: ''
})

const clubOptions = ['futbol','ajedrez','tenis','matematicas','programacion','finanzas','economia','fisica']
const selectedClubs = ref<string[]>([])
const showClubs = ref(false)
const clubsContainer = ref<HTMLElement|null>(null)

const toggleClubs = () => showClubs.value = !showClubs.value

const toggleClub = (club: string) => {
  const index = selectedClubs.value.indexOf(club)
  if (index > -1) {
    selectedClubs.value.splice(index, 1)
  } else {
    selectedClubs.value.push(club)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (clubsContainer.value && !clubsContainer.value.contains(e.target as Node))
    showClubs.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))

// Modal y código
const showVerificationModal = ref(false)
const sentCode = ref('')
const verificationInput = ref('')

const initiateVerification = async () => {
  // validaciones básicas...
  if (!form.value.rol) { toast.error('Selecciona un rol'); return }
  if (form.value.password !== form.value.confirmPassword) { toast.error('Las contraseñas no coinciden'); return }
  if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.value.email)) { toast.error('Correo inválido'); return }
  if (!/^\d{10}$/.test(form.value.phone)) { toast.error('Teléfono inválido'); return }
  if (selectedClubs.value.length === 0) { toast.error('Selecciona al menos un club'); return }

  // genera y envía código
  sentCode.value = Math.floor(100000 + Math.random()*900000).toString()
  try {
    await fetch('http://localhost:3000/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.value.email, code: sentCode.value })
    })
    showVerificationModal.value = true
  } catch {
    toast.error('Error al enviar el código de verificación')
  }
}

const cancelVerification = () => {
  showVerificationModal.value = false
  verificationInput.value = ''
}

const verifyCode = async () => {
  if (verificationInput.value === sentCode.value) {
    showVerificationModal.value = false
    await registerUser()
  } else {
    toast.error('Código incorrecto')
  }
}

const registerUser = async () => {
  try {
    const res = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        clubs: selectedClubs.value,
        adminCode: form.value.rol === 'admin' ? form.value.adminCode : undefined
      })
    })
    const data = await res.json()
    if (!res.ok) {
      if (Array.isArray(data.message)) data.message.forEach((m: Content) => toast.error(m))
      else toast.error(data.message)
      return
    }
    toast.success('Usuario creado correctamente')
    router.push('/signin')
  } catch {
    toast.error('Error al registrar usuario')
  }
}
</script>

<style scoped>
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}
</style>