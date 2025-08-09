<script setup lang="ts">
import AdminLayout from './AdminLayout.vue';
import ThemeProvider from './ThemeProvider.vue';
import SidebarProvider from './SidebarProvider.vue';
</script>

<template>
   <ThemeProvider>
      <SidebarProvider>
         <AdminLayout />
      </SidebarProvider>
   </ThemeProvider>
</template>