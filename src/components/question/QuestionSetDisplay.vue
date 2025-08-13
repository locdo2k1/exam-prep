<template>
  <div class="question-set mb-6">
    <div v-if="questionSet.description" class="question-content text-gray-700 mb-4" v-html="questionSet.description">
    </div>
    <div v-if="questionSet.imageUrl" class="mb-4">
      <img :src="questionSet.imageUrl" :alt="questionSet.title" class="max-w-full h-auto rounded-lg border border-gray-200">
    </div>
    <div v-if="questionSet.questions?.length" class="space-y-6">
      <QuestionDisplay 
        v-for="(question, qIndex) in questionSet.questions" 
        :key="qIndex" 
        :question="question"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import QuestionDisplay from '../../pages/user/test mode/QuestionDisplay.vue';
import { PracticeQuestionSetVM } from '@/api/practiceTestApi';

export default defineComponent({
  name: 'QuestionSetDisplay',
  components: {
    QuestionDisplay
  },
  props: {
    questionSet: {
      type: Object as PropType<PracticeQuestionSetVM>,
      required: true
    }
  }
});
</script>
