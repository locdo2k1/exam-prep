<template>
  <div class="space-y-4">
    <!-- Question Sets Section -->
    <div v-if="listQuestionSet?.length" class="mb-6">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(questionSet, index) in listQuestionSet" 
          :key="`set-${index}`"
          class="p-4 border rounded-lg hover:shadow-m cursor-pointer dark:border-gray-700 dark:bg-gray-800"
          @click="emit('select-question-set', questionSet)"
        >
          <h4 class="font-medium text-gray-900 dark:text-white">{{ questionSet.name || `Question Set ${index + 1}` }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ questionSet.questions?.length || 0 }} questions</p>
        </div>
      </div>
    </div>

    <!-- Questions Section -->
    <div v-if="listQuestion?.length">
      <div class="space-y-3">
        <div 
          v-for="(question, index) in listQuestion" 
          :key="`question-${index}`"
          class="group relative p-4 mb-4 border rounded-lg cursor-pointer border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <!-- Remove Button -->
          <button 
            @click.stop="$emit('remove-question', question.id || index)"
            class="absolute -top-2 -right-2 p-1.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
            aria-label="Remove question"
            title="Remove question"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Question Header -->
          <div class="flex items-start justify-between mb-2">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Question {{ index + 1 }}
            </h4>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {{ getQuestionType(question) }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {{ question.points || 1 }} pt{{ question.points !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>
          
          <!-- Question Content -->
          <div class="mb-3">
            <div 
              class="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 prose dark:prose-invert prose-sm max-w-none"
              v-html="question.content || question.prompt || 'No question text provided'"
            ></div>
          </div>
          
          <!-- Options (if any) -->
          <div v-if="question.options?.length" class="space-y-1.5 mt-2">
            <div 
              v-for="(option, i) in question.options" 
              :key="i" 
              class="flex items-center text-xs text-gray-600 dark:text-gray-300"
            >
              <span class="font-medium w-4 mr-1.5">{{ String.fromCharCode(65 + i) }}.</span>
              <div class="flex items-center flex-1">
                <div class="break-words prose dark:prose-invert prose-sm max-w-none" v-html="option.text || `Option ${i + 1}`"></div>
                <span 
                  v-if="isCorrectAnswer(question, i)" 
                  class="ml-2 px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[11px] whitespace-nowrap"
                >
                  Correct
                </span>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="!listQuestionSet?.length && !listQuestion?.length"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      No questions or question sets available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Question, QuestionSet } from '@/types';

interface Props {
  listQuestion: Question[];
  listQuestionSet: QuestionSet[];
}

const props = withDefaults(defineProps<Props>(), {
  listQuestion: () => [],
  listQuestionSet: () => []
});

const emit = defineEmits<{
  'select-question': [question: Question];
  'select-question-set': [questionSet: QuestionSet];
  'remove-question': [questionId: string | number];
}>();

const getQuestionType = (question: Question) => {
  if (!question.type) return 'Unknown';
  return question.type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const isCorrectAnswer = (question: Question, optionIndex: number): boolean => {
  if (!question.correctAnswer || !question.options?.length) return false;
  
  const option = question.options[optionIndex];
  if (!option) return false;
  
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(option.text || '');
  }
  
  return question.correctAnswer === option.text;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
