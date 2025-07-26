<template>
  <div class="space-y-3">
    <!-- Combined List of Questions and Question Sets -->
    <div v-if="combinedItems.length">
      <div class="space-y-3">
        <div 
          v-for="(item, index) in combinedItems" 
          :key="`item-${item.id || index}`"
          class="group relative p-4 border rounded-lg cursor-pointer border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          @click="handleItemClick(item)"
          :class="{ 'border-blue-200 dark:border-blue-800': isQuestionSet(item) }"
        >
          <!-- Item Header -->
          <div class="flex items-start justify-between mb-2">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              <template v-if="isQuestionSet(item)">
                <span class="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {{ item.name || `Question Set ${index + 1}` }}
                </span>
              </template>
              <template v-else>
                Question {{ index + 1 }}
              </template>
            </h4>
            <div class="flex items-center space-x-2">
              <span v-if="!isQuestionSet(item)" class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {{ getQuestionType(item) }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {{ isQuestionSet(item) ? `${item.questions?.length || 0} questions` : `${item.points || 1} pt${item.points !== 1 ? 's' : ''}` }}
              </span>
              <button 
                @click.stop="handleRemove(item)"
                class="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                :aria-label="isQuestionSet(item) ? 'Remove question set' : 'Remove question'"
                :title="isQuestionSet(item) ? 'Remove question set' : 'Remove question'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Item Content -->
          <div v-if="!isQuestionSet(item)">
            <div class="mb-3">
              <div 
                class="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 prose dark:prose-invert prose-sm max-w-none"
                v-html="item.content || item.prompt || item.questionText || 'No question text provided'"
              ></div>
            </div>
            
            <!-- Options (for questions only) -->
            <div v-if="item.options?.length" class="space-y-1.5 mt-2">
              <div 
                v-for="(option, i) in item.options" 
                :key="i" 
                class="flex items-center text-xs text-gray-600 dark:text-gray-300"
              >
                <span class="font-medium w-4 mr-1.5">{{ String.fromCharCode(65 + i) }}.</span>
                <div class="flex items-center flex-1">
                  <div class="break-words prose dark:prose-invert prose-sm max-w-none" v-html="option.text || `Option ${i + 1}`"></div>
                  <span 
                    v-if="isCorrectAnswer(item, i)" 
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
    </div>

    <!-- Empty State -->
    <div 
      v-else
      class="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No questions or question sets yet</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding a new question or question set.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import type { Question, QuestionSet } from '@/types';

type QuestionOrQuestionSet = Question | QuestionSet;

interface Props {
  listQuestionAndQuestionSet: Array<Question | QuestionSet>;
}

const props = withDefaults(defineProps<Props>(), {
  listQuestionAndQuestionSet: () => []
});

const emit = defineEmits<{
  'select-question': [question: Question];
  'select-question-set': [questionSet: QuestionSet];
  'remove-question': [questionId: string];
  'remove-question-set': [questionSetId: string];
}>();

// Combined items with their original type information
const combinedItems = computed(() => {
  return [...props.listQuestionAndQuestionSet].sort((a, b) => {
    // Sort by order if available, otherwise maintain original order
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
});

// Check if an item is a question set
const isQuestionSet = (item: Question | QuestionSet): item is QuestionSet => {
  return 'questions' in item && !('type' in item);
};

// Handle item click - emit appropriate event based on item type
const handleItemClick = (item: Question | QuestionSet) => {
  if (isQuestionSet(item)) {
    emit('select-question-set', item);
  } else {
    emit('select-question', item);
  }
};

// Handle remove button click
const handleRemove = (item: Question | QuestionSet) => {
  if (isQuestionSet(item)) {
    emit('remove-question-set', item.id || '');
  } else {
    emit('remove-question', item.id || '');
  }
};

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
