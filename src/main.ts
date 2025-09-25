import './main.scss'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vue3-timepicker/dist/VueTimepicker.css'
import { initializeTheme } from './composables/useTheme'

// Crear app
const app = createApp(App)

// Instalar Pinia una sola vez
const pinia = createPinia()
app.use(pinia)

// Instalar router
app.use(router)

// Instalar plugins
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'dark'
})

initializeTheme()

// Configurar axios baseURL
// Si tu backend NO usa prefijo global: usar '/posts' directamente con baseURL = 'https://backend-senaclub-xtrt.onrender.com'
// Si tu backend usa prefijo 'api', ajustar: baseURL = 'https://backend-senaclub-xtrt.onrender.com/api'
const rawBase = import.meta.env.VITE_API_URL || 'https://backend-senaclub-xtrt.onrender.com'
axios.defaults.baseURL = rawBase.replace(/\/+$/, '')
// Configurar token si existe
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

app.mount('#app')
