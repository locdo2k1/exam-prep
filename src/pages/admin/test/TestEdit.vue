<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Test</h1>
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
          <TestInfoForm v-model="test" @add-part="handleAddPart" @add-question="handleAddQuestion"
            @add-question-set="handleAddQuestionSet" @select-question-set="handleSelectQuestionSet"
            @save="handleSave" />
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
import { ref, computed, inject, Ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { Question, QuestionSet, TestPart, TestInfo, TestVM } from '@/types';
import testApi from '@/api/admin/test/testApi';

// Component imports
import TestQuestionList from '@/components/admin/test/TestQuestionList.vue';
import TestPartList from '@/components/admin/test/TestPartList.vue';
import TestInfoForm from '@/components/admin/test/TestInfoForm.vue';
import QuestionBankModal from '@/components/admin/test/QuestionBankModal.vue';

// Router, route, and toast setup
const router = useRouter();
const route = useRoute();
const toast = useToast();

// Track selected questions for the question bank
const selectedQuestionsForBank = ref<Question[]>([]);

// Loading and error state
const isLoading = ref(false);
const loadError = ref<string | null>(null);

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
    // Build a set of existing question IDs (exclude question sets)
    const existingIds = new Set(
      test.value.listQuestionAndQuestionSet
        .filter((item: any) => !('questions' in item))
        .map((q: any) => q.id)
    );
    const deduped = newQuestions.filter(q => !existingIds.has(q.id));
    const skipped = newQuestions.length - deduped.length;
    if (deduped.length === 0) {
      toast.info('All selected questions are already added');
    } else {
      test.value.listQuestionAndQuestionSet.push(...deduped);
      if (skipped > 0) {
        toast.info(`${skipped} duplicate question(s) skipped`);
      }
      toast.success(`Added ${deduped.length} question(s)`);
    }
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
    // Ensure the part has a listQuestionAndQuestionSet array
    if (!test.value.listPart[currentPartIndex].listQuestionAndQuestionSet) {
      test.value.listPart[currentPartIndex].listQuestionAndQuestionSet = [] as any;
    }
    // Also add to listQuestionAndQuestionSet for the question bank view
    if (!test.value.listQuestionAndQuestionSet) {
      test.value.listQuestionAndQuestionSet = [];
    }
    // Build a set of existing question IDs in the target part (exclude question sets)
    const partExistingIds = new Set(
      test.value.listPart[currentPartIndex].listQuestionAndQuestionSet
        .filter((item: any) => !('questions' in item))
        .map((q: any) => q.id)
    );
    const partDeduped = newQuestions.filter(q => !partExistingIds.has(q.id));
    const partSkipped = newQuestions.length - partDeduped.length;
    if (partDeduped.length === 0) {
      toast.info('All selected questions are already in this part');
    } else {
      test.value.listPart[currentPartIndex].listQuestionAndQuestionSet.push(...partDeduped);
      if (partSkipped > 0) {
        toast.info(`${partSkipped} duplicate question(s) skipped`);
      }
      toast.success(`Added ${partDeduped.length} question(s) to the part`);

      // Renumber all parts to maintain continuous global numbering
      renumberAllParts();
    }
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
  title: 'New Test',
  duration: 60, // Default duration in minutes
  testCategoryId: '',
  skillIds: [],
  listPart: [],
  listQuestionAndQuestionSet: [],
  files: [],
  audioFile: null
});

// Watch for changes in the test object
watch(
  test,
  (newVal, oldVal) => {
    // You can replace this with any side-effect needed
    console.log('Test changed:', { newVal, oldVal });
    // e.g., auto-save, validation, analytics, etc.
  },
  { deep: true }
);


