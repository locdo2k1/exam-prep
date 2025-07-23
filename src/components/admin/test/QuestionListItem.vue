<template>
  <div class="p-4 mb-3 border rounded-lg cursor-pointer relative group" :class="{
    'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30': isSelected,
    'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700': !isSelected
  }" @click="$emit('select')">
    <button v-if="showRemove" @click.stop="$emit('remove')"
      class="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Remove question">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Question {{ questionNumber }}
          </h4>
          <span
            class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {{ formatQuestionType(question.type) }}
          </span>
        </div>
        <div 
          class="text-sm text-gray-600 dark:text-gray-300 mt-1 prose dark:prose-invert prose-sm max-w-none"
          v-html="question.question || question.content || question.prompt || 'Click to edit question'"
        ></div>

        <!-- Show options for multiple choice questions -->
        <div v-if="shouldShowOptions" class="mt-2 space-y-1">
          <template v-if="hasOptions">
            <div v-for="(option, index) in question.options" :key="index"
              class="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span class="font-medium w-4 mr-1">{{ String.fromCharCode(65 + index) }}.</span>
              <div class="prose dark:prose-invert prose-sm max-w-none flex items-center">
                <span v-html="option.text || `Option ${index + 1}`"></span>
                <span v-if="option.correct" 
                  class="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 whitespace-nowrap">
                  Correct
                </span>
              </div>
            </div>
          </template>
          <div v-else class="text-xs text-gray-500 dark:text-gray-400 italic">
            No options available
          </div>
        </div>

        <!-- Show answer for non-multiple choice questions -->
        <div v-else-if="shouldShowAnswer" class="mt-1">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium">Answer:</span>
            <span class="ml-1" :class="{ 'italic text-gray-400': !hasAnswer }">
              {{ formatAnswer(question) }}
            </span>
          </p>
        </div>
        <div v-else class="mt-1">
          <p class="text-xs text-gray-400 dark:text-gray-500 italic">
            No answer provided
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showRemove: {
    type: Boolean,
    default: true
  }
});

const formatQuestionType = (type) => {
  if (!type) return 'Question';

  // Normalize the type for comparison
  const normalizedType = type.toLowerCase().replace(/[ -]/g, '_');

  const types = {
    'multiple_choice': 'Multiple Choice',
    'true_false': 'True/False',
    'short_answer': 'Short Answer',
    'essay': 'Essay',
    'matching': 'Matching',
    'fill_blank': 'Fill in the Blank'
  };

  return types[normalizedType] || type || 'Question';
};

const hasOptions = computed(() => {
  return Array.isArray(props.question?.options) &&
    props.question.options.length > 0 &&
    props.question.options.some(opt => opt.text);
});

const hasAnswer = computed(() => {
  return props.question?.answer ||
    props.question?.correctAnswer !== undefined ||
    props.question?.questionAnswers?.length > 0;
});

const shouldShowOptions = computed(() => {
  const type = props.question?.type?.toLowerCase().replace(/[ -]/g, '_');
  return ['multiple_choice', 'true_false', 'matching'].includes(type);
});

const shouldShowAnswer = computed(() => {
  // Show answer for non-multiple choice questions that have an answer
  return !shouldShowOptions.value &&
    (props.question.answer ||
      props.question.correctAnswer !== undefined ||
      props.question.questionAnswers?.length > 0);
});

const formatAnswer = (question) => {
  console.log('Question data:', JSON.stringify(question, null, 2)); // Debug log

  // Handle questionAnswers array
  if (question.questionAnswers?.length) {
    return question.questionAnswers.join(', ');
  }

  // Handle single answer
  if (question.answer) {
    return question.answer;
  }

  // Handle correctAnswer index (for multiple choice)
  if (question.correctAnswer !== undefined) {
    if (Array.isArray(question.options) && question.options[question.correctAnswer]) {
      return `${String.fromCharCode(65 + question.correctAnswer)}. ${question.options[question.correctAnswer]?.text || 'No text'}`;
    }
    return `Option ${question.correctAnswer + 1}`;
  }

  return 'No answer provided';
};

defineEmits(['select', 'remove']);
</script>
