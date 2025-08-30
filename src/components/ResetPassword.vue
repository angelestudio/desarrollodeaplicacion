<template>
  <div class="reset-container">
    <h2>Restablecer contraseña</h2>
    <form @submit.prevent="resetPassword">
      <input
        type="password"
        v-model="password"
        placeholder="Ingresa tu nueva contraseña"
        required
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirma tu contraseña"
        required
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Cambiando...' : 'Cambiar contraseña' }}
      </button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()

const password = ref("")
const confirmPassword = ref("")
const message = ref("")
const error = ref("")
const isLoading = ref(false)

// Verificar que tenemos el token al cargar
onMounted(() => {
  const token = route.query.token
  if (!token) {
    error.value = "Token de recuperación no válido"
    setTimeout(() => router.push("/login"), 3000)
  }
})

const resetPassword = async () => {
  // Limpiar mensajes anteriores
  error.value = ""
  message.value = ""

  // Validaciones
  if (password.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres"
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden"
    return
  }

  isLoading.value = true

  try {
    const token = route.query.token
    
    // ⚠️ CORRECCIÓN: Tu backend espera 'newPassword', no 'password'
    await axios.post("http://localhost:3000/auth/reset-password", {
      token,
      newPassword: password.value  // <- Cambiado de 'password' a 'newPassword'
    })

    message.value = "Contraseña actualizada con éxito"
    
    // Limpiar campos
    password.value = ""
    confirmPassword.value = ""
    
    // Redirigir al login (cambié de "/signin" a "/login")
    setTimeout(() => router.push("/login"), 2000)
    
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || "Error al cambiar la contraseña"
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.reset-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 2rem;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

button {
  background-color: #16a34a;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #15803d;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.success {
  color: #16a34a;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
}

.error {
  color: #dc2626;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
}
</style>