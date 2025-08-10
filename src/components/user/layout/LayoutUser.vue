<template>
   <Header :key="route.fullPath" />
   <router-view />
   <Footer />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Footer from './UserFooter.vue';
import Header from './UserHeader.vue'

const route = useRoute();
</script>
<style>
::-ms-reveal {
   display: none;
}
</style>

<style src="@/style.css"></style>