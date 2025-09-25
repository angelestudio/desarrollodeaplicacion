<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" :class="theme === 'light' ? 'bg-gradient-to-br from-green-50 via-white to-green-50' : 'bg-gradient-to-br from-black via-gray-900 to-black'">
    
    <!-- Efectos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-3xl floating-animation"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full blur-3xl floating-animation-delayed"></div>
      
      <!-- Partículas flotantes -->
      <div v-for="i in 15" :key="i" class="particle" 
           :style="{
               left: Math.random() * 100 + '%',
               animationDelay: Math.random() * 8 + 's',
               animationDuration: (8 + Math.random() * 4) + 's'
           }"></div>
    </div>

    <!-- Toggle de tema -->
<button
  @click="clubsContainer?.value && !clubsContainer.value.click && themeStore.toggleTheme()"
  class="fixed top-6 right-6 w-12 h-12 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 shadow-lg"
>
  <svg v-if="theme === 'light'" class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
  </svg>
  <svg v-else class="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
  </svg>
</button>
<div ref="clubsContainer"></div>

    
    <!-- Contenedor principal optimizado para pantalla completa -->
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      
      <!-- Sección izquierda - Información -->
      <div class="text-center lg:text-left space-y-8">
        <div class="relative">
          <div class="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-10 shadow-2xl floating-animation glow-effect-green">
            <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse flex items-center justify-center">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div class="space-y-6">
          <h1 class="text-6xl lg:text-8xl font-black bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent leading-tight tracking-tight">
            Únete a<br>Nosotros
          </h1>
          <p class="text-xl lg:text-2xl font-light leading-relaxed" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-200'">
            Descubre una nueva forma de <span class="font-bold text-green-600">aprender</span> y <span class="font-bold text-green-700">conectar</span>
          </p>
        </div>
        
        <div class="hidden lg:block space-y-6 pt-8">
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Acceso a múltiples clubs especializados</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-600 to-green-700 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Comunidad activa de aprendizaje</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-green-700 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Herramientas educativas avanzadas</span>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="w-4 h-4 bg-gradient-to-r from-green-600 to-green-800 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
            <span class="text-lg font-medium transition-colors duration-300" :class="theme === 'light' ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-200 group-hover:text-green-400'">Eventos y competencias exclusivas</span>
          </div>
        </div>

        <!-- Stats decorativas -->
        <div class="hidden lg:flex items-center space-x-8 pt-8">
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5K+</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Miembros</div>
          </div>
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">12</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Clubs</div>
          </div>
          <div class="text-center glass-effect rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">98%</div>
            <div class="text-sm" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">Satisfacción</div>
          </div>
        </div>
      </div>

      <!-- Sección derecha - Formulario -->
      <div class="relative">
        <div class="glass-effect-elegant rounded-3xl shadow-2xl p-10 border relative overflow-hidden" 
             :class="theme === 'light' ? 'border-green-200/30' : 'border-green-800/30'">
          
          <!-- Efecto shimmer -->
          <div class="absolute inset-0 shimmer-green opacity-20 pointer-events-none"></div>
          
          <div class="relative z-10">
            <div class="text-center mb-10">
              <h2 class="text-4xl font-black mb-3" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
                Crear Cuenta
              </h2>
              <p class="text-base font-medium" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
                Completa todos los campos para comenzar
              </p>
            </div>
            
            <form @submit.prevent="initiateVerification" class="space-y-8">
              <!-- Nombre y apellido -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Nombre
                  </label>
                  <input 
                    id="firstName" 
                    v-model="form.firstName" 
                    placeholder="Tu nombre" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Apellido
                  </label>
                  <input 
                    id="lastName" 
                    v-model="form.lastName" 
                    placeholder="Tu apellido" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Email
                </label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="form.email" 
                  placeholder="tu@soy.sena.edu.co" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  @input="detectRole"
                />
              </div>

              <!-- Código admin -->
              <div v-if="isAdmin" class="animate-slideDown space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Código de Administrador
                </label>
                <input 
                  id="adminCode" 
                  v-model="form.adminCode" 
                  type="password"
                  placeholder="Código secreto" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                />
              </div>

              <!-- Selección de clubs -->
              <div ref="clubsContainer" class="relative space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Clubs de Interés
                </label>
                <div 
                  @click="toggleClubs"
                  class="input-elegant-green cursor-pointer flex items-center justify-between min-h-[56px]"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                >
                  <div class="flex-1">
                    <div v-if="selectedClubs.length" class="flex flex-wrap gap-2">
                      <span v-for="club in selectedClubs.slice(0, 3)" :key="club" 
                            class="club-tag-green inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg">
                        {{ getClubEmoji(club) }} {{ club }}
                      </span>
                      <span v-if="selectedClubs.length > 3" 
                            class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold shadow-lg"
                            :class="theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-200'">
                        +{{ selectedClubs.length - 3 }} más
                      </span>
                    </div>
                    <span v-else class="text-gray-400 text-base font-medium">Selecciona tus clubs favoritos</span>
                  </div>
                  <svg class="w-6 h-6 text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showClubs }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>                
                <div v-show="showClubs" class="absolute z-20 w-full mt-3 rounded-2xl shadow-2xl max-h-48 overflow-auto glass-effect-elegant border"
                     :class="theme === 'light' ? 'border-green-200/50' : 'border-green-800/50'">
                  <div v-for="club in clubOptions" :key="club" 
                       class="flex items-center px-5 py-4 hover:bg-green-50/80 dark:hover:bg-green-900/20 cursor-pointer transition-colors duration-300 first:rounded-t-2xl last:rounded-b-2xl"
                       @click.stop="toggleClub(club)">
                    <input 
                      type="checkbox" 
                      :value="club" 
                      v-model="selectedClubs" 
                      class="w-5 h-5 text-green-600 rounded focus:ring-green-500 accent-green-500"
                    />
                    <span class="ml-4 capitalize text-base font-semibold flex items-center space-x-3" 
                          :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                      <span class="text-lg">{{ getClubEmoji(club) }}</span>
                      <span>{{ club }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Teléfono -->
              <div class="space-y-3">
                <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                  Teléfono
                </label>
                <input 
                  id="phone" 
                  v-model="form.phone" 
                  placeholder="3001234567" 
                  required
                  class="input-elegant-green"
                  :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                />
              </div>

              <!-- Contraseñas -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Contraseña
                  </label>
                  <input 
                    id="password" 
                    type="password" 
                    v-model="form.password" 
                    placeholder="••••••••" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
                <div class="space-y-3">
                  <label class="block text-sm font-bold" :class="theme === 'light' ? 'text-gray-800' : 'text-gray-200'">
                    Confirmar
                  </label>
                  <input 
                    id="confirmPassword" 
                    type="password" 
                    v-model="form.confirmPassword" 
                    placeholder="••••••••" 
                    required
                    class="input-elegant-green"
                    :class="theme === 'light' ? 'input-light-green' : 'input-dark-green'"
                  />
                </div>
              </div>

              <!-- Botón de registro -->
              <div class="pt-8">
                <button 
                  type="submit"
                  class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-xl glow-effect-green text-lg"
                >
                  Crear Cuenta
                </button>
              </div>

              <!-- Link de login -->
              <div class="text-center pt-6">
                <p class="text-base font-medium" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
                  ¿Ya tienes cuenta?
                  <RouterLink to="/signin" class="text-green-600 hover:text-green-700 font-bold hover:underline ml-2 transition-colors duration-200">
                    Inicia sesión aquí
                  </RouterLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de verificación -->
    <div v-if="showVerificationModal" class="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"></div>
      <div class="relative glass-effect-elegant rounded-3xl shadow-2xl w-full max-w-md p-10 transform transition-all duration-300 scale-100 border"
           :class="theme === 'light' ? 'border-green-200/30' : 'border-green-800/30'">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-8 shadow-2xl glow-effect-green floating-animation">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-3xl font-black mb-4" :class="theme === 'light' ? 'text-gray-900' : 'text-white'">
            Verificación de Email
          </h3>
          <p class="text-base mb-8 leading-relaxed font-medium" :class="theme === 'light' ? 'text-gray-700' : 'text-gray-300'">
            Hemos enviado un código a tu correo electrónico
          </p>
        </div>
        
        <div class="space-y-8">
          <div class="relative">
            <input 
              v-model="verificationInput" 
              type="text" 
              placeholder="000000" 
              maxlength="6"
              class="w-full px-6 py-5 rounded-2xl border-2 text-center text-3xl font-mono tracking-[0.5em] font-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500"
              :class="theme === 'light' ? 'border-green-200 bg-white/90 text-gray-900' : 'border-green-800 bg-gray-900/90 text-white'"
            />
            <div class="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-50"></div>
          </div>
          
          <div class="flex gap-4">
            <button 
              @click="cancelVerification" 
              class="flex-1 px-8 py-4 rounded-2xl border-2 font-bold transition-all duration-300 hover:scale-105 text-base"
              :class="theme === 'light' ? 'border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400' : 'border-gray-600 text-gray-200 hover:bg-gray-800/50 hover:border-gray-500'"
            >
              Cancelar
            </button>
            <button 
              @click="verifyCode" 
              class="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold transition-all duration-300 hover:scale-105 shadow-xl glow-effect-green text-base"
            >
              Verificar
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-sm font-medium" :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
              ¿No recibiste el código? 
              <button class="text-green-600 hover:text-green-700 font-bold ml-1 transition-colors duration-200 hover:underline">
                Reenviar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { toast, type Content } from 'vue3-toastify'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import router from '@/router'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

interface SignupForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  adminCode?: string
}

