<template>
  <fwb-modal v-if="isOpen" @close="closeModal" size="5xl" class="max-w-5xl">
    <template #header>
      <div class="flex items-center text-lg font-medium text-gray-900 dark:text-white">
        Question Bank
      </div>
    </template>
    
    <template #body>
      <div class="w-full flex flex-col h-[70vh]">
        <!-- Search and Filter Section -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-0 border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-4 p-4">
            <!-- Header with Title and Reset -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filter Questions</h3>
              <button @click="resetFilters"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>

            <!-- Search Bar -->
            <div class="relative">
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
            <div class="grid grid-cols-2 gap-4 w-full">
              <!-- Category Filter -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <SearchableSelect 
                  v-model="selectedCategory"
                  :options="categories.map(c => ({ value: c.id, label: c.name }))"
                  :loading="loadingStates.categories"
                  :disabled="loadingStates.categories"
                  placeholder="Select category..." 
                  @search="handleCategorySearch" />
              </div>

              <!-- Question Type Filter -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
                <SearchableSelect 
                  v-model="selectedQuestionType" 
                  :options="questionTypeOptions"
                  :loading="loadingStates.questionTypes"
                  :disabled="loadingStates.questionTypes"
                  placeholder="Select question type..." 
                  @search="handleTypeSearch" />
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
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Min score">
                </div>
                <div>
                  <label for="maxScore" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max
                    Score</label>
                  <input id="maxScore" v-model.number="maxScore" type="number" min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Max score">
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-600 px-4 py-2">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ totalQuestions }} questions found
              </div>
              <div v-if="selectedCount > 0" class="text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ selectedCount }} selected
              </div>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <!-- Empty State -->
          <div v-if="!loadingStates.questions && questions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No questions found matching your criteria.
          </div>
          <div v-else-if="loadingStates.questions" class="flex flex-col items-center justify-center py-8 space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p class="text-gray-500 dark:text-gray-400">Loading questions...</p>
          </div>

          <!-- Questions List -->
          <div class="space-y-3">
            <div v-for="(question, index) in filteredQuestions" :key="question.id"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              :class="{ 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20': isQuestionSelected(question.id) }"
              @click="toggleQuestion(question)">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div class="flex items-center h-5">
                    <input type="checkbox" :checked="isQuestionSelected(question.id)"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      @click.stop>
                  </div>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <div class="flex items-center justify-between space-x-2">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      <span v-html="question.prompt || 'Untitled Question'"></span>
                    </h4>
                    <span class="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                      {{ question.type || QUESTION_TYPES.MULTIPLE_CHOICE }}
                    </span>
                  </div>
                  
                  <!-- Question Options / Answers -->
                  <div v-if="question.type === QUESTION_TYPES.MULTIPLE_CHOICE && question.options && question.options.length > 0" class="mt-2 space-y-1.5">
                    <!-- Multiple Choice Options -->
                    <div v-for="(option, oIndex) in question.options" :key="option.id" 
                      class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <span class="font-medium mr-2 mt-0.5">{{ String.fromCharCode(65 + oIndex) }}.</span>
                      <div class="flex-1 flex items-baseline flex-nowrap gap-2">
                        <span v-html="option.text || 'No content'" class="whitespace-nowrap"></span>
                        <span v-if="option.correct" class="inline-flex items-center text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
                          <svg class="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          <span>Correct Answer</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="question.type === QUESTION_TYPES.FILL_IN_BLANK && question.questionAnswers && question.questionAnswers.length > 0" class="mt-2 space-y-1.5">
                    <!-- Fill in the Blank Answers -->
                    <div class="text-sm text-gray-700 dark:text-gray-300">
                      <div class="font-medium mb-1 text-blue-600 dark:text-blue-400">Possible Answers:</div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="(answer, aIndex) in question.questionAnswers" :key="aIndex"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                          {{ answer }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="question.type === QUESTION_TYPES.ESSAY" class="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                    Essay question - No specific answer options
                  </div>
                  
                  <div class="mt-2.5 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                    <div class="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full px-2.5 py-1">
                      <svg class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-medium text-gray-700 dark:text-gray-300">{{ question.duration || 0 }}s</span>
                    </div>
                    <div class="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full px-2.5 py-1">
                      <svg class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="font-medium text-gray-700 dark:text-gray-300">{{ question.points || 0 }} pts</span>
                    </div>
                    <div v-if="question.category" class="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full px-2.5 py-1">
                      <svg class="h-3.5 w-3.5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span class="truncate max-w-[120px]">{{ question.category }}</span>
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
      <div class="flex justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          {{ selectedCount }} questions selected
        </div>
        <div>
          <fwb-button 
            @click="closeModal" 
            color="alternative" 
            class="mr-2"
            :disabled="loadingStates.saving"
          >
            Cancel
          </fwb-button>
          <fwb-button 
            @click="saveSelected" 
            color="blue"
            :disabled="loadingStates.saving || selectedCount === 0"
            :class="{ 'opacity-50 cursor-not-allowed': loadingStates.saving || selectedCount === 0 }"
          >
            <span v-if="loadingStates.saving" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
            <span v-else>
              Add Selected ({{ selectedCount }})
            </span>
          </fwb-button>
        </div>
      </div>
    </template>
  </fwb-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

// Question type constants
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'Multiple Choice',
  FILL_IN_BLANK: 'Fill in the Blank',
  ESSAY: 'Essay'
} as const;
import { FwbModal, FwbButton } from 'flowbite-vue';
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue';
import { questionApi, type QuestionViewModel } from '@/api/admin/question/questionApi';
import { questionCategoryApi, type QuestionCategory } from '@/api/admin/question-category/questionCategoryApi';
import { questionTypeApi } from '@/api/admin/question-type/questionTypeApi';
import { useToast } from 'vue-toastification';

