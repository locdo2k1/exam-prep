<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Test</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Set up your test by adding parts and questions</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1">
        <!-- Left Panel - Question Bank & Test Parts -->
        <div class="lg:col-span-2 space-y-6 mb-6">
          <!-- Question Bank Section - Only show when there are parts -->
          <div v-if="!test.listPart || test.listPart.length === 0"
            class="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Question Bank</h2>
            <TestQuestionList :list-question-and-question-set="test.listQuestionAndQuestionSet"
              @select-question="handleSelectQuestionFromBank" @select-question-set="handleSelectQuestionSet"
              @remove-question="handleRemoveQuestion" @remove-question-set="handleRemoveQuestionSet" />
          </div>

          <!-- Test Parts Section -->
          <div v-if="test.listPart && test.listPart.length > 0" class="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Test Parts</h2>
            <TestPartList v-model="test.listPart" @select-question="handleSelectQuestion"
              @active-part-change="handleActivePartChange" />
          </div>
        </div>

        <!-- Right Panel - Test Information -->
        <div class="lg:col-span-1">
          <TestInfoForm 
            v-model="test"
            @add-part="handleAddPart" 
            @add-question="handleAddQuestion"
            @add-question-set="handleAddQuestionSet"
            @select-question-set="handleSelectQuestionSet"
            @save="handleSave" 
          />
        </div>
      </div>

      <!-- Question Bank Modal -->
      <div class="question-bank-modal">
        <QuestionBankModal :isOpen="showQuestionBank" :selected-questions="selectedQuestionsForBank"
          @close="showQuestionBank = false" @select="handleQuestionsSelected" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, Ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { Question, QuestionSet, TestPart, TestInfo, TestVM } from '@/types';
import testApi from '@/api/admin/test/testApi';

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

// Track question set modal visibility
const showQuestionSetModal = ref(false);

// Handle questions selected from the question bank
const handleQuestionsSelected = (questions: Question[]) => {
  // Get the base order value for this batch of questions
  const baseOrder = getNextOrder();

  // Create new question objects with proper defaults and sequential order
  const newQuestions = questions.map((question, index) => {
    const newQuestion: Question = {
      id: question.id || `temp-${Date.now()}-${index}`,
      type: question.type || 'multiple_choice',
      content: question.content || 'New Question',
      prompt: question.prompt || 'New Question',
      questionText: question.questionText || question.content || question.prompt || 'New Question',
      points: question.points || 1,
      options: question.options || [],
      correctAnswer: question.questionAnswers || '',
      category: question.category || 'General',
      difficulty: question.difficulty || 'medium',
      duration: question.duration || 60,
      explanation: question.explanation || '',
      tags: question.tags || [],
      // Assign sequential order values starting from the base order
      order: baseOrder + index
    };
    return newQuestion;
  });

  // If there are no parts, add questions directly to test.listQuestionAndQuestionSet
  if (!test.value.listPart || test.value.listPart.length === 0) {
    // Initialize listQuestionAndQuestionSet if it doesn't exist
    if (!test.value.listQuestionAndQuestionSet) {
      test.value.listQuestionAndQuestionSet = [];
    }
    test.value.listQuestionAndQuestionSet.push(...newQuestions);
  } else {
    // If there are parts, add questions to the currently active part
    const currentPartIndex = activePartIndex.value;

    // Ensure the part exists
    if (!test.value.listPart[currentPartIndex]) {
      showQuestionBank.value = false;
      return;
    }

    // Ensure the part has a questions array
    if (!test.value.listPart[currentPartIndex].questions) {
      test.value.listPart[currentPartIndex].questions = [];
    }
    // Also add to listQuestionAndQuestionSet for the question bank view
    if (!test.value.listQuestionAndQuestionSet) {
      test.value.listQuestionAndQuestionSet = [];
    }
    test.value.listPart[currentPartIndex].listQuestionAndQuestionSet.push(...newQuestions);

    // Sort questions by order to ensure consistent display
    test.value.listPart[currentPartIndex].questions.sort((a, b) => (a.order || 0) - (b.order || 0));
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
  id: '',
  title: '',
  duration: 60, // Default duration in minutes
  testCategoryId: '',
  skillIds: [],
  listPart: [],
  listQuestionAndQuestionSet: [],
  files: []
});

// Computed properties for template
const title = computed(() => test.value.title);
const testCategoryId = computed(() => test.value.testCategoryId || '');

