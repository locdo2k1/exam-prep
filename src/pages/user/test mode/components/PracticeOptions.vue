<template>
  <div class="mb-6">
    <!-- Tab Headers -->
    <div class="flex space-x-1 rounded-t-lg bg-gray-100 p-1 overflow-x-auto">
      <button
        v-for="option in options"
        :key="option.value"
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
        :class="{
          'bg-white text-blue-600 shadow-sm': modelValue === option.value,
          'text-gray-600 hover:bg-gray-200': modelValue !== option.value
        }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-b-lg border border-t-0 border-gray-200 p-4">
      <transition name="fade" mode="out-in">
        <div>
          <div 
            v-for="option in options"
            v-show="modelValue === option.value"
            :key="option.value"
            class="animate-fade-in"
          >
            <slot :name="option.value" :option="option">
              <p class="text-gray-600">{{ option.description || `Nội dung cho ${option.label}` }}</p>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

export interface PracticeOption {
  value: string;
  label: string;
  description?: string;
  // Add any additional properties that might be needed for dynamic content
  [key: string]: any;
}

interface Props {
  modelValue: string;
  options?: PracticeOption[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'practice',
  options: () => [
    { value: 'practice', label: 'Luyện tập' },
    { value: 'full-test', label: 'Làm full test' },
    { value: 'discuss', label: 'Thảo luận' }
  ]
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
