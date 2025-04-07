<template>
   <div>
      <Header />
      <router-view />
      <Footer />
   </div>
</template>

<script setup>
// Import the Header component
import Footer from './Footer.vue';
import Header from './Header.vue'
</script>

<style>
::-ms-reveal {
   display: none;
}
</style>