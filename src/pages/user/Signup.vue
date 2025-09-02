<script setup>
import { ref, onMounted } from 'vue'
import { signup } from '../../api/auth/signup';
import { useRouter } from 'vue-router';
import { useGoogleAuth } from '../../services/googleAuthService';

// Form fields
const userName = ref('');
const email = ref('');
const password = ref('');
const rePassword = ref('');

// Form validation state
const formSubmitted = ref(false);
const formErrors = ref({
   userName: false,
   email: false,
   password: false,
   rePassword: false,
   passwordMatch: false
});

const signupError = ref('');

//vue router
const router = useRouter();

// Google Auth
const { initializeGoogleSignIn, promptSignIn, error: googleError, isGapiLoaded } = useGoogleAuth(
   import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
);

// Initialize Google Sign-In when component mounts
onMounted(() => {
   initializeGoogleSignIn(handleGoogleAuthCallback);
});

const handleGoogleAuthCallback = (response) => {
   // This will be called after successful Google Sign-In
   console.log('Google auth callback', response);
};

const handleGoogleSignIn = async () => {
   try {
      if (!isGapiLoaded.value) {
         console.error('Google API not loaded yet');
         return;
      }
      await promptSignIn('/user'); // Redirect to home after successful sign-in
   } catch (error) {
      console.error('Google Sign-In Error:', error);
   }
};

// Toggle for password visibility
const showPassword = ref(false);
const showRePassword = ref(false);

// Validation checks
const isEmailValid = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

// Form submission handler
const handleSubmit = async (event) => {
   event.preventDefault();
   formSubmitted.value = true;

   // Check all fields
   let hasError = false;

   // Validate username
   if (userName.value.trim() === '') {
      formErrors.value.userName = true;
      hasError = true;
   } else {
      formErrors.value.userName = false;
   }

   // Validate email
   if (email.value.trim() === '') {
      formErrors.value.email = true;
      hasError = true;
   } else if (!isEmailValid(email.value)) {
      formErrors.value.email = true;
      hasError = true;
   } else {
      formErrors.value.email = false;
   }

   // Validate password
   if (password.value.trim() === '') {
      formErrors.value.password = true;
      hasError = true;
   } else {
      formErrors.value.password = false;
   }

   // Validate re-password
   if (rePassword.value.trim() === '') {
      formErrors.value.rePassword = true;
      hasError = true;
   } else {
      formErrors.value.rePassword = false;
   }

   // Check password match
   if (password.value !== rePassword.value && rePassword.value.trim() !== '') {
      formErrors.value.passwordMatch = true;
      hasError = true;
   } else {
      formErrors.value.passwordMatch = false;
   }

   if (!hasError) {
      try {
         signupError.value = ''; // Clear any previous errors
         const response = await signup(userName.value, email.value, password.value);
         // Handle successful signup
         localStorage.setItem('token', response);

         router.replace({ name: 'home' });
      } catch (error) {
         console.error(error);
         signupError.value = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.';
      }
   }
};

const resetForm = () => {
   userName.value = '';
   email.value = '';
   password.value = '';
   rePassword.value = '';
   formSubmitted.value = false;
   formErrors.value = {
      userName: false,
      email: false,
      password: false,
      rePassword: false,
      passwordMatch: false
   };
};
</script>

<template>
   <div class="mx-auto w-md mt-10 mb-12 p-5 border border-gray-300 rounded-lg shadow-md">
      <div v-if="signupError"
         class="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
         {{ signupError }}
      </div>
      <form @submit="handleSubmit" novalidate>
         <div class="grid gap-6 mb-4">
            <!-- User Name Field -->
            <div>
               <label for="user_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tên người dùng <span class="text-red-500">*</span>
               </label>
               <input v-model="userName" type="text" id="user_name" :class="[
                  'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500',
                  (formSubmitted && formErrors.userName)
                     ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
                     : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
               ]" placeholder="Tên người dùng" required />
               <p v-if="formSubmitted && formErrors.userName" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  Vui lòng nhập tên người dùng
               </p>
            </div>

            <!-- Email Field -->
            <div>
               <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email <span class="text-red-500">*</span>
               </label>
               <input v-model="email" type="email" id="email" :class="[
                  'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500',
                  (formSubmitted && formErrors.email)
                     ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
                     : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
               ]" placeholder="Email" required />
               <p v-if="formSubmitted && formErrors.email" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  Vui lòng nhập email hợp lệ
               </p>
            </div>

            <!-- Password Field -->
            <div>
               <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mật khẩu <span class="text-red-500">*</span>
               </label>
               <div class="relative">
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" :class="[
                     'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500',
                     (formSubmitted && formErrors.password)
                        ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
                  ]" placeholder="Password" required />
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
               <p v-if="formSubmitted && formErrors.password" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  Vui lòng nhập mật khẩu
               </p>
            </div>

            <!-- Re-Password Field -->
            <div>
               <label for="re-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Xác minh mật khẩu <span class="text-red-500">*</span>
               </label>
               <div class="relative">
                  <input v-model="rePassword" :type="showRePassword ? 'text' : 'password'" id="re-password" :class="[
                     'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500',
                     (formSubmitted && (formErrors.rePassword || formErrors.passwordMatch))
                        ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
                  ]" placeholder="Password" required />
                  <svg v-if="rePassword" @click="showRePassword = !showRePassword"
                     class="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                     <!-- Slash Eye Icon (when showRePassword is true) -->
                     <path v-if="showRePassword" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                     <!-- Open Eye Icon (when showRePassword is false) -->
                     <path v-else stroke="currentColor" stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                     <path v-if="!showRePassword" stroke="currentColor" stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
               </div>
               <!-- Show appropriate error message -->
               <p v-if="formErrors.rePassword" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  Vui lòng xác minh mật khẩu
               </p>
               <p v-else-if="formErrors.passwordMatch && password && password !== rePassword"
                  class="mt-2 text-sm text-red-600 dark:text-red-500">
                  Mật khẩu không khớp
               </p>
            </div>
         </div>

         <p class="text-sm text-blue-500 hover:underline cursor-pointer text-center mb-4">
            Quên mật khẩu?
         </p>

         <!-- Google Sign-In Error Message -->
         <div v-if="googleError"
            class="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {{ googleError }}
         </div>

         <button type="submit"
            class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 cursor-pointer">
            Đăng ký
         </button>

         <p class="text-sm text-center mt-4">
            Đã có tài khoản?
            <router-link to="/user/login" custom v-slot="{ navigate }">
               <a href="#" class="text-blue-500 hover:underline cursor-pointer" @click="navigate">Đăng nhập ngay!</a>
            </router-link>
         </p>

         <div class="flex items-center my-3">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-4 text-gray-500 text-sm">Hoặc</span>
            <div class="flex-1 border-t border-gray-300"></div>
         </div>

         <button type="button" @click="handleGoogleSignIn" :disabled="!isGapiLoaded"
            class="w-full text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:bg-gray-600 dark:text-white dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
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
            <span class="flex-1">Đăng ký với Google</span>
         </button>
      </form>
   </div>
</template>