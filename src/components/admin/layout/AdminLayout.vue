<template>
  <div class="min-h-screen flex">
    <app-sidebar />
    <Backdrop />
    <div class="min-h-screen relative flex-1" :class="[
      { 'h-screen overflow-hidden': isPopupVisible },
      isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
    ]">
      <!-- Use CSS Grid: first row auto for header, second row 1fr for content -->
      <div class="grid grid-rows-[auto_1fr] h-full">
        <app-header />
        <div class="overflow-auto p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 w-full">
          <router-view />
        </div>
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