interface Question extends Omit<QuestionViewModel, 'questionCategory' | 'questionType' | 'score' | 'questionAnswers' | 'options' | 'questionAudios'> {
  type: string;
  category: string;
  points: number;
  content: string;
  duration?: number;
  options?: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
  questionAnswers?: string[];
  questionAudios?: any[];
}

interface Category extends QuestionCategory {}

interface QuestionTypeOption {
  value: string;
  label: string;
}

interface QuestionBankModalProps {
  isOpen: boolean;
  selectedQuestions: Question[];
  questionTypes: Array<{ value: string; label: string }>;
}

interface QuestionBankModalEmits {
  (e: 'close'): void;
  (e: 'select', questions: Question[]): void;
}

const props = withDefaults(defineProps<QuestionBankModalProps>(), {
  selectedQuestions: () => [],
  questionTypes: () => []
});

const emit = defineEmits<QuestionBankModalEmits>();

// State
const searchQuery = ref<string>('');
const selectedCategory = ref<string>('');
const selectedQuestionType = ref<string>('');
const minScore = ref<number>(0);
const maxScore = ref<number>(10);
const totalQuestions = ref<number>(0);

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

// Track fetch calls
const fetchCount = ref(0);

// Fetch questions from API
const fetchQuestions = async () => {
  const callId = ++fetchCount.value;
  console.log(`[${callId}] fetchQuestions called`);
  
  try {
    loadingStates.value.questions = true;
    const response = await questionApi.getAll({
      page: 0,
      size: 50, // Adjust page size as needed
      direction: 'desc',
      questionTypeId: selectedQuestionType.value || undefined,
      categoryId: selectedCategory.value || undefined,
      minScore: minScore.value || undefined,
      prompt: searchQuery.value || undefined
    });
    
    // Log raw question data for inspection
    console.log('Raw question data from API:', response.data.content);
    
    // Transform API response to match our component's expected format
    questions.value = response.data.content.map(q => {
      const question = {
        ...q, // Include all original properties
        id: q.id,
        prompt: q.prompt,
        content: q.prompt, // Using prompt as content for display
        type: q.questionType?.name || 'Unknown',
        category: q.questionCategory?.name || 'Uncategorized',
        points: q.score || 0
      };
      console.log('Processed question:', question);
      return question;
    });
    
    totalQuestions.value = response.data.totalElements;
  } catch (error) {
    console.error('Error fetching questions:', error);
    toast.error('Failed to load questions');
  } finally {
    console.log(`[${callId}] fetchQuestions completed`);
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
    console.error('Error fetching categories:', error);
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
    console.error('Error fetching question types:', error);
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
  console.log('Initial data loading started');
  
  try {
    // First load categories and question types
    await Promise.all([
      fetchCategories(),
      fetchQuestionTypes()
    ]);
    
    // Then fetch questions after initial data is loaded
    console.log('Initial data loaded, fetching questions');
    await fetchQuestions();
    initialLoadDone.value = true;
    console.log('Initial load completed');
  } finally {
    isInitializing.value = false;
  }
};

// Initialize when the modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await initializeData();
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
    fetchQuestions();
  }
}, { immediate: false });

// Selected questions
const selectedQuestions = ref<Set<string>>(new Set());

// Reset all filters and clear selections
const resetAllFilters = () => {
  // Only update values that actually changed to prevent unnecessary re-fetches
  if (searchQuery.value !== '') searchQuery.value = '';
  if (selectedCategory.value !== '') selectedCategory.value = '';
  if (selectedQuestionType.value !== '') selectedQuestionType.value = '';
  if (minScore.value !== 0) minScore.value = 0;
  if (maxScore.value !== 10) maxScore.value = 10;
  
  selectedQuestions.value.clear();
  
  // Only fetch if we actually changed any filter values
  if (searchQuery.value === '' && 
      selectedCategory.value === '' && 
      selectedQuestionType.value === '' && 
      minScore.value === 0 && 
      maxScore.value === 10) {
    fetchQuestions();
  }
};

// Reset filters (alias for resetAllFilters for template compatibility)
const resetFilters = resetAllFilters;

// Computed
const selectedCount = computed<number>(() => selectedQuestions.value.size);

// Get question by ID
const getQuestionById = (id: string): Question | undefined => {
  return questions.value.find(q => q.id === id);
};

// Get selected questions data
const getSelectedQuestions = (): Question[] => {
  return Array.from(selectedQuestions.value)
    .map(id => getQuestionById(id))
    .filter((q): q is Question => q !== undefined);
};

// Methods
const closeModal = () => {
  emit('close');
};

const saveSelected = async () => {
  try {
    loadingStates.value.saving = true;
    const selected = getSelectedQuestions();
    emit('select', selected);
    closeModal();
  } catch (error) {
    console.error('Error saving selected questions:', error);
    toast.error('Failed to save selected questions');
  } finally {
    loadingStates.value.saving = false;
  }
};

const toggleQuestion = (question: Question) => {
  const newSelected = new Set<string>(selectedQuestions.value);
  if (newSelected.has(question.id)) {
    newSelected.delete(question.id);
  } else {
    newSelected.add(question.id);
  }
  selectedQuestions.value = newSelected;
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
  console.log(`Modal ${newVal ? 'opened' : 'closed'}`);
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
