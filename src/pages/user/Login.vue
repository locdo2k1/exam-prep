<script setup>
import { ref } from 'vue'
import { login } from '../../api/auth/login.js'
import { useRoute, useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const route = useRoute()


// Add validation states
const usernameError = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)

// Validate form
const validateForm = () => {
   let isValid = true

   // Reset error messages
   usernameError.value = ''
   passwordError.value = ''

   // Validate username
   if (!username.value.trim()) {
      usernameError.value = 'Username is required'
      isValid = false
   }

   // Validate password
   if (!password.value) {
      passwordError.value = 'Password is required'
      isValid = false
   }

   return isValid
}

const handleSubmit = async () => {
   if (!validateForm()) {
      return // Stop if validation fails
   }

   isSubmitting.value = true

   try {
      const response = await login({ username: username.value, password: password.value })

      const redirect = route.query.redirect
      console.log(redirect)
      if (redirect) {
         console.log("here")
         router.push(redirect)
      } else {
         router.push('/user')
      }
   } catch (error) {
      console.error(error)
      // Handle login error
   } finally {
      isSubmitting.value = false
   }
}
</script>

<template>
   <div class="mx-auto w-md mt-10 mb-12 p-5 border border-gray-300 rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit">
         <div class="grid gap-6 mb-4">
            <div>
               <label for="user_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User
                  Name</label>
               <input type="text" id="user_name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  :class="{ 'border-red-500': usernameError }" placeholder="User name" v-model="username" />
               <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
            </div>
            <div>
               <label for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
               <div class="relative">
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     :class="{ 'border-red-500': passwordError }" placeholder="Password" />
                  <svg v-if="password" @click="showPassword = !showPassword"
                     class="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                     <!-- Slash Eye Icon (when showPassword is true) -->
                     <path v-if="showPassword" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                     <!-- Open Eye Icon (when showPassword is false) -->
                     <path v-else stroke="currentColor" stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                     <path v-if="!showPassword" stroke="currentColor" stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
               </div>
               <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>
         </div>

         <!-- Rest of your template remains the same -->
         <p class="text-sm text-blue-500 hover:underline cursor-pointer text-center mb-4">
            Quên mật khẩu?
         </p>
         <button type="submit"
            class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 cursor-pointer"
            :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập' }}
         </button>

         <!-- Rest of your form... -->
      </form>
   </div>
</template>