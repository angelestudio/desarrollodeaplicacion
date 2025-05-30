<template>
  <div class="flex flex-col items-center bg-black text-white p-8 min-h-screen">
    <img src="@/assets/logo.png" alt="Logo" class="w-24 mb-4" />
    <h1 class="text-2xl font-bold mb-6 text-green-500">Create an account</h1>

    <form class="w-full max-w-md space-y-4" @submit.prevent="handleClick">
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1 text-green-500">First Name</label>
          <input
            v-model="formData.firstName"
            type="text"
            placeholder="Enter your first name"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1 text-green-500">Last Name</label>
          <input
            v-model="formData.lastName"
            type="text"
            placeholder="Enter your last name"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1 text-green-500">Role</label>
          <input
            v-model="formData.role"
            type="text"
            placeholder="Your Role"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1 text-green-700">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="Your phone number"
            required
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div>
        <label class="block mb-1 text-green-700">Email</label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="Enter your email"
          required
          class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label class="block mb-1 text-green-700">Password</label>
        <input
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          required
          class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label class="block mb-1 text-green-700">Confirm your password</label>
        <input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          class="w-full bg-green-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-700 hover:bg-green-700 text-white font-bold py-3 rounded-full mt-4 transition duration-300"
      >
        Register
      </button>

      <p class="text-center text-gray-400 mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-green-500 hover:underline">
          Log in here
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { loginStore } from '@/stores/login'

const login = loginStore()

const formData = reactive({
  firstName: '',
  lastName: '',
  role: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleClick = () => {
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  login.validateUser(formData.email, formData.password)
}
</script>