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
            v-model="test.parts"
            @select-question="handleSelectQuestion"
          />
        </div>
        
        <!-- Right Panel - Test Information -->
        <div class="lg:col-span-1">
          <TestInfoForm 
            v-model="test.info"
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
import { ref, computed, inject, Ref } from 'vue';

interface Question {
  id: number | string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  [key: string]: any; // For any additional properties
}

interface TestPart {
  name: string;
  questions: Question[];
  [key: string]: any; // For any additional properties
}

interface TestInfo {
  title: string;
  description: string;
  duration: number;
  [key: string]: any; // For any additional properties
}
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import TestPartList from '@/components/admin/test/TestPartList.vue';
import TestInfoForm from '@/components/admin/test/TestInfoForm.vue';
import QuestionBankModal from '@/components/admin/test/QuestionBankModal.vue';

const router = useRouter();
const toast = useToast();

// Track selected questions for the question bank
const selectedQuestionsForBank = ref<{id: string | number; [key: string]: any}[]>([]);

// Handle questions selected from the question bank
const handleQuestionsSelected = (questions: any[]) => {
  if (!currentQuestionIndex.value || currentQuestionIndex.value.partIndex === null) {
    showQuestionBank.value = false;
    return;
  }
  
  const partIndex = currentQuestionIndex.value.partIndex;
  
  // Ensure the part exists
  if (!test.value.parts[partIndex]) {
    showQuestionBank.value = false;
    return;
  }
  
  // Ensure the part has a questions array
  if (!test.value.parts[partIndex].questions) {
    test.value.parts[partIndex].questions = [];
  }
  
  // Add the selected questions to the current part with proper defaults
  questions.forEach(question => {
    test.value.parts[partIndex].questions.push({
      ...question,
      // Ensure required fields have default values if not provided
      type: question.type || 'multiple_choice',
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer ?? 0,
      points: question.points ?? 1
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
  info: TestInfo;
  parts: TestPart[];
}>({
  info: {
    title: '',
    description: '',
    duration: 30, // in minutes
  },
  parts: [],
}); // Start with no parts

// Question editor state
const showQuestionEditor = ref(false);
const currentQuestionIndex = ref<{ partIndex: number; questionIndex: number | null } | null>(null);

// Handlers
const handleAddPart = (partData?: TestPart) => {
  if (partData) {
    test.value.parts.push(partData);
  } else {
    // Default new part
    test.value.parts.push({
      name: `Part ${test.value.parts.length + 1}`,
      questions: []
    });
  }
  
  // Auto-expand the new part
  currentQuestionIndex.value = {
    partIndex: test.value.parts.length - 1,
    questionIndex: null
  };
};

const handleAddQuestion = (partIndex: number | null = null) => {
  // If no part exists, create one first
  if (test.value.parts.length === 0) {
    handleAddPart();
    return;
  }
  
  // Determine target part index
  const targetPart = partIndex !== null ? partIndex : test.value.parts.length - 1;
  
  // Ensure the part exists
  if (!test.value.parts[targetPart]) {
    return; // Shouldn't happen due to the check above
  }
  
  // Ensure the part has a questions array
  if (!test.value.parts[targetPart].questions) {
    test.value.parts[targetPart].questions = [];
  }
  
  const newQuestion: Question = {
    id: Date.now(),
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  };
  
  test.value.parts[targetPart].questions.push(newQuestion);
  currentQuestionIndex.value = { 
    partIndex: targetPart, 
    questionIndex: test.value.parts[targetPart].questions.length - 1 
  };
  showQuestionBank.value = true;
};

const handleAddQuestionSet = () => {
  // Implementation for adding a set of questions
  toast.info('Adding question set functionality will be implemented here');
};

const handleSelectQuestion = ({ partIndex, questionIndex }: { partIndex: number; questionIndex: number }) => {
  // Ensure the part and question exist before setting the current question index
  if (test.value.parts[partIndex]?.questions?.[questionIndex] !== undefined) {
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
  if (!test.value.parts[partIndex] || !test.value.parts[partIndex].questions) {
    showQuestionEditor.value = false;
    return;
  }
  
  // Update the question
  test.value.parts[partIndex].questions[questionIndex] = {
    ...test.value.parts[partIndex].questions[questionIndex],
    ...updatedQuestion
  };
  
  showQuestionEditor.value = false;
};

const handleSave = async () => {
  try {
    // Here you would typically make an API call to save the test
    console.log('Saving test:', test.value);
    
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