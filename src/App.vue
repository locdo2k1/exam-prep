<script setup lang="ts">
import ThemeProvider from './components/admin/layout/ThemeProvider.vue';
import SidebarProvider from './components/admin/layout/SidebarProvider.vue';
</script>

<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<style scoped>
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>
