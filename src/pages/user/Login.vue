<script setup>
import { login } from '../../api/auth/login.js'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '../../components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()

const handleLoginSubmit = async (credentials) => {
   try {
      const response = await login(credentials.username, credentials.password)
      localStorage.setItem('token', response)

      const redirect = route.query.redirect
      router.push(redirect || '/user')
   } catch (error) {
      console.error('Login error:', error)
      // You might want to emit this back to the form component
   }
}
</script>

<template>
   <div class="mx-auto w-md mt-10 mb-12 p-5 border border-gray-300 rounded-lg shadow-md">
      <LoginForm :redirectUrl="'/user'" @login-submit="handleLoginSubmit" />
   </div>
</template>