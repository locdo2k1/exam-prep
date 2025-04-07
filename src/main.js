import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { login } from './api/auth/login'

createApp(App).use(router).mount('#app')
