<template>
  <div class="flex min-h-screen" :class="theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'">
    <div class="w-1/2 flex flex-col justify-center items-center p-8" :class="theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'">
      <h2 class="text-2xl font-semibold mb-6 text-green-500">Create an Account</h2>
      <form @submit.prevent="register" class="w-full max-w-sm space-y-4">
        <div class="flex gap-4">
          <CBInput id="firstName" v-model="form.firstName" placeholder="Enter your first name" label="First Name" :theme="theme" />
          <CBInput id="lastName"  v-model="form.lastName"  placeholder="Enter your last name"  label="Last Name" :theme="theme" />
        </div>

        <div class="mb-4 text-left">
          <label for="rol" class="block font-semibold mb-1" :class="theme === 'light' ? 'text-black' : 'text-white-700'">Rol</label>
          <select
            id="rol"
            v-model="form.rol"
            class="w-full px-3 py-2 border rounded"
            :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-700 bg-gray-800 text-white'"
            required
          >
            <option disabled value="" :class="theme === 'light' ? 'text-gray-500' : 'text-gray-400'">-- Select a role --</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- CAMPO DE CÓDIGO DE ADMINISTRADOR SOLO SI rol == 'admin' -->
        <div v-if="form.rol === 'admin'" class="mb-4">
          <CBInput
            id="adminCode"
            v-model="form.adminCode"
            type="password"
            placeholder="Código de administrador"
            label="Código de administrador"
            :theme="theme"
          />
        </div>
        <!-- FIN CAMPO ADMIN -->

        <div ref="clubsContainer" class="mb-4 relative text-left">
          <label class="block font-semibold mb-1" :class="theme === 'light' ? 'text-black' : 'text-white-500'">Clubs</label>
          <div
            @click="toggleClubs"
            class="w-full px-3 py-2 border rounded cursor-pointer"
            :class="theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-700 bg-gray-800 text-white'"
          >
            <span v-if="selectedClubs.length">{{ selectedClubs.join(', ') }}</span>
            <span v-else :class="theme === 'light' ? 'text-gray-400' : 'text-gray-500'">Select one or more clubs</span>
          </div>
          <ul
            v-show="showClubs"
            class="absolute z-10 border rounded w-full mt-1 max-h-40 overflow-auto"
            :class="theme === 'light' ? 'bg-white border-gray-300 text-black' : 'bg-gray-800 border-gray-700 text-white'"
          >
            <li
              v-for="club in clubOptions"
              :key="club"
              class="px-3 py-2 flex items-center"
              :class="theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'"
            >
              <input
                type="checkbox"
                :value="club"
                v-model="selectedClubs"
                class="mr-2 accent-green-500"
              />
              <span class="capitalize">{{ club }}</span>
            </li>
          </ul>
        </div>

        <CBInput id="phone"            v-model="form.phone"            placeholder="Your phone number"        label="Phone" :theme="theme" />
        <CBInput id="email" type="email"      v-model="form.email"            placeholder="Enter your Email"         label="Email" :theme="theme" />
        <CBInput id="password" type="password" v-model="form.password"         placeholder="Enter your Password"      label="Password" :theme="theme" />
        <CBInput
          id="confirmPassword"
          type="password"
          v-model="form.confirmPassword"
          placeholder="Confirm your password"
          label="Confirm Password"
          :theme="theme"
        />

        <CBButton
          type="submit"
          label="Register"
          class="w-full bg-green-700 text-white py-1 rounded-lg hover:bg-green-700 transition duration-300"
        />

        <div class="text-center mt-4 animate-fadeIn">
          <p :class="theme === 'light' ? 'text-gray-600' : 'text-gray-400'">
            ¿Ya tienes una cuenta?
            <RouterLink to="/signin" class="text-green-500 hover:underline ml-1">
              Inicia sesión
            </RouterLink>
          </p>
        </div>

      </form>
    </div>

    <div class="w-1/2 flex justify-center items-center" :class="theme === 'light' ? 'bg-gray-50' : 'bg-gray-950'">
      <img src="@/assets/user.png.png" alt="Illustration" class="w-2/3 opacity-70" />
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
  adminCode?: string // <-- Añade este campo opcional
}

const form = ref<SignupForm>({
  firstName: '',
  lastName: '',
  rol: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminCode: '' // <-- Inicializa
})

// Clubs dropdown
const clubOptions = ['futbol','ajedrez','tenis','matematicas','programacion','finanzas','economia','fisica']
const selectedClubs = ref<string[]>([])
const showClubs = ref(false)
const clubsContainer = ref<HTMLElement|null>(null)

const toggleClubs = () => {
  showClubs.value = !showClubs.value
}

const handleClickOutside = (e: MouseEvent) => {
  if (
    clubsContainer.value &&
    !clubsContainer.value.contains(e.target as Node)
  ) {
    showClubs.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const register = async () => {
  if (!form.value.rol) {
    toast.error('Selecciona un rol')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Las contraseñas no coinciden')
    return
  }
  if (selectedClubs.value.length === 0) {
    toast.error('Selecciona al menos un club')
    return
  }
  // Validar correo real
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(form.value.email)) {
    toast.error('Ingresa un correo electrónico válido')
    return
  }

  // Validar teléfono (solo números y 10 dígitos)
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(form.value.phone)) {
    toast.error('El número de teléfono debe tener 10 dígitos')
    return
  }

  // Validar código de administrador si es admin
  if (form.value.rol === 'admin') {
    if (!form.value.adminCode || form.value.adminCode.trim() === '') {
      toast.error('Debes ingresar el código de administrador')
      return
    }
    // Puedes comparar aquí el código (ejemplo: '12345'), o hacerlo en el backend
    // if (form.value.adminCode !== 'TU_CODIGO_ADMIN') {
    //   toast.error('Código de administrador incorrecto')
    //   return
    // }
  }

  try {
    const res = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName:      form.value.firstName,
        lastName:       form.value.lastName,
        rol:            form.value.rol,
        phone:          form.value.phone,
        email:          form.value.email,
        password:       form.value.password,
        clubs:          selectedClubs.value,
        adminCode:      form.value.rol === 'admin' ? form.value.adminCode : undefined // <-- Solo si es admin
      })
    })

    const data = await res.json()
    if (!res.ok) {
      if (Array.isArray(data.message)) {
        data.message.forEach((msg: Content) => toast.error(msg))
      } else {
        toast.error(data.message)
      }
      return
    }

    toast.success('Usuario creado correctamente')
    router.push('/signin')
  } catch (err) {
    console.error(err)
    toast.error('Error al registrar usuario')
  }
}
</script>

<style scoped>
/* Animación para el texto "¿Ya tienes cuenta?" */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-in-out;
}
</style>