import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

// Toast configuration
const toastOptions = {
   position: 'top-right',
   timeout: 3000,
   closeOnClick: true,
   pauseOnFocusLoss: true,
   pauseOnHover: true,
   draggable: true,
   draggablePercent: 0.6,
   showCloseButtonOnHover: false,
   hideProgressBar: false,
   closeButton: 'button',
   icon: true,
   rtl: false,
   zIndex: 9999  // Add this line to set z-index
}
app.use(router)
app.use(pinia)
app.use(Toast, toastOptions)
app.mount('#app')