// Get the next available order for questions and question sets
// Uses a unified order for both questions and question sets
const getNextOrder = () => {
  // Get the current part using activePartIndex
  const currentPart = test.value.listPart[activePartIndex.value];

  // Get the relevant list (from current part or test)
  const list = currentPart?.listQuestionAndQuestionSet || test.value.listQuestionAndQuestionSet || [];

  // Extract all items, including questions from within question sets
  const items = [
    ...list,  // Include all items (questions and question sets)
    ...list
      .filter(item => item.questions) // Find question sets
      .flatMap(qs => qs.questions || []) // Extract all questions from sets
  ];

  // Also include all questions and question sets from all parts
  const allItems = [
    ...items,
    ...test.value.listPart.flatMap(p => [
      ...(p.listQuestionAndQuestionSet || []).flatMap(qs => 
        qs.questions ? qs.questions : [qs] // Include questions from question sets or the question set itself
      )
    ])
  ];

  const maxOrder = Math.max(
    ...allItems.map(item => item.order || 0),
    0
  );

  return maxOrder + 1;
};
const skillIds = computed(() => test.value.skillIds || []);


// Question editor state
const showQuestionEditor = ref(false);
const currentQuestionIndex = ref<{ partIndex: number; questionIndex: number | null } | null>(null);
const activePartIndex = ref<number>(0); // Track the currently active part index

