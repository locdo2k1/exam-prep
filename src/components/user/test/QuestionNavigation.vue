<template>
  <div class="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto border border-gray-100">
    <!-- Timer Section -->
    <div class="text-center mb-6">
      <Timer :time-limit="computedTimeLimit" @time-up="handleTimeUp" @time-update="handleTimeUpdate" />
      <!-- Submit Button -->
      <button @click="handleSubmitTestWithTime" :class="[
        'w-full py-1.5 rounded-xl font-semibold text-base mb-3 transition-all duration-200 transform hover:scale-[1.02]',
        'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
      ]">
        NỘP BÀI
      </button>

      <!-- Note Text -->
      <div class="text-amber-700 text-sm text-left font-bold italic">
        <span>Chú ý: Bạn có thể click vào số thứ tự câu hỏi để đánh dấu review hoặc quay lại làm sau.</span>
      </div>
    </div>
    <!-- Questions Navigation -->
    <div class="space-y-7">
      <!-- Dynamic Parts -->
      <div v-if="testParts.length > 0">
        <div v-for="(part, partIndex) in testParts" :key="partIndex" class="mb-6">
          <h3 class="text-base font-semibold text-gray-800 mb-3.5 flex items-center">
            {{ part.name || `Part ${partIndex + 1}` }}
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <div v-for="(question, qIndex) in getQuestionsForPart(part)" :key="`${partIndex}-${qIndex}`"
              class="relative cursor-pointer">
              <button @click="handleQuestionClick(question)" :class="getQuestionButtonClasses(question)">
                {{ question.order }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="flattenedQuestions.length > 0" class="mb-6">
          <h3 class="text-base font-semibold text-gray-800 mb-3.5 flex items-center">
            All Questions
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <div v-for="(question, index) in flattenedQuestions" :key="`all-${index}`" class="relative cursor-pointer">
              <button @click="handleQuestionClick(question)" :class="getQuestionButtonClasses(question)">
                {{ question.order || index + 1 }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          No questions available
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import { useRouter } from 'vue-router';
import Timer from '@/components/common/Timer.vue';
import { useExamTestStore } from '@/stores/examTestStore';
import {
  PracticePartVM,
  PracticeQuestionVM,
  submitPracticeTestPart
} from '@/api/practiceTestApi';

export default defineComponent({
  name: 'QuestionNavigation',

  components: {
    Timer
  },

  props: {
    // Time limit for the test in seconds
    timeLimit: {
      type: Number,
      default: 0
    }
  },

  setup(props, { emit }) {
    const examStore = useExamTestStore();
    const router = useRouter();
    const timerRef = ref<InstanceType<typeof Timer> | null>(null);
    const elapsedTime = ref(0);

    // Computed properties
    const testParts = computed(() => examStore.state.testData?.parts || []);
    const questionsAndQuestionSets = computed(() => examStore.state.testData?.questionAndQuestionSet || []);
    const computedTimeLimit = computed(() => props.timeLimit || examStore.state.timeLimit || 0);

    // Flatten all questions from questionsAndQuestionSets
    const flattenedQuestions = computed(() => {
      return questionsAndQuestionSets.value.flatMap(item => {
        if (item.question) {
          return [item.question];
        }
        if (item.questionSet?.questions) {
          return item.questionSet.questions;
        }
        return [];
      });
    });

    // Methods
    const getQuestionsForPart = (part: PracticePartVM) => {

      // Get questions from questionsAndQuestionSets
      const questionsFromSets = (part.questionsAndQuestionSets || []).flatMap(item => {
        if (item.question) {
          return [item.question];
        }
        if (item.questionSet?.questions) {
          return item.questionSet.questions;
        }
        return [];
      });

      return questionsFromSets;
    };

    const getPartIdForQuestion = (questionId: string): string | undefined => {
      // Find which part contains this question
      for (const part of testParts.value) {
        const questions = getQuestionsForPart(part);
        if (questions.some(q => q.id === questionId)) {
          return part.id;
        }
      }
      return undefined;
    };

    const getQuestionNumber = (partIndex: number, questionIndex: number): number => {
      let count = 0;
      for (let i = 0; i < partIndex; i++) {
        count += testParts.value[i]?.questionsAndQuestionSets?.length || 0;
      }
      return count + questionIndex + 1;
    };

    const isQuestionInReview = (questionId?: string): boolean => {
      if (!questionId) return false;
      return examStore.isInReview(questionId);
    };

    const isQuestionAnswered = (questionId?: string): boolean => {
      if (!questionId) return false;
      return examStore.isAnswered(questionId);
    };



    const getQuestionButtonClasses = (question: PracticeQuestionVM) => {
      const baseClasses = [
        'w-8 h-8 flex items-center justify-center text-[11px] font-bold transition-all duration-150',
        'rounded border focus:outline-none focus:ring-1 focus:ring-offset-0',
        'transform hover:scale-105 active:scale-95'
      ];

      if (isQuestionAnswered(question.id) && !isQuestionInReview(question.id)) {
        return [
          ...baseClasses,
          'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-xs focus:ring-blue-200'
        ];
      }

      if (isQuestionInReview(question.id)) {
        return [
          ...baseClasses,
          'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-xs focus:ring-yellow-200'
        ];
      }

      // Check correct/incorrect status first
      if (question?.correct === true) {
        return [
          ...baseClasses,
          'bg-green-50 text-green-700 border-green-200 shadow-xs focus:ring-green-100'
        ];
      }

      if (question?.correct === false) {
        return [
          ...baseClasses,
          'bg-red-50 text-red-700 border-red-200 shadow-xs focus:ring-red-100'
        ];
      }


      return [
        ...baseClasses,
        'bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-blue-50 focus:ring-blue-200'
      ];
    };;

    const handleQuestionClick = (question: PracticeQuestionVM) => {
      const partId = getPartIdForQuestion(question.id);
      const enrichedQuestion = { ...question, partId };
      emit('question-click', enrichedQuestion);
    };

    // Handle time update from Timer
    const handleTimeUpdate = (timeInSeconds: number) => {
      // If we have a positive time limit, Timer emits remaining seconds (countdown)
      // If time limit is 0, Timer emits elapsed seconds (count-up)
      if (computedTimeLimit.value > 0) {
        const totalTime = computedTimeLimit.value * 60;
        const timeElapsed = totalTime - timeInSeconds; // timeInSeconds = remaining
        elapsedTime.value = Math.max(0, Math.min(timeElapsed, totalTime));
      } else {
        // Count-up mode
        elapsedTime.value = Math.max(0, timeInSeconds);
      }

      // Debug log (optional)
      const minutes = Math.floor(elapsedTime.value / 60);
      const seconds = elapsedTime.value % 60;
      console.log(`Elapsed: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Handle when time is up
    const handleTimeUp = async () => {
      await handleSubmitTestWithTime();
    };

    const handleSubmitTest = () => {
      if (confirm('Bạn có chắc chắn muốn nộp bài không?')) {
      }
    };

    // Update handleSubmitTest to include elapsed time
    const handleSubmitTestWithTime = async () => {
      try {
        // Get final time from elapsed time
        const timeSpent = elapsedTime.value;

        console.log('Time Spent:', timeSpent);

        // Log all user responses
        const responses = Array.from(examStore.userResponses());
        console.log('All User Responses:', responses);

        // Log questions that haven't been answered
        const allQuestions = flattenedQuestions.value;
        const answeredQuestionIds = new Set(responses.map(r => r.questionId));
        const unansweredQuestions = allQuestions.filter(q => q.id && !answeredQuestionIds.has(q.id));

        console.log('Unanswered Questions:', unansweredQuestions.map(q => ({
          id: q.id,
          order: q.order
        })));

        // Prepare question answers for submission
        const questionAnswers = responses.map(response => ({
          questionId: response.questionId,
          selectedOptionIds: response.selectedOptionIds || [],
          answerText: response.answer || ''  // Changed from response.answerText to response.answer
        }));

        // Get all part IDs from the test
        const partIds = testParts.value.map(part => part.id);

        // Submit the test directly using the API
        if (examStore.state.testData?.testId) {
          const testId = examStore.state.testData.testId;
          const userId = '123e4567-e89b-12d3-a456-426614174001'; // Replace with actual user ID from auth store

          const response = await submitPracticeTestPart(
            testId,
            userId,
            questionAnswers,
            partIds,
            elapsedTime.value
          );

          // Stop the timer
          timerRef.value?.stop();

          // Clear local state
          examStore.clearResponses();
          examStore.clearReviewQuestions();

          // Navigate to results page with the attemptId from the response
          if (response.data?.id) {
            router.push({
              path: `/user/test/attempt/${response.data.id}/result`
            });
          }
        }
      } catch (error) {
        console.error('Error submitting test:', error);
        // Show error message to user (you might want to use a toast or alert)
        const errorMessage = error instanceof Error ? error.message : 'Failed to submit test. Please try again.';
        alert(errorMessage);
      }
    };

    return {
      // Refs
      timerRef,
      elapsedTime,

      // Data
      timeLimit: computedTimeLimit,

      // Computed
      computedTimeLimit,
      testParts,
      questionsAndQuestionSets,
      flattenedQuestions,

      // Methods
      handleTimeUp,
      getQuestionsForPart,
      getQuestionNumber,
      isQuestionAnswered,
      isQuestionInReview,
      getQuestionButtonClasses,
      handleQuestionClick,
      handleSubmitTest,
      handleSubmitTestWithTime,
      handleTimeUpdate
    };
  },

  emits: ['question-click', 'toggle-test'],
});
</script>