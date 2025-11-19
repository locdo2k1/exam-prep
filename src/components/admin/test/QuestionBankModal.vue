<template>
  <fwb-modal v-if="isOpen" @close="closeModal" size="5xl" class="max-w-5xl [&>div]:[&>div]:overflow-hidden">
    <template #header>
      <div class="flex items-center text-lg font-medium text-gray-900 dark:text-white">
        Question Bank
      </div>
    </template>

    <template #body>
      <!-- Toggle Button -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filter Questions</h3>
        <div class="flex items-center">
          <span v-if="selectedCount > 0" class="text-sm font-medium text-blue-600 dark:text-blue-400 mr-4">
            {{ selectedCount }} selected
          </span>
          <button @click.stop="toggleFilters"
            class="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :aria-expanded="isFiltersExpanded" type="button">
            <span
              class="relative inline-flex items-center h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200"
              :class="isFiltersExpanded ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'">
              <span class="sr-only">Toggle filters</span>
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200"
                :class="{ 'translate-x-4': isFiltersExpanded, 'translate-x-0.5': !isFiltersExpanded }">
              </span>
            </span>
            <span class="ml-2">{{ isFiltersExpanded ? 'Filters On' : 'Filters Off' }}</span>
          </button>
        </div>
      </div>

      <div class="flex w-full h-[50vh] gap-6">
        <!-- Search and Filter Section -->
        <div v-show="isFiltersExpanded" class="w-1/3 flex flex-col transition-all duration-200">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">

            <!-- Collapsible Content -->
            <div v-show="isFiltersExpanded"
              class="border-t border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto">
              <div class="flex flex-col space-y-4 p-4">
                <!-- Header with Title and Reset -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center justify-between w-full">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Refine Results</h4>
                    <button @click="resetAllFilters"
                      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset All
                    </button>
                  </div>
                </div>

                <!-- Search Bar -->
                <div class="relative mb-2.5">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input v-model="searchQuery" @input="handleSearchInput" type="text"
                    class="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Search questions by prompt, content, or tags...">
                </div>

                <!-- Main Filters Grid -->
                <div class="grid grid-cols-2 gap-4 w-full mb-0">
                  <!-- Category Filter -->
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <SearchableSelect ref="categorySelect" v-model="selectedCategory"
                      :options="categories.map(c => ({ value: c.id, label: c.name }))"
                      :loading="loadingStates.categories" :disabled="loadingStates.categories"
                      placeholder="Select category..." @search="handleCategorySearch" />
                  </div>

                  <!-- Question Type Filter -->
                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
                    <SearchableSelect ref="typeSelect" v-model="selectedQuestionType" :options="questionTypeOptions"
                      :loading="loadingStates.questionTypes" :disabled="loadingStates.questionTypes"
                      placeholder="Select question type..." @search="handleTypeSearch" />
                  </div>
                </div>

                <!-- Secondary Filters Row -->
                <div class="rounded-lg mt-2 space-y-4">
                  <!-- Score Range -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="minScore" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min
                        Score</label>
                      <input id="minScore" v-model.number="minScore" type="number" min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Min score">
                    </div>
                    <div>
                      <label for="maxScore" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max
                        Score</label>
                      <input id="maxScore" v-model.number="maxScore" type="number" min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Max score">
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-600 px-4 py-2 mt-auto flex-shrink-0">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ totalQuestions }} questions found
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions List Section -->
        <div :class="['flex-1 flex flex-col transition-all duration-200', { 'w-full': !isFiltersExpanded }]">
          <div
            class="flex-1 overflow-auto bg-transparent p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full transition-colors duration-200">
            <!-- Empty State -->
            <div v-if="!loadingStates.questions && questions.length === 0"
              class="text-center py-8 text-gray-500 dark:text-gray-400">
              No questions found matching your criteria.
            </div>
            <div v-else-if="loadingStates.questions" class="flex flex-col items-center justify-center py-8 space-y-4">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400">
              </div>
              <p class="text-gray-500 dark:text-gray-400">Loading questions...</p>
            </div>

            <!-- Questions List -->
            <div class="space-y-3">
              <div v-for="(question, index) in filteredQuestions" :key="question.id"
                class="p-4 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer"
                :class="{
                  'ring-2 ring-blue-500 bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800': isQuestionSelected(question.id),
                  'hover:bg-gray-50 dark:hover:bg-gray-700/70': !isQuestionSelected(question.id)
                }" @click="toggleQuestion(question)">
                <div class="flex items-start">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white break-words w-full">
                        <span v-html="question.prompt || 'Untitled Question'"></span>
                      </h4>
                      <span
                        class="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 whitespace-nowrap">
                        {{ question.questionType.name || QUESTION_TYPES.MULTIPLE_CHOICE }}
                      </span>
                    </div>

                    <!-- Question Options / Answers -->
                    <div v-if="question.type === 'Multiple Choice' || question.questionType?.name === 'Multiple Choice'" class="mt-2 space-y-2">
                      <div v-if="question.options?.length" class="space-y-1.5">
                        <div v-for="(option, optIndex) in expandedQuestions.has(question.id) ? question.options : question.options.slice(0, 3)" :key="option.id" class="flex items-start">
                          <span class="inline-flex items-center justify-center w-4 h-4 mt-1 mr-2 text-xs rounded flex-shrink-0"
                            :class="{
                              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200':option.correct,
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': !option.correct
                            }">
                            {{ String.fromCharCode(65 + optIndex) }}
                          </span>
                          <div class="flex-1 min-w-0">
                            <span class="text-sm text-gray-700 dark:text-gray-300 break-words"
                              :class="{ 'font-medium': option.correct || option.correct }">
                              {{ option.text || `Option ${optIndex + 1}` }}
                            </span>
                            <span v-if="option.correct || option.correct" class="ml-1.5 text-green-500">
                              <i class="fas fa-check text-xs"></i>
                              <span class="sr-only">Correct Answer</span>
                            </span>
                          </div>
                        </div>
                        <button 
                          v-if="question.options.length > 3" 
                          @click.stop="toggleQuestionOptions(question.id)"
                          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-6 focus:outline-none flex items-center"
                        >
                          <span v-if="!expandedQuestions.has(question.id)">+{{ question.options.length - 3 }} more options</span>
                          <span v-else>Show less</span>
                          <svg v-if="!expandedQuestions.has(question.id)" class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                          <svg v-else class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                          </svg>
                        </button>
                      </div>
                      <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                        No options provided
                      </div>
                    </div>

                    <div v-else-if="question.type === 'Fill in the Blank' || question.questionType?.name === 'Fill in the Blank'" class="mt-2">
                      <div v-if="question.questionAnswers?.length" class="space-y-1.5">
                        <div class="text-xs font-medium text-gray-700 dark:text-gray-300">Acceptable Answers:</div>
                        <div class="flex flex-wrap gap-1.5">
                          <span v-for="(answer, ansIndex) in question.questionAnswers.slice(0, 4)" :key="ansIndex"
                            class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            "{{ answer }}"
                          </span>
                          <span v-if="question.questionAnswers.length > 4" class="text-xs text-gray-500 dark:text-gray-400 self-center">
                            +{{ question.questionAnswers.length - 4 }} more
                          </span>
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                        No answers provided
                      </div>
                    </div>

                    <div v-else-if="question.type === 'Essay' || question.questionType?.name === 'Essay'"
                      class="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                      Essay question - No specific answer options
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col space-y-4 w-full">
        <!-- Pagination -->
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ Math.min((currentPage - 1) * pageSize + 1, totalQuestions) }} to
            {{ Math.min(currentPage * pageSize, totalQuestions) }} of {{ totalQuestions }} questions
          </div>
          <div class="flex items-center space-x-1">
            <fwb-button @click="currentPage > 1 ? currentPage-- : null"
              :disabled="currentPage === 1 || loadingStates.questions" color="alternative" size="sm"
              class="px-3 py-1.5">
              Previous
            </fwb-button>
            <div class="flex items-center space-x-1">
              <template v-for="page in totalPages" :key="page">
                <fwb-button 
                  @click="currentPage = page" 
                  :color="currentPage === page ? 'blue' : 'alternative'"
                  size="sm"
                  class="w-8 h-8 p-0 flex items-center justify-center">
                  {{ page }}
                </fwb-button>
              </template>
            </div>
            <fwb-button @click="currentPage < totalPages ? currentPage++ : null"
              :disabled="currentPage >= totalPages || loadingStates.questions"
              color="alternative" size="sm" class="px-3 py-1.5">
              Next
            </fwb-button>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            {{ selectedCount }} questions selected
          </div>
          <div>
            <fwb-button @click="closeModal" color="alternative" class="mr-2" :disabled="loadingStates.saving">
              Cancel
            </fwb-button>
            <fwb-button @click="saveSelected" color="blue" :disabled="loadingStates.saving || selectedCount === 0"
              :class="{ 'opacity-50 cursor-not-allowed': loadingStates.saving || selectedCount === 0 }">
              <span v-if="loadingStates.saving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Adding...
              </span>
              <span v-else>
                Add Selected ({{ selectedCount }})
              </span>
            </fwb-button>
          </div>
        </div>
      </div>
    </template>
  </fwb-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import { FwbModal, FwbButton } from 'flowbite-vue';
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue';
import { questionApi, type QuestionViewModel } from '@/api/admin/question/questionApi';
import { questionCategoryApi, type QuestionCategory } from '@/api/admin/question-category/questionCategoryApi';
import { questionTypeApi } from '@/api/admin/question-type/questionTypeApi';
import { useToast } from 'vue-toastification';
import type { Question } from '@/types';

