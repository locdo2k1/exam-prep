<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click="close">
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[80vh] overflow-y-auto w-full transform transition-all duration-300 scale-100"
      @click.stop>
      <!-- Header -->
      <div
        class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ question?.number }}</span>
          </div>
          <h3 class="text-xl font-bold text-white">Chi tiết câu hỏi</h3>
        </div>
        <button @click="close"
          class="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <slot>
          <div v-if="question">
            <p class="mb-6 text-gray-500 text-sm italic">Nội dung chi tiết câu hỏi sẽ được hiển thị tại đây...</p>

            <div class="space-y-4">
              <!-- Status Badge -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span class="text-gray-600 font-medium">Trạng thái</span>
                <span :class="getStatusBadgeClass(question.status)"
                  class="px-3 py-1 rounded-full text-sm font-semibold">
                  {{ getStatusText(question.status) }}
                </span>
              </div>

              <!-- User Answer -->
              <div v-if="question.status !== 'unanswered'" class="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p class="text-gray-600 text-sm mb-2">Đáp án của bạn</p>
                <p class="text-lg font-semibold text-amber-700">{{ question.userAnswer || 'Không có' }}</p>
              </div>

              <!-- Correct Answer -->
              <div class="p-4 bg-green-50 rounded-xl border border-green-200">
                <p class="text-gray-600 text-sm mb-2">Đáp án đúng</p>
                <p class="text-lg font-semibold text-green-700">{{ question.correct }}</p>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
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

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'correct': 'Đúng',
    'wrong': 'Sai',
    'unanswered': 'Chưa trả lời'
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    'correct': 'bg-green-100 text-green-700',
    'wrong': 'bg-red-100 text-red-700',
    'unanswered': 'bg-gray-100 text-gray-700'
  };
  return classMap[status] || 'bg-gray-100 text-gray-700';
};
</script>
