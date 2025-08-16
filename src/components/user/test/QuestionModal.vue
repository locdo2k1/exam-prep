<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto w-full mx-4" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Chi tiết câu hỏi {{ question?.number }}</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="text-gray-600">
        <slot>
          <div v-if="question">
            <p class="mb-4">Nội dung chi tiết câu hỏi sẽ được hiển thị tại đây...</p>
            <div class="space-y-2">
              <p><strong>Số câu:</strong> {{ question.number }}</p>
              <p><strong>Trạng thái:</strong> {{ getStatusText(question.status) }}</p>
              <p v-if="question.status !== 'unanswered'">
                <strong>Đáp án của bạn:</strong> {{ question.userAnswer || 'Không có' }}
              </p>
              <p><strong>Đáp án đúng:</strong> {{ question.correct }}</p>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  question: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const getStatusText = (status) => {
  const statusMap = {
    'correct': 'Đúng',
    'wrong': 'Sai',
    'unanswered': 'Chưa trả lời'
  };
  return statusMap[status] || status;
};
</script>
