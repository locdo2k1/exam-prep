<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Test</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Set up your test by adding parts and questions</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Panel - Question Bank & Test Parts -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Question Bank Section - Only show when there are parts -->
          <div v-if="!test.listPart || test.listPart.length === 0" class="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Question Bank</h2>
            <TestQuestionList 
              :list-question="test.listQuestion"
              :list-question-set="test.listQuestionSet"
              @select-question="handleSelectQuestionFromBank"
              @select-question-set="handleSelectQuestionSet"
              @remove-question="handleRemoveQuestion"
            />
          </div>
          
          <!-- Test Parts Section -->
          <div v-if="test.listPart && test.listPart.length > 0" class="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Test Parts</h2>
            <TestPartList 
              v-model="test.listPart"
              @select-question="handleSelectQuestion"
              @active-part-change="handleActivePartChange"
            />
          </div>
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
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { Question, QuestionSet, TestPart, TestInfo, TestVM } from '@/types';

// Component imports
import TestQuestionList from '@/components/admin/test/TestQuestionList.vue';
import TestPartList from '@/components/admin/test/TestPartList.vue';
import TestInfoForm from '@/components/admin/test/TestInfoForm.vue';
import QuestionBankModal from '@/components/admin/test/QuestionBankModal.vue';

// Router and toast setup
const router = useRouter();
const toast = useToast();

// Track selected questions for the question bank
const selectedQuestionsForBank = ref<Question[]>([]);

// Handle questions selected from the question bank
const handleQuestionsSelected = (questions: Question[]) => {
  // If there are no parts, add questions directly to test.listQuestion
  if (!test.value.listPart || test.value.listPart.length === 0) {
    questions.forEach(question => {
      const newQuestion: Question = {
        id: question.id || Date.now().toString(),
        type: question.type || 'multiple_choice',
        content: question.content || 'New Question',
        prompt: question.prompt || 'New Question',
        points: question.points || 1,
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        category: question.category || 'General',
        difficulty: question.difficulty || 'medium',
        duration: question.duration || 60,
        explanation: question.explanation || '',
        tags: question.tags || []
      };
      
      test.value.listQuestion.push(newQuestion);
    });
  } else {
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
      const newQuestion: Question = {
        id: question.id || Date.now().toString(),
        type: question.type || 'multiple_choice',
        content: question.content || 'New Question',
        prompt: question.prompt || 'New Question',
        points: question.points || 1,
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        category: question.category || 'General',
        difficulty: question.difficulty || 'medium',
        duration: question.duration || 60,
        explanation: question.explanation || '',
        tags: question.tags || []
      };
      
      test.value.listPart[partIndex].questions.push(newQuestion);
    });
  }
  
  // Close the question bank modal
  showQuestionBank.value = false;
};

// Get dark mode state from ThemeProvider
const { isDarkMode } = inject('theme', { 
  isDarkMode: ref(false) 
});

// Test data structure
const showQuestionBank = ref(false);

const test = ref<TestVM>({
  info: {
    id: '',
    name: 'New Test',
    description: '',
    duration: 60, // Default duration in minutes
    passingScore: 0,
    maxAttempts: 1,
    isPublished: false,
    startTime: undefined,
    endTime: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    testCategoryId: '',
    skillIds: []
  },
  listPart: [],
  listQuestion: [],
  listQuestionSet: [],
  files: []
});

// Computed properties for template
const title = computed(() => test.value.info.name);
const testCategoryId = computed(() => test.value.info.testCategoryId || '');
const skillIds = computed(() => test.value.info.skillIds || []);

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
const handleAddPart = (partData?: TestPart) => {
  if (partData) {
    test.value.listPart.push(partData);
  } else {
    const newPart: TestPart = {
      id: `part-${Date.now()}`,
      name: `Part ${test.value.listPart.length + 1}`,
      title: `Part ${test.value.listPart.length + 1}`,
      description: '',
      order: test.value.listPart.length + 1,
      duration: 0,
      questions: [],
      questionSets: []
    };
    test.value.listPart.push(newPart);
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
  showQuestionBank.value = true;
};

const handleSelectQuestionFromBank = (question: Question) => {
  if (!test.value.listPart[activePartIndex.value]) {
    toast.error('Please select a part to add the question to');
    return;
  }
  
  const currentPart = test.value.listPart[activePartIndex.value];
  
  // Ensure the part has a questions array
  if (!currentPart.questions) {
    currentPart.questions = [];
  }
  
  // Create a new question with all required fields and proper defaults
  const newQuestion: Question = {
    id: Date.now().toString(),
    type: question.type || 'multiple_choice',
    content: question.content || 'New Question',
    prompt: question.prompt || 'New Question',
    points: question.points || 1,
    options: question.options || [],
    correctAnswer: question.correctAnswer || '',
    category: question.category || 'General',
    difficulty: question.difficulty || 'medium',
    duration: question.duration || 60, // Default duration in seconds
    explanation: question.explanation || '',
    tags: question.tags || []
  };
  
  currentPart.questions.push(newQuestion);
  toast.success('Question added to the test');
};

const handleSelectQuestionSet = (questionSet: QuestionSet) => {
  if (!test.value.listPart[activePartIndex.value]) {
    toast.error('Please select a part to add the questions to');
    return;
  }
  
  const currentPart = test.value.listPart[activePartIndex.value];
  
  // Ensure the part has a questions array
  if (!currentPart.questions) {
    currentPart.questions = [];
  }
  
  // Add all questions from the set to the current part
  const questionsToAdd = questionSet.questions?.map((q: Question) => ({
    ...q,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    points: q.points || 1
  })) || [];
  
  currentPart.questions.push(...questionsToAdd);
  toast.success(`Added ${questionsToAdd.length} questions from "${questionSet.name}"`);
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

const handleRemoveQuestion = (questionId: string | number) => {
  // Check if we're in a part or in the main question bank
  if (test.value.listPart && test.value.listPart.length > 0) {
    // Find which part contains the question
    const partIndex = test.value.listPart.findIndex(part => {
      if (!part.questions) return false;
      return part.questions.some((q, idx) => {
        // Check both by ID and by index
        return (q.id && q.id === questionId) || idx === questionId;
      });
    });
    
    if (partIndex !== -1 && test.value.listPart[partIndex].questions) {
      // Remove from the part's questions
      test.value.listPart[partIndex].questions = test.value.listPart[partIndex].questions!.filter(
        (q, idx) => {
          // Keep if ID doesn't match AND index doesn't match (if questionId is a number)
          return (q.id ? q.id !== questionId : true) && 
                 (typeof questionId === 'number' ? idx !== questionId : true);
        }
      );
    }
  } else {
    // Remove from the main question list
    if (typeof questionId === 'number') {
      test.value.listQuestion.splice(questionId, 1);
    } else {
      test.value.listQuestion = test.value.listQuestion.filter(
        q => q.id ? q.id !== questionId : false
      );
    }
  }
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