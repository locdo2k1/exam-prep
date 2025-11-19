<script setup>
import { login } from '../../api/auth/login.js'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '../../components/auth/LoginForm.vue'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const errorMessage = ref('')

const handleLoginSubmit = async (credentials) => {
   try {
      errorMessage.value = '' // Clear any previous errors
      const response = await login(credentials.username, credentials.password)
      localStorage.setItem('token', response.data)
      window.dispatchEvent(new Event('auth-changed'))

      // Get redirect param (if any)
      const redirect = route.query.redirect

      // Navigate without keeping query string
      router.push({ path: redirect || '/' })
   } catch (error) {
      console.error('Login error:', error)
      errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
   }
}
</script>

<template>
   <div class="mx-auto w-md mt-10 mb-12 p-5 border border-gray-300 rounded-lg shadow-md">
      <div v-if="errorMessage"
         class="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
         {{ errorMessage }}
      </div>
      <LoginForm :redirectUrl="'/user'" @login-submit="handleLoginSubmit" />
   </div>
</template>