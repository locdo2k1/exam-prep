<template>
   <div>
      <Header :key="route.fullPath" />
      <router-view />
      <Footer />
   </div>
</template>

<script setup>
// Import the Header component
import Footer from './Footer.vue';
import Header from './Header.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style>
::-ms-reveal {
   display: none;
}
</style>