<template>
  <div class="mb-8">
    <h5 v-if="partTitle" class="text-md font-semibold text-gray-900 mb-4">{{ partTitle }}</h5>
    
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
  [key: string]: any;
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
  showWarning: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
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
