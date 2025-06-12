import './main.scss'

import axios from 'axios'                // ← Importar axios
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vue3-timepicker/dist/VueTimepicker.css'
import { initializeTheme } from './composables/useTheme'

// Establecer la URL base de todas las peticiones al backend
axios.defaults.baseURL = 'http://localhost:3000'

const pinia=createPinia()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,        
  position: 'top-right',  
  theme: 'dark'
})

initializeTheme() // Inicializar el tema

app.use(pinia)
app.mount('#app')