// Question type constants
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_IN_BLANK: 'fill_in_blank',
  ESSAY: 'essay'
} as const;

type Category = QuestionCategory;

interface QuestionTypeOption {
  value: string;
  label: string;
}

interface QuestionBankModalProps {
  isOpen: boolean;
  selectedQuestions: Question[];
}

interface QuestionBankModalEmits {
  (e: 'close'): void;
  (e: 'select', questions: Question[]): void;
}

const props = withDefaults(defineProps<QuestionBankModalProps>(), {
  selectedQuestions: () => []
});

const emit = defineEmits<QuestionBankModalEmits>();

// State
const isFiltersExpanded = ref(true);

// Toggle filters section
const toggleFilters = () => {
  isFiltersExpanded.value = !isFiltersExpanded.value;
};

// State
const searchQuery = ref<string>('');
const selectedCategory = ref<string>('');
const selectedQuestionType = ref<string>('');
const currentPage = ref<number>(1);
const minScore = ref<number>(0);
const maxScore = ref<number>(10);
const totalQuestions = ref<number>(0);
const totalPages = ref<number>(1);

const toast = useToast();
// Separate loading states for better user feedback
const loadingStates = ref({
  questions: false,
  categories: false,
  questionTypes: false,
  saving: false
});
const questions = ref<Question[]>([]);
const categories = ref<Category[]>([]);
const questionTypeOptions = ref<QuestionTypeOption[]>([]);
const expandedQuestions = ref<Set<string>>(new Set());

