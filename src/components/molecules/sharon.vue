<script setup lang="ts">
import CBInput from '../atoms/CBInput.vue'
import CBButton from '../atoms/CBButton.vue'
import { ref } from 'vue'

const form = ref({
  Nombre: '',
  Apellido: '',
  rol: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const register = async () => {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()
    console.log('Respuesta del backend:', data)
    alert('Usuario enviado correctamente')

  } catch (error) {
    console.error('Error al registrar:', error)
    alert('Error al registrar usuario')
  }
}

</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sección izquierda - Formulario -->
    <div class="w-1/2 flex flex-col justify-center items-center bg-black text-white p-8">
      <h2 class="text-2xl font-semibold mb-6">Create an Account</h2>

      <div class="w-full max-w-sm space-y-4">
        <div class="flex gap-4">
          <CBInput id="firstName" v-model="form.Nombre" placeholder="Enter your first name" label="First Name" />
          <CBInput id="lastName" v-model="form.Apellido" placeholder="Enter your last name" label="Last Name" />
        </div>

        <div class="flex gap-4">
          <CBInput id="role" v-model="form.rol" placeholder="Your role" label="Role" />
          <CBInput id="phone" v-model="form.phone" placeholder="Your phone number" label="Phone" />
        </div>

        <CBInput id="email" v-model="form.email" placeholder="Enter your Email" label="Email" type="email" />
        <CBInput id="password" v-model="form.password" placeholder="Enter your Password" label="Password" type="password" />
        <CBInput id="confirmPassword" v-model="form.confirmPassword" placeholder="Confirm your password" label="Confirm your password" type="password" />

        <CBButton label="Register" class="w-full bg-blue-600 text-white py-2 rounded-lg" @click="register" />

        <p class="text-center text-sm mt-2">
          Already have an account? 
          <a href="#" class="text-blue-400 hover:underline">Log in here</a>
        </p>
      </div>
    </div>

    <!-- Sección derecha - Imagen -->
    <div class="w-1/2 flex justify-center items-center bg-white">
      <img src="@/assets/user.png.png" alt="Illustration" class="w-2/3" />
    </div>
  </div>
</template>