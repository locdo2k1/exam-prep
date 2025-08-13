<template>
  <div class="practice-part-list">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-4 flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded">
      <p class="font-medium">Error loading test content</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!testData" class="p-4 text-center text-gray-500">
      No test data available
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <div v-for="(part, index) in testData.parts" :key="part.id" class="tab"
          :class="{ 'active': activeTabIndex === index }" @click="setActiveTab(index)">
          {{ part.name || `Part ${index + 1}` }}
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content p-4">
        <div v-if="activePart">
          <!-- Questions and Question Sets -->
          <div v-if="hasQuestions" class="space-y-6">
            <div v-for="(item, index) in activePart.questionsAndQuestionSets" :key="item.id"
              class="p-4">

              <!-- Question Set (if exists) -->
              <QuestionSetDisplay 
                v-if="item.questionSet" 
                :question-set="item.questionSet" 
              />

              <!-- Individual Question -->
              <QuestionDisplay 
                v-if="item.question" 
                :question="item.question" 
                class="mt-4" 
              />
            </div>
          </div>

          <!-- No Questions State -->
          <div v-else class="text-center py-8 text-gray-500">
            No questions available for this part.
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useExamTestStore } from '@/stores/examTestStore';
import QuestionDisplay from './QuestionDisplay.vue';
import QuestionSetDisplay from '@/components/question/QuestionSetDisplay.vue';

export default defineComponent({
  name: 'PracticePartList',
  
  components: {
    QuestionDisplay,
    QuestionSetDisplay
  },

  setup() {
    const examStore = useExamTestStore();
    const activeTabIndex = ref(0);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    // Computed properties
    const testData = computed(() => examStore.state.testData);

    const activePart = computed(() => {
      return testData.value?.parts?.[activeTabIndex.value] || null;
    });

    const hasQuestions = computed(() => {
      return (activePart.value?.questionsAndQuestionSets?.length || 0) > 0;
    });

    // Debug watcher
    watch(testData, (newValue) => {
      // Reset active tab if needed
      if (newValue?.parts && newValue.parts.length > 0) {
        activeTabIndex.value = 0;
        isLoading.value = false;
        console.log(newValue);
      }
    }, { immediate: true, deep: true });

    // Methods
    const setActiveTab = (index: number) => {
      if (testData.value?.parts && index >= 0 && index < testData.value.parts.length) {
        activeTabIndex.value = index;
      }
    };

    return {
      // State
      testData,
      activeTabIndex,
      activePart,
      isLoading,
      error,

      // Computed
      hasQuestions,

      // Methods
      setActiveTab
    };
  }
});
</script>

<style scoped>
.practice-part-list {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Tabs Container */
.tabs-container {
  display: flex;
  padding: 1.5rem 1rem 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  /* Hide scrollbar for Firefox */
}

.tabs-container::-webkit-scrollbar {
  display: none;
  /* Hide scrollbar for Chrome/Safari */
}

/* Tab Styles */
.tab {
  padding: 0.5rem 1.25rem;
  margin-right: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 25px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;
  bottom: -1px;
}

.tab:hover {
  color: #374151;
  background-color: #e5e7eb;
}

.tab.active {
  background-color: #e8f2ff;
  color: #35509a;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

/* Tab Content */
.tab-content {
  padding: 1.5rem;
  min-height: 200px;
}

/* Question Card */


/* Part Header */
.part-header {
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .tabs-container {
    padding: 0.5rem 0.75rem 0;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .tab-content {
    padding: 1.25rem;
  }
}

.question-container {
  margin-bottom: 20px;
}

.question-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1f2937;
}

.question-item {
  margin-bottom: 12px;
}

.question-text {
  margin: 8px 0;
  color: #374151;
}

.transcript-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1f2937;
}

.transcript-text {
  white-space: pre-line;
  line-height: 1.7;
  color: #4b5563;
}

.no-questions,
.no-transcript {
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>
