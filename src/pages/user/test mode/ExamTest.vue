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

            <PracticePartList v-if="testData?.parts?.length > 0"/>
            <PracticeQuestionList v-else/>
          </div>

          <!-- Right Column - Question Navigation -->
          <div class="lg:w-55 flex-shrink-0">
            <QuestionNavigation 
              :total-questions="totalQuestions" 
              :current-answers="allAnswers"
              :time-left="timeLeft"
              :is-active="isTestActive"
              @question-click="scrollToQuestion" 
              @toggle-test="toggleTest"
            />
          </div>
        </div> <!-- Close flex container -->
      </div> <!-- Close main content -->
    </div> <!-- Close max-w-6xl -->
  </div> <!-- Close min-h-screen -->
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
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
    timeLimit: { type: Number, default: null }
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

    // Create a computed property for reactive testData
    const testData = computed(() => examStore.state.testData);

    // Load test details when component mounts
    onMounted(async () => {
      try {
        const testId = route.params.id;
        if (!testId) {
          throw new Error('Test ID is missing from the route');
        }
        if (props.isPracticeMode) {
          // Use selected part IDs if provided in practice mode
          const parts = Array.isArray(props.partIds) && props.partIds.length > 0 ? props.partIds : undefined;
          await examStore.fetchPracticeTestByParts(testId, parts);
        } else {
          await examStore.fetchPracticeTestByParts(testId);
        }
        
        // Now we can use testData.value to access the reactive data
        console.log('Test data loaded:', testData.value);
        
      } catch (error) {
        console.error('Failed to load test details:', error);
        // You might want to show an error message to the user here
      }
    });

    const handleMultipleChoiceAnswer = (questionId, answer) => {
      examStore.updateAnswer(questionId, answer, 'multipleChoice');
    };

    const handleCompletionAnswer = (questionId, answer) => {
      examStore.updateAnswer(questionId, answer, 'completion');
    };

    const scrollToQuestion = (questionOrder) => {
      try {
        // Find all question elements
        const questionElements = document.querySelectorAll('[data-question-order]');
        
        // Find the target question by order
        const targetQuestion = Array.from(questionElements).find(el => {
          const order = parseInt(el.getAttribute('data-question-order'));
          return order === questionOrder;
        });
        
        if (targetQuestion) {
          // Calculate the offset to account for any fixed headers
          const headerOffset = 80; // Adjust this value based on your header height
          const elementPosition = targetQuestion.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Smooth scroll to the question
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Add a highlight effect
          targetQuestion.classList.add('highlight');
          setTimeout(() => {
            targetQuestion.classList.remove('highlight');
          }, 1000);
        } else {
          console.warn(`Could not find question with order: ${questionOrder}`);
        }
      } catch (error) {
        console.error('Error scrolling to question:', error);
      }
    };

    onUnmounted(() => {
      // Cleanup any resources when component is unmounted
      // examStore.resetTest();
    });

    return {
      // Reactive data
      testData,
      // Props
      isPracticeMode: props.isPracticeMode,
      partIds: props.partIds,
      timeLimit: props.timeLimit,
      
      // Store getters/state
      testParts: examStore.testParts,
      currentRecording: examStore.currentRecording,
      timeLeft: examStore.timeLeft,
      isTestActive: examStore.isTestActive,
      answers: examStore.answers,
      totalQuestions: computed(() => testData.value?.parts?.reduce((total, part) => 
        total + (part.questionsAndQuestionSets?.length || 0), 0) || 0
      ),
      allAnswers: examStore.allAnswers,
      
      // Methods
      handleRecordingChange: examStore.handleRecordingChange,
      handleMultipleChoiceAnswer,
      handleCompletionAnswer,
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
  0% { background-color: rgba(59, 130, 246, 0.1); }
  50% { background-color: rgba(59, 130, 246, 0.2); }
  100% { background-color: rgba(59, 130, 246, 0.1); }
}
</style>