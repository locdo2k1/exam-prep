<template>
  <div class="space-y-3">
    <!-- Combined List of Questions and Question Sets -->
    <div v-if="combinedItems.length">
      <div class="space-y-4">
        <div v-for="(item, index) in combinedItems" :key="`item-${item.id || index}`"
          class="group relative p-5 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border-gray-200 hover:border-blue-100 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
          :class="{
            'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10': isQuestionSet(item),
            'hover:border-blue-200': !isQuestionSet(item)
          }">
          <!-- Item Header -->
          <div class="flex items-start justify-between mb-2">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              <template v-if="isQuestionSet(item)">
                <span class="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-blue-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {{ item.name || `Question Set ${index + 1}` }}
                </span>
              </template>
              <template v-else>
                Question {{ item.order }}
              </template>
            </h4>
            <div class="flex items-center space-x-2">
              <span v-if="!isQuestionSet(item)"
                class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {{ getQuestionType(item) }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {{ isQuestionSet(item) ? `${item.questions?.length || 0} questions` : `${item.points || 1}
                pt${item.points !== 1 ?
                    's' : ''}` }}
              </span>
              <button @click.stop="handleRemove(item)"
                class="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                :aria-label="isQuestionSet(item) ? 'Remove question set' : 'Remove question'"
                :title="isQuestionSet(item) ? 'Remove question set' : 'Remove question'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Item Content -->
          <div>
            <!-- Question Set Content -->
            <div v-if="isQuestionSet(item)" class="mt-3">
              <div v-if="item.questions?.length" class="space-y-3 mt-3">
                <div v-for="(question, qIndex) in item.questions" :key="`q-${question.id || qIndex}`"
                  class="p-4 bg-white dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700/80 hover:border-blue-100 dark:hover:border-blue-900/50 transition-colors duration-150">
                  <div class="flex items-start justify-between mb-3">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Question {{ question.order }}
                    </h5>
                    <div class="flex items-center gap-2">
                      <span
                        class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {{ getQuestionType(question) }}
                      </span>
                      <span
                        class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {{ question.points || 1 }} pt{{ question.points !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>

                  <div class="text-sm text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                    <div class="prose prose-sm dark:prose-invert max-w-none"
                      v-html="question.content || question.prompt || question.questionText || 'No question text provided'">
                    </div>
                  </div>

                  <!-- Question Options -->
                  <div v-if="question.options?.length" class="space-y-2 mt-3">
                    <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-start text-sm"
                      :class="{
                        'text-green-700 dark:text-green-300 font-medium': isCorrectAnswer(question, oIndex),
                        'text-gray-700 dark:text-gray-300': !isCorrectAnswer(question, oIndex)
                      }">
                      <span
                        class="inline-flex items-center justify-center w-5 h-5 mt-0.5 mr-2 text-xs font-medium rounded-full flex-shrink-0"
                        :class="{
                          'bg-green-100 text-green-700 dark:bg-green-900/50': isCorrectAnswer(question, oIndex),
                          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300': !isCorrectAnswer(question, oIndex)
                        }">
                        {{ String.fromCharCode(65 + oIndex) }}
                      </span>
                      <div class="flex-1">
                        <div class="break-words leading-normal" v-html="option.text || `Option ${oIndex + 1}`"></div>
                      </div>
                      <span v-if="isCorrectAnswer(question, oIndex)"
                        class="ml-2 px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 text-xs whitespace-nowrap flex-shrink-0 flex items-center border border-green-100 dark:border-green-800/50 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-300" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                        </svg>
                        <span class="font-medium">Correct</span>
                      </span>
                    </div>
                  </div>
                  <!-- Fill in the Blank Answers -->
                  <div v-else="question.type === 'Fill in the Blank' && item.correctAnswer?.length" class="mt-3">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Acceptable Answers:
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <template v-if="Array.isArray(question.correctAnswer)">
                        <span v-for="(answer, answerIndex) in question.correctAnswer" :key="answerIndex"
                          class="px-2.5 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                          "{{ answer }}"
                        </span>
                      </template>
                      <span v-else
                        class="px-2.5 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                        "{{ question.correctAnswer }}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                No questions in this set
              </div>
            </div>

            <!-- Regular Question Content -->
            <div v-else>
              <div class="mb-3">
                <div
                  class="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 prose dark:prose-invert prose-sm max-w-none"
                  v-html="item.content || item.prompt || item.questionText || 'No question text provided'"></div>
              </div>

              <!-- Fill in the Blank Answers -->
              <div v-if="item.type === 'Fill in the Blank' && item.correctAnswer?.length" class="mt-3">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Acceptable Answers:
                </div>
                <div class="flex flex-wrap gap-2">
                  <template v-if="Array.isArray(item.correctAnswer)">
                    <span v-for="(answer, answerIndex) in item.correctAnswer" :key="answerIndex"
                      class="px-2.5 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                      "{{ answer }}"
                    </span>
                  </template>
                  <span v-else
                    class="px-2.5 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                    "{{ item.correctAnswer }}"
                  </span>
                </div>
              </div>

              <!-- Options (for questions only) -->
              <div v-if="item.options?.length && item.type !== 'Fill in the Blank'" class="space-y-1.5 mt-2">
                <div v-for="(option, i) in item.options" :key="i"
                  class="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <span class="font-medium w-4 mr-1.5">{{ String.fromCharCode(65 + i) }}.</span>
                  <div class="flex items-center flex-1">
                    <div class="break-words prose dark:prose-invert prose-sm max-w-none"
                      v-html="option.text || `Option ${i + 1}`"></div>
                    <span v-if="isCorrectAnswer(item, i)"
                      class="ml-2 px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 text-xs whitespace-nowrap flex-shrink-0 flex items-center border border-green-100 dark:border-green-800/50">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-300" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                      Correct
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
  const option = question.options?.[optionIndex];
  return option?.correct || false;
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
