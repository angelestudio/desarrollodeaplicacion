<template>
  <div class="flex flex-col items-center bg-zinc-900 text-white p-8 min-h-screen">
    <img src="@/assets/logo.png" alt="Logo" class="w-24 mb-4" />
    <h1 class="text-2xl font-bold mb-6">Create an account</h1>

    <form class="w-full max-w-md space-y-4" @submit.prevent="handleClick">
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">First Name</label>
          <input
            v-model="formData.firstName"
            type="text"
            placeholder="Enter your first name"
            required
            class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Last Name</label>
          <input
            v-model="formData.lastName"
            type="text"
            placeholder="Enter your last name"
            required
            class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Role</label>
          <input
            v-model="formData.role"
            type="text"
            placeholder="Your Role"
            required
            class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="Your phone number"
            required
            class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
          />
        </div>
      </div>

      <div>
        <label class="block mb-1">Email</label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="Enter your email"
          required
          class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
        />
      </div>

      <div>
        <label class="block mb-1">Password</label>
        <input
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          required
          class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
        />
      </div>

      <div>
        <label class="block mb-1">Confirm your password</label>
        <input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          class="w-full bg-zinc-800 border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-400"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-full mt-4"
      >
        Register
      </button>

      <p class="text-center text-zinc-400 mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-purple-400 hover:underline">
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