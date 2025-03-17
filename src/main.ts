import './main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vue3-timepicker/dist/VueTimepicker.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