const form = ref<SignupForm>({
  firstName: '', lastName: '', phone: '',
  email: '', password: '', confirmPassword: '', adminCode: ''
})

const clubOptions = ['futbol','ajedrez','tenis','matematicas','programacion','finanzas','economia','fisica']
const selectedClubs = ref<string[]>([])
const showClubs = ref(false)
const clubsContainer = ref<HTMLElement|null>(null)

const isAdmin = computed(() => {
  return form.value.email.includes('@sena.edu.co')
})

const detectRole = () => {
  // Se ejecuta cuando cambia el email para detectar automáticamente el rol
}

const getClubEmoji = (club: string) => {
  const emojis: Record<string, string> = {
    'futbol': '⚽',
    'ajedrez': '♟️',
    'tenis': '🎾',
    'matematicas': '📊',
    'programacion': '💻',
    'finanzas': '💰',
    'economia': '📈',
    'fisica': '⚡'
  }
  return emojis[club] || '🏆'
}

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
  // Validaciones básicas
  if (form.value.password !== form.value.confirmPassword) { 
    toast.error('Las contraseñas no coinciden'); 
    return 
  }
  
  if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.value.email)) { 
    toast.error('Correo inválido'); 
    return 
  }
  
  if (!/^\d{10}$/.test(form.value.phone)) { 
    toast.error('Teléfono inválido'); 
    return 
  }
  
  if (selectedClubs.value.length === 0) { 
    toast.error('Selecciona al menos un club'); 
    return 
  }
  
  // Validación de correos según el rol
  if (isAdmin.value && !form.value.email.includes('@sena.edu.co')) {
    toast.error('El correo del administrador debe contener "@sena.edu.co"');
    return;
  }
  
  if (!isAdmin.value && !form.value.email.includes('@soy.sena.edu.co')) {
    toast.error('El correo del aprendiz debe contener "@soy.sena.edu.co"');
    return;
  }

  if (isAdmin.value && !form.value.adminCode) {
    toast.error('Ingresa el código de administrador');
    return;
  }

  // Genera y envía código
  sentCode.value = Math.floor(100000 + Math.random()*900000).toString()
  try {
  await fetch('https://backend-senaclub-xtrt.onrender.com/auth/send-code', {
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
    const rol = isAdmin.value ? 'admin' : 'user'
  const res = await fetch('https://backend-senaclub-xtrt.onrender.com/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        rol,
        clubs: selectedClubs.value,
        adminCode: isAdmin.value ? form.value.adminCode : undefined
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.glass-effect {
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-effect-elegant {
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dark .glass-effect-elegant {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.shimmer-green {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(34, 197, 94, 0.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.input-elegant-green {
  @apply w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 font-semibold text-base;
  transform: translateZ(0);
}

.input-elegant-green:focus {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.25);
}

.input-light-green {
  @apply border-green-200 bg-white/90 text-gray-900 placeholder-gray-500;
}

.input-dark-green {
  @apply border-green-800 bg-gray-900/90 text-white placeholder-gray-400;
}

.club-tag-green {
  background: linear-gradient(135deg, #16a34a, #15803d);
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.club-tag-green:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
}

.glow-effect-green {
  box-shadow: 0 0 40px rgba(34, 197, 94, 0.4);
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  border-radius: 50%;
  animation: particle-float 8s infinite linear;
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

.floating-animation-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>