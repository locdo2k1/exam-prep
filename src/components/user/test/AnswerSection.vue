<template>
  <div class="mb-8">
    <!-- Part Title with Icon -->
    <div v-if="partTitle" class="flex items-center space-x-3 mb-4">
      <div
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h5 class="text-lg font-bold text-gray-900">{{ partTitle }}</h5>
    </div>

    <!-- Answer Grid -->
    <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
        <div v-for="answer in props.answers" :key="answer.number" :class="[
          'bg-white p-3 transition-all duration-200 hover:shadow-lg hover:z-10 cursor-pointer group',
          answer.status === 'correct' ? 'hover:bg-green-50' :
            answer.status === 'wrong' ? 'hover:bg-red-50' :
              'hover:bg-gray-50'
        ]" @click="$emit('question-click', answer)">

          <div class="flex items-start space-x-3">
            <!-- Left: Question Number & Status -->
            <div class="flex flex-col items-center space-y-1.5 flex-shrink-0">
              <!-- Question Number Badge -->
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shadow-sm transition-transform group-hover:scale-110',
                answer.status === 'correct' ? 'bg-green-100 text-green-700' :
                  answer.status === 'wrong' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
              ]">
                {{ answer.number }}
              </div>

              <!-- Status Icon -->
              <div :class="[
                'flex items-center justify-center w-5 h-5 rounded-full transition-transform group-hover:scale-110',
                answer.status === 'correct' ? 'bg-green-500' :
                  answer.status === 'wrong' ? 'bg-red-500' :
                    'bg-gray-400'
              ]">
                <svg v-if="answer.status === 'correct'" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else-if="answer.status === 'wrong'" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Right: Answer Content -->
            <div class="flex-1 min-w-0">
              <div class="space-y-1.5">
                <!-- User Answer -->
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Bạn chọn:</p>
                  <div class="flex items-start">
                    <span v-if="answer.status === 'unanswered'" class="text-sm text-gray-400 italic">
                      Chưa trả lời
                    </span>
                    <span v-else-if="answer.status === 'correct'" class="text-sm font-semibold text-green-700">
                      {{ answer.userAnswer }}
                    </span>
                    <span v-else-if="answer.status === 'wrong'" class="text-sm font-semibold text-red-600 line-through">
                      {{ answer.userAnswer }}
                    </span>
                  </div>
                </div>

                <!-- Correct Answer (only show if wrong or unanswered) -->
                <div v-if="answer.status !== 'correct'">
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Đáp án đúng:</p>
                  <p class="text-sm font-bold text-gray-900">{{ answer.correct }}</p>
                </div>
              </div>

              <!-- View Details Button -->
              <div class="mt-2 pt-2 border-t border-gray-100">
                <button
                  class="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 group-hover:underline transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Chi tiết</span>
                </button>
              </div>
            </div>
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
  userAnswer?: string | null;
  transcript?: string;
  outerContent?: string;
  explanation?: string;
  questionAudios?: any[];
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