// Utility to normalize loaded test data to local TestVM shape (types/index.d.ts)
function normalizeTestVM(apiTest: any): TestVM {
  // Extract duration first since it can come from multiple places
  const duration = apiTest.durationMinutes || apiTest.duration || apiTest.info?.durationMinutes || 0;

  // Normalize parts
  const normalizedParts = (apiTest.listPart || []).map((part: any, idx: number) => {
    const questionItems = Array.isArray(part.questionItems)
      ? part.questionItems.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      : [];

    const questions = questionItems
      .map((item: any) => {
        if (!item.question) return null;
        return {
          ...item.question,
          type: item.question.type || item.question.questionType?.name || item.question.questionType?.code || 'Unknown',
        };
      })
      .filter((q: any) => !!q);

    const questionSets = questionItems
      .map((item: any) => item.questionSet)
      .filter((qs: any) => !!qs);

    const listQuestionAndQuestionSet = questionItems
      .map((item: any) => {
        if (item.question) {
          return {
            ...item.question,
            type: item.question.type || item.question.questionType?.name || item.question.questionType?.code || 'Unknown',
            correctAnswer: item.question.questionAnswers,
          };
        } else if (item.questionSet) {
          return {
            ...item.questionSet,
            name: item.questionSet.name || item.questionSet.title,
            questions: Array.isArray(item.questionSet.questions)
              ? item.questionSet.questions.map((q: any) => ({
                ...q,
                type: q.type || q.questionType?.name || q.questionType?.code || 'Unknown',
                correctAnswer: q.questionAnswers,
              }))
              : [],
          };
        }
        return null;
      })
      .filter(Boolean);

    return {
      id: part.id || `part-${idx}`,
      title: part.title || '',
      testCategoryId: apiTest.testCategory?.Id,
      order: part.order,
      duration: part.duration,
      questions,
      questionSets,
      listQuestionAndQuestionSet,
    };
  });

  // Compose listQuestionAndQuestionSet from listQuestionItem if present
  const listQuestionAndQuestionSet: Array<any> = [];
  if (!apiTest.listPart || apiTest.listPart.length === 0) {
    if (Array.isArray(apiTest.listQuestionItem)) {
      apiTest.listQuestionItem.forEach((item: any) => {
        if (item.question) {
          listQuestionAndQuestionSet.push({
            ...item.question,
            type: item.question.type || item.question.questionType?.name || item.question.questionType?.code || 'Unknown',
            correctAnswer: item.question.questionAnswers,
          });
        } else if (item.questionSet) {
          listQuestionAndQuestionSet.push({
            ...item.questionSet,
            name: item.questionSet.name || item.questionSet.title,
            questions: Array.isArray(item.questionSet.questions)
              ? item.questionSet.questions.map((q: any) => ({
                ...q,
                type: q.type || q.questionType?.name || q.questionType?.code || 'Unknown',
                correctAnswer: q.questionAnswers,
              }))
              : [],
          });
        }
      });
    }
  }

  // Extract audio file from files array if present
  let audioFile = null;
  if (apiTest.files && apiTest.files.length > 0) {
    // Find the first audio file in the files array
    const audioFileInfo = apiTest.files.find((f: any) => f.fileType?.startsWith('audio/'));
    if (audioFileInfo) {
      // Create a pseudo-File object for display purposes
      audioFile = {
        name: audioFileInfo.fileName,
        size: audioFileInfo.fileSize,
        type: audioFileInfo.fileType,
        url: audioFileInfo.url,
        id: audioFileInfo.id,
        isExisting: true // Flag to indicate this is from the server
      };
    }
  }

  // Create the final test object with all normalized data
  return {
    ...(apiTest.info || {}),
    testCategoryId: apiTest.testCategory?.id || apiTest.testCategoryId || '',
    skillIds: Array.isArray(apiTest.listSkill)
      ? apiTest.listSkill.map((s: any) => s.id)
      : apiTest.skillIds || [],
    id: apiTest.id || apiTest.info?.id || '',
    title: apiTest.title || apiTest.info?.title || '',
    duration: duration,
    listPart: normalizedParts,
    listQuestionAndQuestionSet: listQuestionAndQuestionSet,
    files: apiTest.files || [],
    audioFile: audioFile
  };
}

// Load test data by ID
const loadTestData = async (id: string) => {
  isLoading.value = true;
  loadError.value = null;
  try {
    const response = await testApi.getTestById(id);
    if (response.success && response.data) {
      test.value = normalizeTestVM(response.data);
    } else {
      throw new Error(response.message || 'Failed to load test data');
    }
  } catch (error: any) {
    loadError.value = error.response?.data?.message || error.message || 'Failed to load test data.';
    toast.error(loadError.value);
  } finally {
    isLoading.value = false;
  }
};

// On mount, load test if ID is present in route
onMounted(() => {
  const testId = route.params.id as string;
  if (testId) {
    loadTestData(testId);
  }
});

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

