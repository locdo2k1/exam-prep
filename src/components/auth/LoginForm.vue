<script setup>
import { ref, defineEmits, watch, onMounted } from 'vue'
import { useGoogleAuth } from '@/api/auth/googleAuthService'

const props = defineProps({
   redirectUrl: {
      type: String,
      default: '/user'
   }
})

const emit = defineEmits(['login-submit'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const usernameError = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)

// Set up Google authentication
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleAuth = useGoogleAuth(googleClientId);

// Handle the credential received from Google
const handleCredentialResponse = async (response) => {
   if (response?.credential) {
      try {
         // await authStore.loginWithGoogle(response.credential);
         router.push('/dashboard');
      } catch (err) {
         console.error('Authentication failed:', err);
      }
   }
};

// Watch for when Google API is loaded
watch(() => googleAuth.isGapiLoaded.value, (isLoaded) => {
   if (isLoaded) {
      googleAuth.initializeGoogleSignIn(handleCredentialResponse);
   }
});

// When the component is mounted
onMounted(() => {
   // If already authenticated, redirect to dashboard
   // if (authStore.isAuthenticated) {
   //    router.push('/dashboard');
   //    return;
   // }

   // If Google API is already loaded, initialize
   if (googleAuth.isGapiLoaded.value) {
      googleAuth.initializeGoogleSignIn(handleCredentialResponse);

      // Wait for DOM to be updated
      // setTimeout(() => {
      //    googleAuth.renderButton('google-signin-button');
      // }, 0);
   }
});

const validateForm = () => {
   let isValid = true
   usernameError.value = ''
   passwordError.value = ''

   if (!username.value.trim()) {
      usernameError.value = 'Tên người dùng là bắt buộc'
      isValid = false
   }

   if (!password.value) {
      passwordError.value = 'Mật khẩu là bắt buộc'
      isValid = false
   }

   return isValid
}

const handleSubmit = () => {
   if (!validateForm()) return

   isSubmitting.value = true

   try {
      emit('login-submit', {

         username: username.value,
         password: password.value
      })

   } finally {
      isSubmitting.value = false
   }
}


</script>

<template>
   <div class="mb-5 sm:mb-8">
      <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
         Đăng Nhập
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
         Nhập tên người dùng và mật khẩu để đăng nhập!
      </p>
   </div>
   <form @submit.prevent="handleSubmit">
      <div class="grid gap-6 mb-4">
         <div>
            <label for="user_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
               Tên người dùng <span class="text-red-500">*</span>
            </label>
            <input type="text" id="user_name"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               :class="{ 'border-red-500': usernameError }" placeholder="Tên người dùng" v-model="username" />
            <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
         </div>
         <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
               Mật khẩu <span class="text-red-500">*</span>
            </label>
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
      <p class="text-sm text-center mt-4">
         Bạn chưa là một thành viên?
         <router-link to="/user/signup" custom v-slot="{ navigate }">
            <a href="#" class="text-blue-500 hover:underline cursor-pointer" @click="navigate">Đăng ký ngay!</a>
         </router-link>
      </p>
      <div class="flex items-center my-3">
         <div class="flex-1 border-t border-gray-300"></div>
         <span class="px-4 text-gray-500 text-sm">Hoặc</span>
         <div class="flex-1 border-t border-gray-300"></div>
      </div>
      <!-- Custom Google Sign-In Button -->
      <button type="button" v-if="googleAuth.isInitialized" @click="() => googleAuth.promptSignIn(props.redirectUrl)"
         class="w-full text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:bg-gray-600 dark:text-white dark:border-gray-600 cursor-pointer">
         <svg class="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_13183_10121)">
               <path
                  d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                  fill="#3F83F8" />
               <path
                  d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                  fill="#34A853" />
               <path
                  d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                  fill="#FBBC04" />
               <path
                  d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                  fill="#EA4335" />
            </g>
            <defs>
               <clipPath id="clip0_13183_10121">
                  <rect width="20" height="20" fill="white" transform="translate(0.5)" />
               </clipPath>
            </defs>
         </svg>
         <span class="flex-1">Đăng nhập với Google</span>
      </button>
   </form>
</template>
