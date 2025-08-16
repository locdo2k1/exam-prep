<template>
  <div class="flex space-x-4 mb-8">
    <a 
      :href="primaryButton.href" 
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
    >
      {{ primaryButton.text }}
    </a>
    <button 
      v-if="secondaryButton"
      @click="$emit('secondary-click')" 
      class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
    >
      {{ secondaryButton.text }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  primaryButton: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'text' in value && 'href' in value;
    }
  },
  secondaryButton: {
    type: Object,
    default: null,
    validator: (value) => {
      return value === null || ('text' in value);
    }
  }
});

defineEmits(['secondary-click']);
</script>