// Handlers
const handleAddPart = (partData?: TestPart) => {
  const newOrder = test.value.listPart.length > 0 
    ? Math.max(...test.value.listPart.map(p => p.order || 0)) + 1 
    : 1;
    
  if (partData) {
    // Ensure the part has a proper order when added
    const partToAdd = {
      ...partData,
      order: partData.order !== undefined ? partData.order : newOrder
    };
    test.value.listPart.push(partToAdd);
  } else {
    const newPart: TestPart = {
      id: `part-${Date.now()}`,
      name: `Part ${newOrder}`,
      title: `Part ${newOrder}`,
      description: '',
      order: newOrder,
      duration: 0,
      questions: [],
      listQuestionAndQuestionSet: []
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
  // If partIndex is null or there are no parts, add directly to listQuestionAndQuestionSet
  if (partIndex === null || test.value.listPart.length === 0) {
    // Set current part index to -1 to indicate we're not in a specific part
    currentQuestionIndex.value = {
      partIndex: -1,
      questionIndex: null
    };
  } else {
    // If part index is provided and parts exist, use the specified part
    currentQuestionIndex.value = {
      partIndex: partIndex,
      questionIndex: null
    };
  }

  // Show the question bank modal
  showQuestionBank.value = true;
};

const handleAddQuestionSet = (partIndex: number | null = null) => {
  // If partIndex is null or there are no parts, add directly to listQuestionAndQuestionSet
  if (partIndex === null || test.value.listPart.length === 0) {
    // Set current part index to -1 to indicate we're not in a specific part
    currentQuestionIndex.value = {
      partIndex: -1,
      questionIndex: null
    };
  } else {
    // If part index is provided and parts exist, use the specified part
    currentQuestionIndex.value = {
      partIndex: partIndex,
      questionIndex: null
    };
  }

  // Show the question set modal
  showQuestionSetModal.value = true;
};

const handleSelectQuestionFromBank = (question: Question) => {
  // If there are no parts, add directly to listQuestionAndQuestionSet
  if (!test.value.listPart || test.value.listPart.length === 0) {
    // Check if question already exists to avoid duplicates
    const isDuplicate = test.value.listQuestionAndQuestionSet.some(
      (item: Question | QuestionSet) => 'questionText' in item && item.id === question.id
    );

    if (isDuplicate) {
      toast.info('This question is already added');
      return;
    }

    // Add the question to listQuestionAndQuestionSet with proper order
    const newQuestion = {
      ...question,
      id: `temp-${Date.now()}`,
      order: question.order !== undefined ? question.order : getNextOrder()
    };

    test.value.listQuestionAndQuestionSet.push(newQuestion);
    toast.success('Question added to the test');
    return;
  }

  // If there are parts, add to the current part
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
    ...question,
    id: `temp-${Date.now()}`,
    type: question.type || 'multiple_choice',
    content: question.content || 'New Question',
    prompt: question.prompt || 'New Question',
    points: question.points || 1,
    options: [...(question.options || [])],
    correctAnswer: question.questionAnswers || '',
    category: question.category || 'General',
    difficulty: question.difficulty || 'medium',
    duration: question.duration || 60, // Default duration in seconds
    explanation: question.explanation || '',
    tags: [...(question.tags || [])],
    // Preserve the original order or set to the next available position
    order: question.order !== undefined ? question.order : getNextOrder()
  };

  // Add the new question while maintaining order
  currentPart.listQuestionAndQuestionSet.push(newQuestion);

  // Sort questions by order to ensure consistent display
  currentPart.questions.sort((a, b) => (a.order || 0) - (b.order || 0));
  toast.success('Question added to the test');
};

const handleQuestionSetsSelected = async (questionSets: any) => {
  if (!questionSets || questionSets.length === 0) {
    toast.info('No question sets selected');
    return;
  }

  try {
    // If there are no parts, add directly to listQuestionAndQuestionSet
    if (test.value.listPart.length === 0) {
      // Filter out any duplicate question sets
      const newQuestionSets = questionSets.filter(qs => {
        // Check if a question set with this ID already exists in listQuestionAndQuestionSet
        const exists = test.value.listQuestionAndQuestionSet.some(
          (item: Question | QuestionSet) => 'questions' in item && item.id === qs.id
        );
        return !exists;
      });

      if (newQuestionSets.length === 0) {
        toast.info('All selected question sets are already added');
        return;
      }

      // Process each question set
      for (const questionSet of newQuestionSets) {
        try {
          const questionSetOrder = getNextOrder();
          const timestamp = Date.now();

          // Create a new question set with properly mapped questions
          const newQuestionSet: QuestionSet = {
            id: questionSet.id,
            name: questionSet.name || `Question Set ${questionSet.id.substring(0, 8)}`,
            description: questionSet.description || '',
            order: questionSetOrder,
            questionCount: questionSet.questions?.length || 0,
            questions: questionSet.questions?.map((q, index) => ({
              ...q,
              id: `temp-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
              points: q.points || 1,
              order: index + questionSetOrder,
              questionSetId: questionSet.id,
              type: q.type,
              // Set default values for required fields
              category: q.category || 'general',
              difficulty: q.difficulty || 'medium',
              duration: q.duration || 60,
              explanation: q.explanation || '',
              tags: q.tags || [],
              // Map options to the correct format
              options: q.options?.map(opt => ({
                id: opt.id || `opt-${Math.random().toString(36).substr(2, 9)}`,
                text: opt.text || '',
                correct: opt.correct || false
              })) || [],
              correctAnswer: q.questionAnswers || '',
            })) || [],
            tags: questionSet.tags || []
          };

          // Add to the main list
          test.value.listQuestionAndQuestionSet.push(newQuestionSet);

          // Sort to maintain order
          test.value.listQuestionAndQuestionSet.sort((a, b) => (a.order || 0) - (b.order || 0));

        } catch (error) {
          toast.error(`Failed to add question set: ${questionSet.name || questionSet.id}`);
        }
      }

      const totalQuestions = newQuestionSets.reduce((total, qs) => total + (qs.questions?.length || 0), 0);
      toast.success(`Added ${newQuestionSets.length} question set(s) with ${totalQuestions} total questions`);
      return;
    }

    // If there are parts, add to the current part
    const currentPart = test.value.listPart[activePartIndex.value];
    if (!currentPart) {
      toast.error('Please select a part to add the questions to');
      return;
    }

    // Initialize arrays if they don't exist
    if (!currentPart.questions) {
      currentPart.questions = [];
    }

    if (!currentPart.questionSets) {
      currentPart.questionSets = [];
    }

    // Filter out any duplicate question sets
    const newQuestionSets = questionSets.filter(qs =>
      !currentPart.questionSets?.some(existingQs => existingQs.id === qs.id)
    );

    if (newQuestionSets.length === 0) {
      toast.info('All selected question sets are already added to this part');
      return;
    }

    // Process each new question set
    let totalQuestionsAdded = 0;
    for (const questionSet of newQuestionSets) {
      try {
        // Add the question set reference with shared order
        const questionSetOrder = getNextOrder();
        const newQuestionSet: QuestionSet = {
          id: questionSet.id,
          name: questionSet.name,
          description: questionSet.description,
          questions: questionSet.questions?.map((q, index) => ({
            ...q,
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            points: q.points || 1,
            order: questionSetOrder + index,
            questionSetId: questionSet.id,
            // Ensure all required Question fields have defaults
            category: q.category || 'general',
            difficulty: q.difficulty || 'medium',
            duration: q.duration || 60,
            explanation: q.explanation || '',
            tags: q.tags || []
          })) || [],
          order: questionSetOrder,
          questionCount: questionSet.questions?.length || 0,
          tags: questionSet.tags
        };
        currentPart.listQuestionAndQuestionSet?.push(newQuestionSet);

      } catch (error) {
        toast.error(`Failed to add question set: ${questionSet.name}`);
      }
    }

    // Sort questions by order to ensure consistent display
    currentPart.questions.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (totalQuestionsAdded > 0) {
      toast.success(`Added ${newQuestionSets.length} question set(s) with ${totalQuestionsAdded} total questions to "${currentPart.name || 'the part'}"`);
    }
  } catch (error) {
    toast.error('Failed to add question sets. Please try again.');
  } finally {
    showQuestionSetModal.value = false;
  }
};

// For backward compatibility
const handleSelectQuestionSet = (questionSet: QuestionSet) => {
  handleQuestionSetsSelected(questionSet);
};

// Handle when the active part changes in the TestPartList
const handleActivePartChange = (partIndex: number) => {
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

const handleRemoveQuestionSet = (questionSetId: string) => {
  // Remove from the main question and question set list
  const initialLength = test.value.listQuestionAndQuestionSet.length;
  test.value.listQuestionAndQuestionSet = test.value.listQuestionAndQuestionSet.filter(
    (item: Question | QuestionSet) => {
      if ('questions' in item) { // This is a question set
        return item.id !== questionSetId;
      }
      return true; // Keep all questions
    }
  );

  // If we removed a question set, show a success message
  if (test.value.listQuestionAndQuestionSet.length < initialLength) {
    toast.success('Question set removed');
  }
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
    // Remove from the main question and question set list
    if (typeof questionId === 'number') {
      test.value.listQuestionAndQuestionSet.splice(questionId, 1);
    } else {
      test.value.listQuestionAndQuestionSet = test.value.listQuestionAndQuestionSet.filter(
        (item: Question | QuestionSet) => {
          if ('id' in item) {
            return item.id !== questionId;
          }
          return false;
        }
      );
    }
  }
};

const handleSave = async () => {
  try {
    // Validate required fields
    if (!test.value.title?.trim()) {
      toast.error('Test title is required');
      return;
    }

    // Prepare the payload according to TestCreateVM interface
    const payload = {
      title: test.value.title || 'Untitled Test',
      durationMinutes: test.value.duration || 40, // Default to 40 minutes if not specified
      testCategoryId: test.value.testCategoryId,
      skillIds: test.value.skillIds || [],
      listPart: test.value.listPart.map(part => ({
        id: part.id || `part-${Date.now()}`,
        title: part.title || `Part ${part.order}`,
        description: part.description || '',
        order: part.order,
        questions: part.listQuestionAndQuestionSet
          ?.filter(item => !('questions' in item))
          .map((q, index) => ({
            id: q.id,
            order: q.order
          })) || [],
        questionSets: part.listQuestionAndQuestionSet
          ?.filter(item => 'questions' in item)
          .map((qs, index) => ({
            id: qs.id,
            order: qs.order
          })) || [],
      })),
      listQuestion: test.value.listQuestionAndQuestionSet
        ?.filter(item => !('questions' in item))
        .map((q, index) => ({
          questionId: q.id,
          order: q.order
        })) || [],
      listQuestionSet: test.value.listQuestionAndQuestionSet
        ?.filter(item => 'questions' in item)
        .map((qs, index) => ({
          questionSetId: qs.id,
          order: qs.order
        })) || [],
      files: test.value.files || []
    };

    // Call the API to create the test
    const response = await testApi.createTest(payload);
    
    if (response.success && response.data) {
      toast.success('Test created successfully!');
      // Redirect to edit page with the new test ID
      router.push({ 
        name: 'admin-test-edit',
        params: { id: response.data.id }
      });
    } else {
      throw new Error(response.message || 'Failed to save test');
    }
  } catch (error: any) {
    console.error('Error saving test:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save test. Please try again.';
    toast.error(errorMessage);
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