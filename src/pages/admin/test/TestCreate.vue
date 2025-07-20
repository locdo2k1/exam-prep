<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Test</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Set up your test by adding parts and questions</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Panel - Test Parts & Questions -->
        <div class="lg:col-span-2">
          <TestPartList 
            v-model="test.listPart"
            @select-question="handleSelectQuestion"
            @active-part-change="handleActivePartChange"
          />
        </div>
        
        <!-- Right Panel - Test Information -->
        <div class="lg:col-span-1">
          <TestInfoForm 
            :test-title="test.title"
            :test-category-id="test.testCategoryId"
            :skill-ids="test.skillIds"
            @update:test-title="test.title = $event"
            @update:test-category-id="test.testCategoryId = $event"
            @update:skill-ids="test.skillIds = $event"
            @add-part="handleAddPart"
            @add-question="handleAddQuestion"
            @add-question-set="handleAddQuestionSet"
            @save="handleSave"
          />
        </div>
      </div>
      
      <!-- Question Bank Modal -->
      <div class="question-bank-modal">
        <QuestionBankModal 
          :isOpen="showQuestionBank"
          :selected-questions="selectedQuestionsForBank"
          @close="showQuestionBank = false"
          @select="handleQuestionsSelected"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, Ref, watch } from 'vue';

interface Question {
  id: string;
  type: string;
  question: string;
  category: string;
  content: string;
  prompt: string;
  points: number;
  duration?: number;
  options?: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
  correctAnswer?: number;
  questionAnswers?: string[];
  questionAudios?: any[];
  [key: string]: any; // For any additional properties
}

interface TestPartVM {
  id?: string;
  title: string;
  description: string;
  instruction?: string;
  order: number;
  duration: number;
  questionSets: any[]; // Replace with proper type when available
  questions: Question[];
}

import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import TestPartList from '@/components/admin/test/TestPartList.vue';
import TestInfoForm from '@/components/admin/test/TestInfoForm.vue';
import QuestionBankModal from '@/components/admin/test/QuestionBankModal.vue';

const router = useRouter();
const toast = useToast();

// Track selected questions for the question bank
const selectedQuestionsForBank = ref<Question[]>([]);

// Handle questions selected from the question bank
const handleQuestionsSelected = (questions: any[]) => {
  const partIndex = activePartIndex.value;
  
  // Ensure the part exists
  if (!test.value.listPart[partIndex]) {
    console.error('Invalid part index:', partIndex);
    showQuestionBank.value = false;
    return;
  }
  
  // Ensure the part has a questions array
  if (!test.value.listPart[partIndex].questions) {
    test.value.listPart[partIndex].questions = [];
  }
  
  // Add the selected questions to the current part with proper defaults
  questions.forEach(question => {
    test.value.listPart[partIndex].questions.push({
      ...question,
      // Ensure required fields have default values if not provided
      type: question.type || 'multiple_choice',
      category: question.category || '',
      content: question.content || '',
      prompt: question.prompt || '',
      points: question.points ?? 1,
      options: question.options || [],
      correctAnswer: question.correctAnswer ?? []
    });
  });
  
  // Close the question bank modal
  showQuestionBank.value = false;
};

// Get dark mode state from ThemeProvider
const { isDarkMode } = inject('theme', { 
  isDarkMode: ref(false) 
});

// Test data structure
const showQuestionBank = ref(false);

const test = ref<{
  title: string;
  listPart: TestPartVM[];
  listQuestionSet: any[]; // Replace any with proper type when available
  listQuestion: any[];    // Replace any with proper type when available
  skillIds: string[];
  testCategoryId: string | null;
  files: File[];
}>({
  title: '',
  listPart: [],
  listQuestionSet: [],
  listQuestion: [],
  skillIds: [],
  testCategoryId: null,
  files: []
});

// Watch for changes to the test object
watch(
  () => test.value,
  (newValue) => {
    console.log('Test data:', newValue);
  },
  { deep: true, immediate: true }
);

// Question editor state
const showQuestionEditor = ref(false);
const currentQuestionIndex = ref<{ partIndex: number; questionIndex: number | null } | null>(null);
const activePartIndex = ref<number>(0); // Track the currently active part index

