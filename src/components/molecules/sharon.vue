<template>
  <div class="flex min-h-screen" :class="theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'">
    <!-- Formulario -->
    <div class="w-1/2 flex flex-col justify-center items-center p-8" :class="theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'">
      <h2 class="text-2xl font-semibold mb-6 text-green-500">Create an Account</h2>
      <form @submit.prevent="initiateVerification" class="w-full max-w-sm space-y-4">
        <!-- Nombre y apellido -->
        <div class="flex gap-4">
          <CBInput id="firstName" v-model="form.firstName" placeholder="Enter your first name" label="First Name" :theme="theme" />
          <CBInput id="lastName"  v-model="form.lastName"  placeholder="Enter your last name"  label="Last Name" :theme="theme" />
        </div>

        <!-- Rol -->
        <div class="mb-4 text-left">
          <label for="rol" class="block font-semibold mb-1" :class="theme === 'light' ? 'text-black' : 'text-white-700'">Rol</label>
          <select id="rol" v-model="form.rol"
                  class="w-full px-3 py-2 border rounded"
                  :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-700 bg-gray-800 text-white'"
                  required>
            <option disabled value="">-- Select a role --</option>
            <option value="user">Aprendiz</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <!-- Código admin (solo si admin) -->
        <div v-if="form.rol === 'admin'" class="mb-4">
          <CBInput id="adminCode" v-model="form.adminCode" type="password"
                   placeholder="Código de administrador" label="Código de administrador" :theme="theme" />
        </div>

        <!-- Selección de clubs -->
        <div ref="clubsContainer" class="mb-4 relative text-left">
          <label class="block font-semibold mb-1" :class="theme === 'light' ? 'text-black' : 'text-white-500'">Clubs</label>
          <div @click="toggleClubs"
               class="w-full px-3 py-2 border rounded cursor-pointer"
               :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-700 bg-gray-800 text-white'">
            <span v-if="selectedClubs.length">{{ selectedClubs.join(', ') }}</span>
            <span v-else class="text-gray-400">Select one or more clubs</span>
          </div>
          <ul v-show="showClubs"
              class="absolute z-10 border rounded w-full mt-1 max-h-40 overflow-auto"
              :class="theme === 'light' ? 'bg-white border-gray-300 text-black' : 'bg-gray-800 border-gray-700 text-white'">
            <li v-for="club in clubOptions" :key="club" class="px-3 py-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700">
              <input type="checkbox" :value="club" v-model="selectedClubs" class="mr-2 accent-green-500" />
              <span class="capitalize">{{ club }}</span>
            </li>
          </ul>
        </div>

        <!-- Teléfono, email y contraseña -->
        <CBInput id="phone" v-model="form.phone" placeholder="Your phone number" label="Phone" :theme="theme" />
        <CBInput id="email" type="email" v-model="form.email" placeholder="Enter your Email" label="Email" :theme="theme" />
        <CBInput id="password" type="password" v-model="form.password" placeholder="Enter your Password" label="Password" :theme="theme" />
        <CBInput id="confirmPassword" type="password" v-model="form.confirmPassword" placeholder="Confirm your password" label="Confirm Password" :theme="theme" />

        <!-- Botón -->
        <CBButton type="submit" label="Register" class="w-full bg-green-700 text-white py-1 rounded-lg hover:bg-green-700 transition duration-300" />

        <div class="text-center mt-4 animate-fadeIn">
          <p :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            ¿Ya tienes una cuenta?
            <RouterLink to="/signin" class="text-green-500 hover:underline ml-1">Inicia sesión</RouterLink>
          </p>
        </div>
      </form>
    </div>

    <!-- Imagen lateral -->
    <div class="w-1/2 flex justify-center items-center" :class="theme === 'light' ? 'bg-gray-50' : 'bg-gray-950'">
      <img src="@/assets/user.png.png" alt="Illustration" class="w-2/3 opacity-70" />
    </div>

    <!-- Modal de verificación -->
    <div v-if="showVerificationModal" class="fixed inset-0 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div class="relative bg-white p-6 rounded-lg w-80 space-y-4">
        <h3 class="text-lg font-semibold text-green-600">Verificación de Email</h3>
        <p>Hemos enviado un código a tu correo. Ingresa el código:</p>
        <input v-model="verificationInput" type="text" placeholder="Código de verificación" class="w-full px-3 py-2 border rounded" />
        <div class="flex justify-end gap-2">
          <button @click="cancelVerification" class="px-4 py-1 rounded border">Cancelar</button>
          <button @click="verifyCode" class="px-4 py-1 rounded bg-green-600 text-white">Verificar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CBInput from '../atoms/CBInput.vue'
import CBButton from '../atoms/CBButton.vue'
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px) }
  to   { opacity: 1; transform: translateY(0) }
}
.animate-fadeIn { animation: fadeIn 1s ease-in-out }
</style>
