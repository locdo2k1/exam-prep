<template>
  <div class="question border-b border-gray-200 dark:border-gray-700 pb-5" :data-question-order="question.order">
    <h5 class="mb-2 relative">
      <span @click.stop="toggleReview(question.id)"
        class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium cursor-pointer transition-colors"
        :class="isInReview(question.id)
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'">
        {{ question.order }}
      </span>
    </h5>

    <div class="question-content text-gray-700 font-medium mb-4" v-html="question.text || question.prompt">
    </div>
    
    <!-- Audio Players -->
    <div v-if="hasAudio" class="mb-4 space-y-4">
      <div v-for="(audio, index) in question.questionAudios" :key="index" class="audio-player-wrapper">
        <AudioPlayer :audio-url="audio.fileUrl" />
      </div>
    </div>
    <!-- Question Options -->
    <QuestionOptions v-if="question.options?.length || question.questionType === QUESTION_TYPES.FILL_IN_THE_BLANK"
      :options="question.options || []" :question-type="question.questionType" :answer-text="answerText"
      v-model:selected-option-ids="selectedOptions" @answer="handleAnswer" />

  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, onMounted, watch, onUpdated, computed } from 'vue';
import type { PracticeQuestionVM } from '@/api/practiceTestApi';
import { QUESTION_TYPES } from '@/constants/question.constants';
import QuestionOptions from './QuestionOptions.vue';
import AudioPlayer from '@/components/user/test/AudioPlayer.vue';
import { useExamTestStore } from '@/stores/examTestStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'QuestionDisplay',

  components: {
    QuestionOptions,
    AudioPlayer
  },

  props: {
    question: {
      type: Object as PropType<PracticeQuestionVM>,
      required: true
    }
  },

  setup(props) {
    const store = useExamTestStore();
    const { isInReview, addToReview, removeFromReview } = store;
    const selectedOptions = ref<string[]>([]);
    const answerText = ref('');
    
    // Check if question has audio files
    const hasAudio = computed(() => {
      return props.question.questionAudios && props.question.questionAudios.length > 0;
    });
    

    const toggleReview = (questionId: string) => {
      if (isInReview(questionId)) {
        removeFromReview(questionId);
      } else {
        addToReview(questionId);
      }
    };

    // Track renders
    onUpdated(() => {
      console.log('QuestionDisplay updated');
    });

    // Load saved response if exists
    onMounted(() => {
      const savedResponse = store.getResponse(props.question.id);
      
      if (savedResponse) {
        selectedOptions.value = savedResponse.selectedOptionIds || [];
        answerText.value = savedResponse.answer || '';
      }
    });

    // Watch for changes in selected options and save to store
    watch(selectedOptions, (newValue) => {
      if (!props.question?.id) return;

      // For multiple choice questions, use the selected options
      if (props.question.questionType === QUESTION_TYPES.MULTIPLE_CHOICE ||
        props.question.questionType === QUESTION_TYPES.SINGLE_CHOICE) {

        const responseData = {
          selectedOptionIds: [...newValue],
          answer: null
        };

        // Check if response exists before updating
        const responseExists = store.getResponse(props.question.id);
        if (responseExists) {
          store.updateResponse(props.question.id, responseData);
        } else {
          store.addResponse({
            questionId: props.question.id,
            ...responseData
          });
        }
      }
    }, { deep: true });

    // Watch for changes in the question prop to update answerText
    watch(() => props.question, (newQuestion) => {
      if (newQuestion?.id) {
        const savedResponse = store.getResponse(newQuestion.id);
        if (savedResponse) {
          answerText.value = savedResponse.answer || '';
        }
      }
    });

    // Handle answer text changes for fill-in-the-blank questions
    const handleAnswer = (answer: string) => {
      if (!props.question?.id) return;

      // Update the local answerText ref
      answerText.value = answer;

      const responseData = {
        selectedOptionIds: [],
        answer: answer || null
      };

      // Check if response exists before updating
      const responseExists = store.getResponse(props.question.id);
      if (responseExists) {
        store.updateResponse(props.question.id, responseData);
      } else {
        store.addResponse({
          questionId: props.question.id,
          ...responseData
        });
      }
    };

    return {
      isInReview,
      toggleReview,
      QUESTION_TYPES,
      selectedOptions,
      answerText,
      handleAnswer,
      hasAudio
    };
  }
});
</script>
