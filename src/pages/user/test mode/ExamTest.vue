<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-8xl mx-auto p-4 sm:p-6">
      <!-- Header -->
      <TestHeader />

      <!-- Main Content -->
      <div>
        <div class="p-4 md:p-6 flex flex-col lg:flex-row gap-4">
          <!-- Left Column -->
          <div class="flex-1 w-full space-y-8">
            <!-- Audio Player -->
            <!-- <AudioPlayer :recordings="testData.recordings" :current-recording="currentRecording"
              @recording-change="handleRecordingChange" /> -->

            <PracticePartList v-if="testData?.parts?.length > 0" ref="practicePartListRef"
              @part-changed="handlePartChange" />
            <PracticeQuestionList v-else />
          </div>

          <!-- Right Column - Question Navigation -->
          <div class="lg:w-55 flex-shrink-0">
            <QuestionNavigation v-if="isDataLoaded" :total-questions="totalQuestions" :current-answers="allAnswers"
              :time-limit="timeLimit" :is-active="isTestActive" @question-click="scrollToQuestion"
              @toggle-test="toggleTest" />
          </div>
        </div> <!-- Close flex container -->
      </div> <!-- Close main content -->
    </div> <!-- Close max-w-6xl -->
  </div> <!-- Close min-h-screen -->
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, watch, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useExamTestStore } from '@/stores/examTestStore.ts';
import TestHeader from '@/components/user/test/TestHeader.vue';
import AudioPlayer from '@/components/user/test/AudioPlayer.vue';
import QuestionNavigation from '@/components/user/test/QuestionNavigation.vue';
import PracticePartList from './PracticePartList.vue';
import PracticeQuestionList from './PracticeQuestionList.vue';

export default {
  name: 'ExamTest',
  props: {
    isPracticeMode: { type: Boolean, default: false },
    partIds: { type: Array, default: () => [] },
    timeLimit: { type: Number, default: null },
    refId: { type: String, default: null }
  },
  components: {
    TestHeader,
    AudioPlayer,
    QuestionNavigation,
    PracticePartList,
    PracticeQuestionList
  },
  setup(props) {
    const examStore = useExamTestStore();
    const route = useRoute();
    const practicePartListRef = ref(null);
    const isDataLoaded = ref(false);

    // Create a computed property for reactive testData
    const testData = computed(() => examStore.state.testData);

    // Function to load test data
    const loadTestData = async () => {
      try {
        isDataLoaded.value = false;
        const testId = route.params.id;
        if (!testId) {
          throw new Error('Test ID is missing from the route');
        }

        // Set time limit if provided as prop
        if (props.timeLimit) {
          examStore.setTimeLimit(props.timeLimit);
        }

        if (props.isPracticeMode) {
          // Use selected part IDs if provided in practice mode
          const parts = Array.isArray(props.partIds) && props.partIds.length > 0 ? props.partIds : undefined;
          await examStore.fetchPracticeTestByParts(testId, parts, props.refId);
        } else {
          await examStore.fetchPracticeTestByParts(testId, undefined, props.refId);

          // If no time limit prop was provided, try to get it from test data
          if (!props.timeLimit && testData.value?.timeLimit) {
            examStore.setTimeLimit(testData.value.timeLimit);
          }
        }

        // Mark data as loaded after successful fetch
        isDataLoaded.value = true;
      } catch (error) {
        console.error('Failed to load test details:', error);
        isDataLoaded.value = false;
        // You might want to show an error message to the user here
      }
    };

    // Load test data when component mounts
    onMounted(() => {
      // Ensure any previous state is cleared when entering this page
      examStore.resetState();
      loadTestData();
    });

    // Watch for route changes to reload test data
    watch(() => route.params.id, (newId, oldId) => {
      if (newId && newId !== oldId) {
        loadTestData();
      }
    });

    const handleMultipleChoiceAnswer = (questionId, answer) => {
      examStore.updateAnswer(questionId, answer, 'multipleChoice');
    };

    const handleCompletionAnswer = (questionId, answer) => {
      examStore.updateAnswer(questionId, answer, 'completion');
    };

    const handlePartChange = (partIndex) => {
      // This is called when PracticePartList switches to a different part
      console.log('Part changed to index:', partIndex);
    };

    const scrollToQuestion = (question: any) => {
      // If question is an object with part information, find and switch to that part
      if (question && typeof question === 'object' && question.partId) {
        const targetPartIndex = testData.value?.parts?.findIndex((p: any) => p.id === question.partId);
        if (targetPartIndex !== undefined && targetPartIndex >= 0 && practicePartListRef.value) {
          // Switch to the target part
          (practicePartListRef.value as any).setActiveTab(targetPartIndex);

          // Wait a bit longer for part to fully switch and re-render
          setTimeout(() => {
            const questionOrder = question?.order || question;
            const element = document.querySelector(`[data-question-order="${questionOrder}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
          return;
        }
      }

      // Get the question order
      const questionOrder = question?.order || question;

      // Use nextTick to wait for DOM to update
      nextTick(() => {
        // Scroll to the question by its data attribute
        const element = document.querySelector(`[data-question-order="${questionOrder}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    };

    onUnmounted(() => {
      // Cleanup any resources when component is unmounted
      examStore.stopTimer();
      // Also reset store so answers/checkboxes don't persist when navigating back and re-entering
      examStore.resetState();
    });

    return {
      // Reactive data
      testData,
      practicePartListRef,
      isDataLoaded,

      // Store getters/state
      testParts: examStore.testParts,
      currentRecording: examStore.currentRecording,
      timeLeft: examStore.timeLeft,
      formattedTimeLeft: examStore.formattedTimeLeft,
      isTestActive: examStore.isTestActive,
      isTimeUp: examStore.isTimeUp,
      answers: examStore.answers,
      totalQuestions: computed(() => testData.value?.parts?.reduce((total, part) =>
        total + (part.questionsAndQuestionSets?.length || 0), 0) || 0
      ),
      allAnswers: examStore.allAnswers,

      // Methods
      stopTimer: examStore.stopTimer,
      handleRecordingChange: examStore.handleRecordingChange,
      handleMultipleChoiceAnswer,
      handleCompletionAnswer,
      handlePartChange,
      toggleTest: examStore.toggleTest,
      scrollToQuestion
    };
  }
};
</script>

<style scoped>
/* Highlight effect for questions */
.highlight {
  animation: highlight 1s ease;
  background-color: rgba(59, 130, 246, 0.1);
  transition: background-color 0.3s ease;
}

@keyframes highlight {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
  }

  50% {
    background-color: rgba(59, 130, 246, 0.2);
  }

  100% {
    background-color: rgba(59, 130, 246, 0.1);
  }
}
</style>