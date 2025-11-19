<template>
   <header class="bg-white shadow-sm">
      <nav class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-3">
         <!-- Logo and mobile menu wrapper -->
         <div class="flex items-center justify-between md:w-auto w-full">
            <!-- Logo -->
            <a href="/" class="focus:outline-none">
               <img :src="'/images/logo/logo.png'" class="h-10 mr-2" alt="Study4 Logo" />
            </a>

            <!-- Mobile menu button -->
            <button @click="toggleMobileMenu" id="mobile-menu-button" type="button"
               class="items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none hidden"
               aria-controls="navbar-default" :aria-expanded="isMobileMenuOpen">
               <span class="sr-only">Open main menu</span>
               <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                     d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                     clip-rule="evenodd"></path>
               </svg>
            </button>
         </div>

         <!-- Navigation Links -->
         <div class="w-full md:w-auto md:block" id="navbar-default" :class="isMobileMenuOpen ? 'open' : ''">
            <ul
               class="font-medium flex flex-col p-0 mt-4 md:flex-row md:space-x-6 md:mt-0 md:border-0 md:bg-white md:items-center">
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Giới thiệu</a>
               </li>
               <li>
                  <router-link to="/user/tests" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Đề thi online</router-link>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Flashcards</a>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Blog</a>
               </li>
               <li class="mt-3 md:mt-0" v-if="!isAuthenticated">
                  <router-link to="/user/login" custom v-slot="{ navigate }">
                     <a href="#"
                        class="block w-full py-3 md:py-2 text-center text-white bg-blue-900 md:px-4 rounded-[25px] md:text-[15.4px] cursor-pointer"
                        @click="navigate">Đăng
                        nhập</a>
                  </router-link>
               </li>

               <!-- User dropdown menu when authenticated -->
               <li class="relative" v-else>
                  <div class="flex items-center cursor-pointer" @click="toggleUserMenu">
                     <!-- <img src="/images/avatar-placeholder.png" alt="User avatar" class="w-8 h-8 rounded-full" /> -->
                     <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                           d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                           clip-rule="evenodd"></path>
                     </svg>
                  </div>

                  <!-- Dropdown menu -->
                  <div v-show="isUserMenuOpen"
                     class="absolute right-0 mt-5 w-64 bg-white rounded shadow-lg z-50 border border-gray-200">
                     <!-- Notifications section -->
                     <div class="p-4 border-b border-gray-200">
                        <h3 class="text-base font-medium text-gray-700">Thông báo</h3>
                        <p class="text-sm text-gray-500 my-2">Bạn chưa có thông báo mới.</p>
                        <a href="#" class="text-sm text-blue-600 hover:underline">Xem tất cả >></a>
                     </div>

                     <!-- Menu items -->
                     <div class="py-1">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lịch học của tôi</a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trang cá nhân</a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="logout">Đăng
                           xuất</a>
                     </div>
                  </div>
               </li>
            </ul>
         </div>
      </nav>
   </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const isAuthenticated = ref(false);
const router = useRouter();

const handleAuthChanged = () => {
   isAuthenticated.value = !!localStorage.getItem('token');
};

const toggleMobileMenu = () => {
   isMobileMenuOpen.value = !isMobileMenuOpen.value;
   const navbarDefault = document.getElementById('navbar-default');
   if (navbarDefault) {
      navbarDefault.classList.toggle('open');
   }
};

const toggleUserMenu = () => {
   isUserMenuOpen.value = !isUserMenuOpen.value;
};

const logout = () => {
   // Implement your logout logic here
   isAuthenticated.value = false;
   localStorage.removeItem('token');
   window.dispatchEvent(new Event('auth-changed'));
   // Example: redirect to home page or login page
   router.push('/');
   window.location.reload();
};

onMounted(() => {
   // Listen for auth changes (login/logout)
   window.addEventListener('auth-changed', handleAuthChanged);

   // Close user menu when clicking outside
   document.addEventListener('click', (event: MouseEvent) => {
      const userMenu = document.querySelector('.relative') as HTMLElement | null;
      const target = event.target as Node | null;
      if (userMenu && target && !userMenu.contains(target) && isUserMenuOpen.value) {
         isUserMenuOpen.value = false;
      }
   });

   // Here you would check if the user is authenticated
   // Example:
   // isAuthenticated.value = this.$store.getters.isAuthenticated;
   // or
   isAuthenticated.value = !!localStorage.getItem('token');
});

onUnmounted(() => {
   window.removeEventListener('auth-changed', handleAuthChanged);
});
</script>


<style scoped>
/* Adjust mobile menu styles */
@media (max-width: 767px) {
   #navbar-default {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.7s ease-in-out;
   }

   #navbar-default.open {
      max-height: 600px;
   }

   #navbar-default ul {
      background-color: white;
   }

   #navbar-default a {
      padding-left: 0;
      padding-right: 0;
   }

   #mobile-menu-button {
      display: inline-flex;
   }
}
</style>