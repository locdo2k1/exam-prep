<template>
  <div class="practice-question-list">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-4 flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded">
      <p class="font-medium">Error loading questions</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasQuestions" class="p-4 text-center text-gray-500">
      No questions available
    </div>

    <!-- Questions and Question Sets -->
    <div v-else class="space-y-6 p-4">
      <div v-for="(item, index) in questionsAndQuestionSets" :key="item.id">
        <!-- Question Set (if exists) -->
        <QuestionSetDisplay 
          v-if="item.questionSet" 
          :question-set="item.questionSet" 
        />

        <!-- Individual Question -->
        <QuestionDisplay 
          v-else-if="item.question" 
          :question="item.question"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import QuestionSetDisplay from '@/components/question/QuestionSetDisplay.vue';
import { useExamTestStore } from '@/stores/examTestStore';
import QuestionDisplay from './QuestionDisplay.vue';

export default defineComponent({
  name: 'PracticeQuestionList',
  
  components: {
    QuestionDisplay,
    QuestionSetDisplay
  },

  setup() {
    const examStore = useExamTestStore();
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    // Computed properties
    const testData = computed(() => examStore.state.testData);
    const questionsAndQuestionSets = computed(() => testData.value?.questionAndQuestionSet || []);
    const hasQuestions = computed(() => questionsAndQuestionSets.value.length > 0);

    // Watch for test data changes
    watch(testData, (newValue) => {
      if (newValue) {
        isLoading.value = false;
      }
    }, { immediate: true, deep: true });

    return {
      // State
      isLoading,
      error,
      
      // Computed
      questionsAndQuestionSets,
      hasQuestions
    };
  }
});
</script>

<style scoped>
.practice-question-list {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.question-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.question-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.question-set {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}
</style>
