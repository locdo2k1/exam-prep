<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-2 flex items-center flex-wrap">
      {{ title }}
      <span class="bg-orange-400 text-white px-3 py-1 rounded-md text-lg ml-2 font-medium">{{ partName }}</span>
    </h1>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  partName: {
    type: String,
    required: true
  }
});
</script>
