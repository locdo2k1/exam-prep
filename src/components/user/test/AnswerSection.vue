<template>
  <div id="result-answers" class="mb-8">
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-lg font-semibold text-gray-900">Đáp án</h4>
      <div class="flex space-x-2">
        <button 
          v-for="(action, index) in actions" 
          :key="index"
          @click="$emit('action-click', action)"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
    
    <div v-if="showWarning" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <span class="text-red-700 text-sm font-italic">
        Chú ý: Khi làm lại các câu sai, điểm trung bình của bạn sẽ KHÔNG BỊ ẢNH HƯỞNG.
      </span>
    </div>

    <div class="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-start space-x-3">
      <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div class="text-green-800 text-sm">
        <strong>Tips:</strong> Khi xem chi tiết đáp án, bạn có thể tạo và lưu highlight từ vựng, keywords và tạo note đề học và tra cứu khi có nhu cầu ôn lại đề thi này trong tương lai.
      </div>
    </div>

    <h5 class="text-md font-semibold text-gray-900 mb-4">{{ partTitle }}</h5>
    
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <!-- First column -->
        <div class="divide-y divide-gray-200">
          <div 
            v-for="answer in firstColumnAnswers"
            :key="answer.number"
            class="flex items-center justify-between p-5 hover:bg-gray-50"
          >
            <div class="flex items-center space-x-4">
              <span class="font-bold text-gray-900 min-w-[1.5rem]">{{ answer.number }}</span>
              <div class="flex items-center space-x-2">
                <span class="font-medium text-gray-900">{{ answer.correct }}:</span>
                <div class="flex items-center space-x-1">
                  <span v-if="answer.status === 'unanswered'" class="text-gray-500 italic text-sm">
                    chưa trả lời
                  </span>
                  <span v-else-if="answer.status === 'correct'" class="text-sm">
                    {{ answer.userAnswer }}
                  </span>
                  <span v-else-if="answer.status === 'wrong'" class="text-sm line-through text-gray-500">
                    {{ answer.userAnswer }}
                  </span>
                  
                  <svg v-if="answer.status === 'correct'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg v-else-if="answer.status === 'wrong'" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <button 
              @click="$emit('question-click', answer)" 
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              [Chi tiết]
            </button>
          </div>
        </div>
        
        <!-- Second column -->
        <div class="divide-y divide-gray-200">
          <div 
            v-for="answer in secondColumnAnswers"
            :key="answer.number"
            class="flex items-center justify-between p-5 hover:bg-gray-50"
          >
            <div class="flex items-center space-x-4">
              <span class="font-bold text-gray-900 min-w-[1.5rem]">{{ answer.number }}</span>
              <div class="flex items-center space-x-2">
                <span class="font-medium text-gray-900">{{ answer.correct }}:</span>
                <div class="flex items-center space-x-1">
                  <span v-if="answer.status === 'unanswered'" class="text-gray-500 italic text-sm">
                    chưa trả lời
                  </span>
                  <span v-else-if="answer.status === 'correct'" class="text-sm">
                    {{ answer.userAnswer }}
                  </span>
                  <span v-else-if="answer.status === 'wrong'" class="text-sm line-through text-gray-500">
                    {{ answer.userAnswer }}
                  </span>
                  
                  <svg v-if="answer.status === 'correct'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg v-else-if="answer.status === 'wrong'" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <button 
              @click="$emit('question-click', answer)" 
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              [Chi tiết]
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

type AnswerStatus = 'correct' | 'wrong' | 'unanswered';

interface Answer {
  number: number;
  correct: string;
  status: AnswerStatus;
  userAnswer?: string;
  [key: string]: any; // For any additional properties
}

interface Action {
  type: string;
  label: string;
}

const props = defineProps({
  partTitle: {
    type: String,
    required: true
  },
  answers: {
    type: Array as PropType<Answer[]>,
    required: true,
    validator: (answers: any): answers is Answer[] => {
      return Array.isArray(answers) && answers.every(answer => {
        const hasRequiredProps = 'number' in answer && 'correct' in answer && 'status' in answer;
        const hasValidStatus = ['correct', 'wrong', 'unanswered'].includes(answer.status);
        return hasRequiredProps && hasValidStatus;
      });
    }
  },
  actions: {
    type: Array as PropType<Action[]>,
    default: () => [
      { type: 'view-details', label: 'Xem chi tiết đáp án' },
      { type: 'retry-wrong', label: 'Làm lại các câu sai' }
    ] as const
  },
  showWarning: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: 'action-click', action: Action): void;
  (e: 'question-click', answer: Answer): void;
}>();

// Split answers into two columns
const firstColumnAnswers = computed<Answer[]>(() => {
  const middleIndex = Math.ceil(props.answers.length / 2);
  return props.answers.slice(0, middleIndex);
});

const secondColumnAnswers = computed<Answer[]>(() => {
  const middleIndex = Math.ceil(props.answers.length / 2);
  return props.answers.slice(middleIndex);
});
</script>
