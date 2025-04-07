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
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Chương trình học</a>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Đề thi online</a>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Flashcards</a>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Blog</a>
               </li>
               <li>
                  <a href="#" class="block py-2 text-gray-600 hover:text-blue-900 md:p-0">Kích hoạt tài khoản</a>
               </li>
               <li class="mt-3 md:mt-0">
                  <router-link to="/user/login" custom v-slot="{ navigate }">
                     <a href="#"
                        class="block w-full py-3 md:py-2 text-center text-white bg-blue-900 md:px-4 rounded-[25px] md:text-[15.4px] cursor-pointer"
                        @click="navigate">Đăng
                        nhập</a>
                  </router-link>
               </li>
            </ul>
         </div>
      </nav>
   </header>
</template>

<script>
SpeechSynthesisUtterance
export default {
   name: 'HeaderComponent',
   data() {
      return {
         isMobileMenuOpen: false
      }
   },
   methods: {
      toggleMobileMenu() {
         this.isMobileMenuOpen = !this.isMobileMenuOpen;
         const navbarDefault = document.getElementById('navbar-default');
         navbarDefault.classList.toggle('open');
      }
   }
}
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