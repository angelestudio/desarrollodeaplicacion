import './main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vue3-timepicker/dist/VueTimepicker.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


const app = createApp(App)

app.use(Toast, {

})
app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
     autoclose: 3000
})

app.mount('#app')
