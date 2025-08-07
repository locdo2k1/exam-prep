<template>
  <div class="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto border border-gray-100">
    <!-- Timer Section -->
    <div class="text-center mb-6">
      <div class="flex items-center justify-center space-x-2 mb-3">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="text-sm font-medium text-gray-600">Thời gian làm bài</div>
      </div>
      
      <div class="text-3xl font-bold text-blue-600 mb-5 bg-blue-50 py-3 px-6 rounded-lg inline-block">
        {{ timeLeft }}
      </div>
      
      <!-- Submit Button -->
      <button 
        @click="handleSubmitTest"
        :class="[
          'w-full py-1.5 rounded-xl font-semibold text-base mb-3 transition-all duration-200 transform hover:scale-[1.02]',
          'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
        ]"
      >
        NỘP BÀI
      </button>
      
      <!-- Restore/Review Text -->
      <div class="flex items-center text-red-500 text-sm mb-3 cursor-pointer hover:underline">
        Khôi phục/lưu bài làm
      </div>
      
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
          <div class="grid grid-cols-5 gap-1.5">
            <div 
              v-for="(question, qIndex) in getQuestionsForPart(part)"
              :key="`${partIndex}-${qIndex}`"
              class="relative"
            >
              <button
                @click="handleQuestionClick(question)"
                :class="[
                  'w-8 h-8 flex items-center justify-center text-[11px] font-bold transition-all duration-150',
                  'rounded border focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-blue-200',
                  'transform hover:scale-105 active:scale-95',
                  isQuestionAnswered(partIndex, qIndex)
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-xs' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                ]"
              >
                {{ question.order }}
              </button>
              <span 
                v-if="isQuestionAnswered(partIndex, qIndex)"
                class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 flex items-center justify-center bg-white text-blue-600 text-[8px] rounded-full shadow"
              >
                ✓
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        No test parts available
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useExamTestStore } from '@/stores/examTestStore';
import { PracticePartVM, PracticeQuestionVM } from '@/api/practiceTestApi';

export default defineComponent({
  name: 'QuestionNavigation',
  
  setup(_, { emit }) {
    const examStore = useExamTestStore();

    // Computed properties
    const testParts = computed(() => examStore.state.testData?.parts || []);
    const timeLeft = computed(() => '01:30:00'); // TODO: Implement actual timer logic

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

    const getQuestionNumber = (partIndex: number, questionIndex: number): number => {
      let count = 0;
      for (let i = 0; i < partIndex; i++) {
        count += testParts.value[i]?.questionsAndQuestionSets?.length || 0;
      }
      return count + questionIndex + 1;
    };

    const isQuestionAnswered = (partIndex: number, questionIndex: number): boolean => {
      // TODO: Implement actual answer checking logic
      return false;
    };

    const handleQuestionClick = (question: PracticeQuestionVM) => {
      emit('question-click', question.order);
    };

    const handleSubmitTest = () => {
      // TODO: Implement test submission logic
      emit('toggle-test');
    };

    return {
      // Computed
      testParts,
      timeLeft,
      
      // Methods
      getQuestionsForPart,
      getQuestionNumber,
      isQuestionAnswered,
      handleQuestionClick,
      handleSubmitTest
    };
  },
  
  emits: ['question-click', 'toggle-test']
});
</script>