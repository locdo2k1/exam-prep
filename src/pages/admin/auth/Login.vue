<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg class="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                fill="none">
                <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke="" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Trở lại trang chủ
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <LoginForm @login-submit="handleLoginSubmit" :redirectUrl="'/admin'" />
            </div>
          </div>
        </div>

        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="{231}" height="{48}" src="/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import CommonGridShape from '@/components/admin/common/CommonGridShape.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import FullScreenLayout from '@/components/admin/layout/FullScreenLayout.vue'
import { login } from '../../../api/auth/login.js'

const router = useRouter()
const route = useRoute()

const handleLoginSubmit = async (credentials) => {
  try {
    const response = await login(credentials.username, credentials.password)
    localStorage.setItem('token', response)

    const redirect = route.query.redirect
    router.push(redirect || '/admin')
  } catch (error) {
    console.error('Login error:', error)
    // You might want to emit this back to the form component
  }
}
</script>