// Track fetch calls
const fetchCount = ref(0);

// Fetch questions from API
const pageSize = 10; // Number of items per page

const fetchQuestions = async () => {
  const callId = ++fetchCount.value;

  try {
    loadingStates.value.questions = true;
    const response = await questionApi.getAll({
      page: currentPage.value - 1, // Convert to 0-based index for API
      size: pageSize,
      direction: 'desc',
      questionTypeId: selectedQuestionType.value || undefined,
      categoryId: selectedCategory.value || undefined,
      minScore: minScore.value || undefined,
      prompt: searchQuery.value || undefined
    });

    // Log raw question data for inspection

    // Transform API response to match our component's expected format
    questions.value = response.data.content.map(q => {
      const question: Question = {
        ...q, // Include all original properties
        id: q.id,
        prompt: q.prompt || '',
        content: q.prompt || '',
        type: q.questionType?.name || '',
        category: q.questionCategory?.name || 'Uncategorized',
        points: q.score || 0,
        // Add required fields with default values
        difficulty: 'medium', // Default to medium difficulty
        duration: 60, // Default 60 seconds
        explanation: '', // Empty explanation by default
        tags: [], // Empty tags by default
        // Ensure questionAnswers is properly typed
        questionAnswers: Array.isArray(q.questionAnswers) ? q.questionAnswers : [],
        // Ensure options is properly typed
        options: Array.isArray(q.options) ? q.options : []
      };

      return question;
    });

    totalQuestions.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    toast.error('Failed to load questions');
  } finally {
    loadingStates.value.questions = false;
  }
};

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loadingStates.value.categories = true;
    const response = await questionCategoryApi.getAll({
      page: 0,
      size: 100, // Fetch all categories
      sort: 'name',
      direction: 'asc'
    });
    categories.value = response.data.content;
  } catch (error) {
    toast.error('Failed to load categories');
  } finally {
    loadingStates.value.categories = false;
  }
};

