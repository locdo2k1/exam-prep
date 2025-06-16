<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
            <div
      class="relative flex-1 transition-all duration-300 ease-in-out"
      :class="[
        { 'h-screen overflow-hidden': isPopupVisible },
        isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
      ]" >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar';
import { usePopup } from '@/composables/usePopup';
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar();
const { isPopupVisible } = usePopup();
</script>
