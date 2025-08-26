<template>
  <div class="p-6">
    <!-- Test Stats -->
    <div class="flex items-center space-x-6 mb-4">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Thời gian làm bài: {{ timeLimit }} | {{ partsCount }} phần thi | {{ questionCount }} câu hỏi
      </div>
    </div>

    <div class="flex items-center text-sm text-gray-600 mb-6">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      {{ participants }} người đã luyện tập đề thi này
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  timeLimit?: string;
  partsCount?: number;
  questionCount?: number;
  participants?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
});
</script>
