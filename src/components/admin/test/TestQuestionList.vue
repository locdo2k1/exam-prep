<template>
  <div class="space-y-4">
    <!-- Question Sets Section -->
    <div v-if="listQuestionSet?.length" class="mb-6">
      <h3 class="text-lg font-medium mb-3 dark:text-white">Question Sets</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(questionSet, index) in listQuestionSet" 
          :key="`set-${index}`"
          class="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 dark:bg-gray-800"
          @click="emit('select-question-set', questionSet)"
        >
          <h4 class="font-medium text-gray-900 dark:text-white">{{ questionSet.name || `Question Set ${index + 1}` }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ questionSet.questions?.length || 0 }} questions</p>
        </div>
      </div>
    </div>

    <!-- Questions Section -->
    <div v-if="listQuestion?.length">
      <h3 class="text-lg font-medium mb-3 dark:text-white">Questions</h3>
      <div class="space-y-3">
        <div 
          v-for="(question, index) in listQuestion" 
          :key="`question-${index}`"
          class="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 dark:bg-gray-800"
          @click="emit('select-question', question)"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ question.content || `Question ${index + 1}` }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ question.points || 1 }} point{{ question.points !== 1 ? 's' : '' }}
              </p>
            </div>
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {{ getQuestionType(question) }}
            </span>
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
}>();

const getQuestionType = (question: Question) => {
  if (question.options && question.options.length > 0) {
    return 'Multiple Choice';
  }
  return 'Text';
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