// Renumber all questions across all parts with continuous numbering
const renumberAllParts = () => {
  let globalOrder = 1;

  // Iterate through each part and renumber its questions
  test.value.listPart.forEach((part) => {
    if (!part.listQuestionAndQuestionSet) return;

    part.listQuestionAndQuestionSet = part.listQuestionAndQuestionSet.map((item) => {
      if ('questions' in item) {
        // Question set: assign order to the set and its questions
        const questionSetOrder = globalOrder;
        const reorderedQuestions = item.questions?.map((q: any) => {
          const questionOrder = globalOrder;
          globalOrder++;
          return {
            ...q,
            order: questionOrder
          };
        });
        return {
          ...item,
          order: questionSetOrder,
          questions: reorderedQuestions
        };
      }
      // Regular question
      const questionOrder = globalOrder;
      globalOrder++;
      return {
        ...item,
        order: questionOrder
      };
    });

    // Also update the questions array to maintain consistency
    if (part.questions) {
      part.questions = part.listQuestionAndQuestionSet
        .filter(item => !('questions' in item))
        .map(q => ({ ...q })) as Question[];
    }
  });
};

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
    // Prevent duplicates by id or title (case-insensitive)
    const normalizedTitle = partData.title?.trim().toLowerCase();
    const exists = test.value.listPart.some(p =>
      (partData.id && p.id === partData.id) ||
      (normalizedTitle && (p.title?.trim().toLowerCase() === normalizedTitle))
    );
    if (exists) {
      toast.info('This part already exists');
      return;
    }
    // Ensure the part has a proper order when added
    const partToAdd = {
      ...partData,
      order: partData.order !== undefined ? partData.order : newOrder
    };
    test.value.listPart.push(partToAdd);
  } else {
    // Generate a unique default name/title like "Part N"
    const existingTitles = new Set(
      test.value.listPart.map(p => (p.title || '').trim().toLowerCase())
    );
    let idx = newOrder;
    let proposed = `Part ${idx}`;
    while (existingTitles.has(proposed.toLowerCase())) {
      idx++;
      proposed = `Part ${idx}`;
    }
    const newPart: TestPart = {
      id: `part-${Date.now()}`,
      name: proposed,
      title: proposed,
      description: '',
      order: newOrder,
      duration: 0,
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

// Handle question sets selected from the question bank
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
      !currentPart.listQuestionAndQuestionSet?.some(existingQs => existingQs.id === qs.id)
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
        const questionCount = questionSet.questions?.length || 0;
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
          questionCount: questionCount,
          tags: questionSet.tags
        };
        currentPart.listQuestionAndQuestionSet?.push(newQuestionSet);
        totalQuestionsAdded += questionCount;

      } catch (error) {
        toast.error(`Failed to add question set: ${questionSet.name}`);
      }
    }

    // Renumber all parts to maintain continuous global numbering
    if (newQuestionSets.length > 0) {
      renumberAllParts();
      const questionSetText = newQuestionSets.length > 1 ? 'question sets' : 'question set';
      const questionText = totalQuestionsAdded !== 1 ? 'questions' : 'question';
      toast.success(`Successfully added ${newQuestionSets.length} ${questionSetText} with ${totalQuestionsAdded} ${questionText} to "${currentPart.name || 'the part'}"`);
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

const handleRemoveQuestion = (questionId: string | number) => {
  // Check if we're in a part or in the main question bank
  if (test.value.listPart && test.value.listPart.length > 0) {
    // Find which part contains the question
    const partIndex = test.value.listPart.findIndex(part => {
      if (!part.listQuestionAndQuestionSet) return false;
      return part.listQuestionAndQuestionSet.some((item: Question | QuestionSet) => {
        // Only check questions, not question sets
        if ('questions' in item) return false;
        // Check by ID
        return (item.id && item.id === questionId);
      });
    });

    if (partIndex !== -1 && test.value.listPart[partIndex].listQuestionAndQuestionSet) {
      const part = test.value.listPart[partIndex];
      const initialLength = part.listQuestionAndQuestionSet!.length;

      // Remove from listQuestionAndQuestionSet
      part.listQuestionAndQuestionSet = part.listQuestionAndQuestionSet!.filter(
        (item: Question | QuestionSet) => {
          if ('questions' in item) return true; // Keep question sets
          // Remove the question with matching ID
          return item.id !== questionId;
        }
      );

      // Renumber all parts globally if something was removed
      if (part.listQuestionAndQuestionSet!.length < initialLength) {
        renumberAllParts();
        toast.success('Question removed successfully');
      }
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

    // Reorder remaining items sequentially with continuous numbering
    let currentOrder = 1;
    test.value.listQuestionAndQuestionSet = test.value.listQuestionAndQuestionSet.map((item) => {
      if ('questions' in item) {
        // Question set: assign order to the set and its questions
        const questionSetOrder = currentOrder;
        const reorderedQuestions = item.questions?.map((q: any) => {
          const questionOrder = currentOrder;
          currentOrder++;
          return {
            ...q,
            order: questionOrder
          };
        });
        return {
          ...item,
          order: questionSetOrder,
          questions: reorderedQuestions
        };
      }
      // Regular question
      const questionOrder = currentOrder;
      currentOrder++;
      return {
        ...item,
        order: questionOrder
      };
    });
  }

  toast.success('Question removed and list reordered');
};

const handleRemoveQuestionSet = (questionSetId: string) => {
  // Check if we're in a part or in the main question bank
  if (test.value.listPart && test.value.listPart.length > 0) {
    // Find which part contains the question set
    const partIndex = test.value.listPart.findIndex(part => {
      if (!part.listQuestionAndQuestionSet) return false;
      return part.listQuestionAndQuestionSet.some((item: Question | QuestionSet) =>
        'questions' in item && item.id === questionSetId
      );
    });

    if (partIndex !== -1 && test.value.listPart[partIndex].listQuestionAndQuestionSet) {
      // Remove the question set from the part
      const initialLength = test.value.listPart[partIndex].listQuestionAndQuestionSet!.length;
      test.value.listPart[partIndex].listQuestionAndQuestionSet =
        test.value.listPart[partIndex].listQuestionAndQuestionSet!.filter(
          (item: Question | QuestionSet) => {
            if ('questions' in item) {
              return item.id !== questionSetId;
            }
            return true; // Keep all questions
          }
        );

      // Update was successful
      if (test.value.listPart[partIndex].listQuestionAndQuestionSet!.length < initialLength) {
        const part = test.value.listPart[partIndex];

        // Also update questionSets array if it exists
        if (part.questionSets) {
          part.questionSets = part.questionSets.filter((qs: any) => qs.id !== questionSetId);
        }

        // Renumber all parts globally
        renumberAllParts();
        toast.success('Question set removed successfully');
      }
    }
  } else {
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

    // If we removed a question set, reorder remaining items
    if (test.value.listQuestionAndQuestionSet.length < initialLength) {
      let currentOrder = 1;
      test.value.listQuestionAndQuestionSet = test.value.listQuestionAndQuestionSet.map((item) => {
        if ('questions' in item) {
          // Question set: assign order to the set and its questions
          const questionSetOrder = currentOrder;
          const reorderedQuestions = item.questions?.map((q: any) => {
            const questionOrder = currentOrder;
            currentOrder++;
            return {
              ...q,
              order: questionOrder
            };
          });
          return {
            ...item,
            order: questionSetOrder,
            questions: reorderedQuestions
          };
        }
        // Regular question
        const questionOrder = currentOrder;
        currentOrder++;
        return {
          ...item,
          order: questionOrder
        };
      });

      toast.success('Question set removed and list reordered');
    }
  }
};

// Set the current question index when a question is selected from a part, and show the question editor UI
const handleSelectQuestion = ({ partIndex, questionIndex }: { partIndex: number; questionIndex: number }) => {
  if (test.value.listPart[partIndex]?.questions?.[questionIndex] !== undefined) {
    currentQuestionIndex.value = {
      partIndex,
      questionIndex
    };
    showQuestionEditor.value = true;
  }
};

// Update the active part index when the active part changes in the TestPartList component
const handleActivePartChange = (partIndex: number) => {
  activePartIndex.value = partIndex;
};

// Async method to validate and save the test data
const handleSave = async () => {
  try {
    // Validate required fields
    if (!test.value.title?.trim()) {
      toast.error('Test title is required');
      return;
    }

    // Prepare the payload according to TestEditVM interface
    const payload: import('@/api/admin/test/testApi').TestEditVM = {
      id: test.value.id,
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
          .map(q => ({
            id: q.id,
            order: q.order
          })) || [],
        questionSets: part.listQuestionAndQuestionSet
          ?.filter(item => 'questions' in item)
          .map(qs => ({
            id: qs.id,
            order: qs.order
          })) || [],
      })),
      listQuestion: test.value.listQuestionAndQuestionSet
        ?.filter(item => !('questions' in item))
        .map(q => ({
          questionId: q.id,
          order: q.order
        })) || [],
      listQuestionSet: test.value.listQuestionAndQuestionSet
        ?.filter(item => 'questions' in item)
        .map(qs => ({
          questionSetId: qs.id,
          order: qs.order
        })) || [],
      files: test.value.files || []
    };

    // Call the API to update the test (edit mode)
    const response = await testApi.updateTest(payload.id, payload, test.value.files || []);
    if (response.success && response.data) {
      toast.success('Test saved successfully!');
      // Optionally, redirect or update state after saving
      // router.push({ name: 'admin-test-edit', params: { id: response.data.id } });
    } else {
      throw new Error(response.message || 'Failed to save test');
    }
  } catch (error: any) {
    console.error('Error saving test:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save test. Please try again.';
    toast.error(errorMessage);
  }
};

// ... (rest of the file continues)
</script>