// Handlers
const handleAddPart = (partData?: TestPartVM) => {
  if (partData) {
    test.value.listPart.push(partData);
  } else {
    test.value.listPart.push({
      title: `Part ${test.value.listPart.length + 1}`,
      description: '',
      order: test.value.listPart.length + 1,
      duration: 0,
      questionSets: [],
      questions: []
    });
  }
  // Update current question index to the new part
  currentQuestionIndex.value = {
    partIndex: test.value.listPart.length - 1,
    questionIndex: null
  };
};

const handleAddQuestion = (partIndex: number | null = null) => {
  // If no part index is provided, add to the first part or create a new part
  let targetPartIndex = partIndex;
  
  if (targetPartIndex === null) {
    if (test.value.listPart.length === 0) {
      // If no parts exist, create one first
      handleAddPart();
      targetPartIndex = 0;
    } else {
      // Default to the first part
      targetPartIndex = 0;
    }
  }
  
  // Set the current part index for question selection
  currentQuestionIndex.value = {
    partIndex: targetPartIndex,
    questionIndex: null
  };
  
  // Show the question bank modal
  showQuestionBank.value = true;
};

const handleAddQuestionSet = () => {
  // Implementation for adding a set of questions
  toast.info('Adding question set functionality will be implemented here');
};

// Handle when the active part changes in the TestPartList
const handleActivePartChange = (partIndex: number) => {
  console.log('Active part changed to index:', partIndex);
  activePartIndex.value = partIndex;
  // You can add any additional logic here when the active part changes
};

const handleSelectQuestion = ({ partIndex, questionIndex }: { partIndex: number; questionIndex: number }) => {
  // Ensure the part and question exist before setting the current question index
  if (test.value.listPart[partIndex]?.questions?.[questionIndex] !== undefined) {
    currentQuestionIndex.value = { 
      partIndex, 
      questionIndex 
    };
    showQuestionEditor.value = true;
  } else {
    console.error('Invalid part or question index selected');
  }
};

const handleSaveQuestion = (updatedQuestion: Question) => {
  if (!currentQuestionIndex.value || 
      currentQuestionIndex.value.partIndex === null || 
      currentQuestionIndex.value.questionIndex === null) {
    showQuestionEditor.value = false;
    return;
  }
  
  const { partIndex, questionIndex } = currentQuestionIndex.value;
  
  // Ensure the part and question exist
  if (!test.value.listPart[partIndex] || !test.value.listPart[partIndex].questions) {
    showQuestionEditor.value = false;
    return;
  }
  
  // Update the question
  test.value.listPart[partIndex].questions[questionIndex] = {
    ...test.value.listPart[partIndex].questions[questionIndex],
    ...updatedQuestion
  };
  
  showQuestionEditor.value = false;
};

const handleSave = async () => {
  try {
    // Validate required fields
    if (!test.value.title) {
      toast.error('Test title is required');
      return;
    }
    
    if (!test.value.testCategoryId) {
      toast.error('Please select a test category');
      return;
    }
    
    if (test.value.listPart.length === 0) {
      toast.error('Please add at least one part to the test');
      return;
    }
    
    // Prepare the payload
    const payload = {
      title: test.value.title,
      testCategoryId: test.value.testCategoryId,
      skillIds: test.value.skillIds,
      listPart: test.value.listPart.map(part => ({
        ...part,
        // Ensure all required fields are included
        questionSets: part.questionSets || [],
        questions: part.questions || []
      })),
      files: test.value.files || []
    };
    
    // Here you would typically make an API call to save the test
    console.log('Saving test:', payload);
    
    // Show success message
    toast.success('Test saved successfully!');
    
    // Redirect to tests list or edit page
    router.push({ name: 'admin-tests' });
  } catch (error) {
    console.error('Error saving test:', error);
    toast.error('Failed to save test. Please try again.');
  }
};
</script>

<style scoped>
/* Add any custom styles here */
.question-bank-modal {
  z-index: 5000000;
  position: relative;
}
</style>