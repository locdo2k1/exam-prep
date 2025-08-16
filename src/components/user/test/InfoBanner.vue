<template>
  <div class="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-start space-x-3">
    <div class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="text-green-800 text-sm leading-relaxed">
      <strong>Chú ý:</strong> Bạn có thể tạo flashcards từ highlights (bao gồm các highlights các bạn đã tạo trước đây) trong trang chi tiết kết quả bài thi. 
      <a href="#" class="text-green-700 underline hover:text-green-900 transition-colors" @click="$emit('toggle-guide')">
        {{ showGuide ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn' }}.
      </a>
      <div v-if="showGuide" class="mt-4 text-center">
        <div class="bg-black rounded-lg p-4 max-w-lg mx-auto">
          <div class="text-white text-sm">YouTube video player would be embedded here</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showGuide: {
    type: Boolean,
    required: true
  }
});

defineEmits(['toggle-guide']);
</script>
