<template>
  <div class="flex min-h-screen bg-gray-900">
    <div class="w-1/2 flex flex-col justify-center items-center bg-black text-white p-8">
      <h2 class="text-2xl font-semibold mb-6 text-green-500">Create an Account</h2>
      <form @submit.prevent="register" class="w-full max-w-sm space-y-4">
        <div class="flex gap-4">
          <CBInput id="firstName" v-model="form.firstName" placeholder="Enter your first name" label="First Name" />
          <CBInput id="lastName"  v-model="form.lastName"  placeholder="Enter your last name"  label="Last Name" />
        </div>

        <div class="mb-4 text-left">
          <label for="rol" class="block font-semibold mb-1 text-white-700">Rol</label>
          <select
            id="rol"
            v-model="form.rol"
            class="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white"
            required
          >
            <option disabled value="" class="text-gray-400">-- Select a role --</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div ref="clubsContainer" class="mb-4 relative text-left">
          <label class="block font-semibold mb-1 text-white-500">Clubs</label>
          <div
            @click="toggleClubs"
            class="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white cursor-pointer"
          >
            <span v-if="selectedClubs.length">{{ selectedClubs.join(', ') }}</span>
            <span v-else class="text-gray-500">Select one or more clubs</span>
          </div>
          <ul
            v-show="showClubs"
            class="absolute z-10 bg-gray-800 border border-gray-700 rounded w-full mt-1 max-h-40 overflow-auto text-white"
          >
            <li
              v-for="club in clubOptions"
              :key="club"
              class="px-3 py-2 hover:bg-gray-700 flex items-center"
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

        <CBInput id="phone"            v-model="form.phone"            placeholder="Your phone number"        label="Phone" />
        <CBInput id="email" type="email"      v-model="form.email"            placeholder="Enter your Email"         label="Email" />
        <CBInput id="password" type="password" v-model="form.password"         placeholder="Enter your Password"      label="Password" />
        <CBInput
          id="confirmPassword"
          type="password"
          v-model="form.confirmPassword"
          placeholder="Confirm your password"
          label="Confirm Password"
        />

        <CBButton
          type="submit"
          label="Register"
          class="w-full bg-green-700 text-white py-1 rounded-lg hover:bg-green-700 transition duration-300"
        />

        <div class="text-center mt-4 animate-fadeIn">
          <p class="text-gray-400">
            ¿Ya tienes una cuenta?
            <RouterLink to="/signin" class="text-green-500 hover:underline ml-1">
              Inicia sesión
            </RouterLink>
          </p>
        </div>

      </form>
    </div>

    <div class="w-1/2 flex justify-center items-center bg-gray-950">
      <img src="@/assets/user.png.png" alt="Illustration" class="w-2/3 opacity-70" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CBInput from '../atoms/CBInput.vue'
import CBButton from '../atoms/CBButton.vue'
import { toast, type Content } from 'vue3-toastify'
import router from '@/router'

interface SignupForm {
  firstName: string
  lastName: string
  rol: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

const form = ref<SignupForm>({
  firstName: '',
  lastName: '',
  rol: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
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
        clubs:          selectedClubs.value
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