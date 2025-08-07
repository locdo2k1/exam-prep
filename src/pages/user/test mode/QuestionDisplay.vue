<template>
  <div class="question border-b border-gray-200 dark:border-gray-700" :data-question-order="question.order">
    <h5 class="font-medium text-gray-800 mb-2">Question {{ question.order }}</h5>
    <div class="question-content text-gray-700 font-medium mb-4">
      {{ question.text || question.prompt }}
    </div>

    <!-- Question Options -->
    <QuestionOptions 
      v-if="question.options?.length"
      :options="question.options"
      :question-type="question.questionType"
      v-model:selected-option-ids="selectedOptions"
    />

    <!-- Fill in the Blank -->
    <div v-else-if="question.questionType === QUESTION_TYPES.FILL_IN_THE_BLANK" class="mt-2">
      <input
        type="text"
        v-model="answerText"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        :placeholder="'Type your answer here...'"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { PracticeQuestionVM } from '@/api/practiceTestApi';
import { QUESTION_TYPES } from '@/constants/question.constants';
import QuestionOptions from './QuestionOptions.vue';

export default defineComponent({
  name: 'QuestionDisplay',
  
  components: {
    QuestionOptions
  },
  
  props: {
    question: {
      type: Object as PropType<PracticeQuestionVM>,
      required: true
    }
  },
  
  setup(props) {
    const selectedOptions = ref<string[]>([]);
    const answerText = ref('');

    return {
      QUESTION_TYPES,
      selectedOptions,
      answerText
    };
  }
});
</script>