// Fetch question types from API
const fetchQuestionTypes = async () => {
  try {
    loadingStates.value.questionTypes = true;
    const response = await questionTypeApi.getAll({
      page: 0,
      size: 100, // Fetch all question types
      sort: 'name',
      direction: 'asc'
    });

    questionTypeOptions.value = response.data.content.map(type => ({
      value: type.id,
      label: type.name
    }));
  } catch (error) {
    toast.error('Failed to load question types');
  } finally {
    loadingStates.value.questionTypes = false;
  }
};

// Track if we've done initial load
const initialLoadDone = ref(false);
const isInitializing = ref(false);

// Initialize data
const initializeData = async () => {
  if (initialLoadDone.value || isInitializing.value) return;

  isInitializing.value = true;

  try {
    // First load categories and question types
    await globalThis.Promise.all([
      fetchCategories(),
      fetchQuestionTypes()
    ]);

    // Then fetch questions after initial data is loaded
    await fetchQuestions();
    initialLoadDone.value = true;
  } finally {
    isInitializing.value = false;
  }
};

// Initialize when the modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await initializeData();
    // Reset pagination and fetch questions
    currentPage.value = 1;
    await fetchQuestions();
  }
}, { immediate: true });

// Watch for search query changes
watch(searchQuery, () => {
  if (initialLoadDone.value) {
    fetchQuestions();
  }
});

// Watch for filter changes
watch([selectedCategory, selectedQuestionType, minScore, maxScore], () => {
  if (initialLoadDone.value) {
    currentPage.value = 1; // Reset to first page when filters change
    fetchQuestions();
  }
}, { immediate: false });

// Watch for page changes
watch(currentPage, () => {
  if (initialLoadDone.value) {
    fetchQuestions();
  }
}, { immediate: false });

// Selected questions
const selectedQuestions = ref<Set<string>>(new Set());

// Refs for SearchableSelect components
interface SearchableSelectMethods {
  reset: () => void;
}

const categorySelect = ref<SearchableSelectMethods | null>(null);
const typeSelect = ref<SearchableSelectMethods | null>(null);

// Reset all filters and clear selections
const resetAllFilters = () => {

  // Reset all filter values
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedQuestionType.value = '';
  minScore.value = 0;
  maxScore.value = 10;

  // Clear selected questions
  selectedQuestions.value.clear();

  // Reset SearchableSelect components if they exist
  if (categorySelect.value) categorySelect.value.reset();
  if (typeSelect.value) typeSelect.value.reset();

  // Refetch questions with reset filters
};

// Reset filters (alias for resetAllFilters for template compatibility)
const resetFilters = resetAllFilters;

// Computed
const selectedCount = computed<number>(() => selectedQuestions.value.size);

