<template>
  <div 
    class="p-4 mb-3 border rounded-lg transition-colors cursor-pointer"
    :class="{
      'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30': isSelected,
      'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700': !isSelected
    }"
    @click="$emit('select')"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Question {{ questionNumber }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ question.preview || 'Click to edit question' }}
        </p>
      </div>
      <button 
        v-if="showRemove"
        @click.stop="$emit('remove')"
        class="ml-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 -mt-1 -mr-1"
        aria-label="Remove question"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showRemove: {
    type: Boolean,
    default: true
  }
});

defineEmits(['select', 'remove']);
</script>
