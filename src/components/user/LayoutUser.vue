<template>
   <Header :key="route.fullPath" />
   <router-view />
   <Footer />
</template>

<script setup>
import { useRoute } from 'vue-router';
import Footer from './Footer.vue';
import Header from './Header.vue'
import Home from './Home.vue';

const route = useRoute();
</script>