// Get question by ID
const getQuestionById = async (id: string): globalThis.Promise<Question | undefined> => {
  const response = await questionApi.getById(id);
  const q = response?.data;
  if (!q) return undefined;

  const question: Question = {
    ...q,
    id: q.id,
    prompt: q.prompt || '',
    content: q.prompt || '',
    type: q.questionType?.name || '',
    category: q.questionCategory?.name || 'Uncategorized',
    points: q.score || 0,
    difficulty: 'medium',
    duration: 60,
    explanation: '',
    tags: [],
    questionAnswers: Array.isArray(q.questionAnswers) ? q.questionAnswers : [],
    options: Array.isArray(q.options) ? q.options : []
  };

  return question;
};

// Get selected questions data
const getSelectedQuestions = async (): globalThis.Promise<Question[]> => {
  const results = await globalThis.Promise.all(
    Array.from(selectedQuestions.value).map(id => getQuestionById(id))
  );
  return results.filter((q): q is Question => q !== undefined);
};

// Methods
const closeModal = () => {
  // Reset search and filters
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedQuestionType.value = '';

  // Reset pagination
  currentPage.value = 1;

  // Clear selected questions
  selectedQuestions.value.clear();

  // Reset any select components if they exist
  if (categorySelect.value) {
    categorySelect.value.reset();
  }
  if (typeSelect.value) {
    typeSelect.value.reset();
  }

  // Close the modal
  emit('close');
};

const saveSelected = async () => {
  try {
    loadingStates.value.saving = true;
    const selected = await getSelectedQuestions();
    emit('select', selected);
    closeModal();
  } catch (error) {
    toast.error('Failed to save selected questions');
  } finally {
    loadingStates.value.saving = false;
  }
};

const toggleQuestionOptions = (questionId: string) => {
  const newExpanded = new Set(expandedQuestions.value);
  if (newExpanded.has(questionId)) {
    newExpanded.delete(questionId);
  } else {
    newExpanded.add(questionId);
  }
  expandedQuestions.value = newExpanded;
};

const toggleQuestion = (question: Question) => {
  selectedQuestions.value = new Set(
    selectedQuestions.value.has(question.id)
      ? [...selectedQuestions.value].filter(id => id !== question.id)
      : [...selectedQuestions.value, question.id]
  );
};

const isQuestionSelected = (questionId: string) => {
  return selectedQuestions.value.has(questionId);
};

const applyFilters = () => {
  // Filtering logic can be added here if needed
};

const handleSearchInput = () => {
  applyFilters();
};

const handleCategorySearch = (query: string) => {
  return categories.value
    .filter(category => category.name.toLowerCase().includes(query.toLowerCase()))
    .map(cat => ({ value: cat.id, label: cat.name }));
};

const handleLoadMoreCategories = () => {
  // Not needed with static data
};

const handleTypeSearch = (query: string) => {
  return questionTypeOptions.value
    .filter(type => type.label.toLowerCase().includes(query.toLowerCase()));
};

// Handle modal open/close
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    // Clear selections when modal closes
    selectedQuestions.value.clear();
  }
});

// Initialize total questions count when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // fetchQuestions();
  } else {
    // Reset selections when modal closes
    selectedQuestions.value.clear();
  }
}, { immediate: true });

// Initialize selected questions from props
watch(() => props.selectedQuestions, (newQuestions) => {
  if (newQuestions) {
    selectedQuestions.value = new Set(newQuestions.map(q => q.id));
    totalQuestions.value = questions.value.length;
  }
}, { immediate: true });

// Computed property for filtered questions (client-side filtering if needed)
const filteredQuestions = computed<Question[]>(() => {
  // Since we're doing server-side filtering, we can just return the questions
  // This is kept in case we need client-side filtering for any reason
  return questions.value;
});

// Update total questions count when questions change
watch(questions, (newQuestions) => {
  totalQuestions.value = newQuestions.length;
}, { immediate: true });
</script>

<style scoped>
/* Custom scrollbar for WebKit browsers (Chrome, Safari, etc) */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
}

.dark .scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: rgb(107 114 128);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}
</style>
