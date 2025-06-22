<template>
  <div
    class="w-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
    <div class="flex flex-col lg:flex-row h-full w-full divide-x divide-gray-200 dark:divide-gray-700">
      <!-- Left column for editor -->
      <div class="w-full lg:w-1/2 p-4 flex flex-col overflow-hidden">
        <div class="mb-4 flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Question Set Content
          </h2>
        </div>

        <!-- Main content container with two equal rows -->
        <div class="grid grid-rows-[auto_minmax(0,1fr)] gap-4 h-full min-h-0">
          <!-- Selected Questions Section (Top Row) -->
          <div class="flex flex-col">
            <div v-if="selectedQuestions.length > 0"
              class="flex flex-col bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3
                class="text-sm font-medium text-gray-700 dark:text-gray-300 p-3 border-b border-gray-200 dark:border-gray-600">
                Selected Questions ({{ selectedQuestions.length }})</h3>
              <div class="p-2 space-y-2">
                <div v-for="(question, index) in selectedQuestions" :key="question.id"
                  class="flex items-center p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500">
                  <span class="text-xs text-gray-500 dark:text-gray-300 mr-2">{{ index + 1 }}.</span>
                  <div 
                    class="flex-1 text-sm text-gray-700 dark:text-gray-200 line-clamp-1" 
                    v-html="question.prompt ? sanitizeHtml(question.prompt.replace(/<[^>]*>/g, ' ').trim()) : ''"
                    :title="question.prompt ? sanitizeHtml(question.prompt.replace(/<[^>]*>/g, ' ').trim()) : ''"
                  ></div>
                  <button @click="toggleQuestion(question.id)" class="text-gray-400 hover:text-red-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-else
              class="p-4 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              No questions selected
            </div>
          </div>

          <!-- Editor Section (Bottom Row) -->
          <div class="flex flex-col min-h-0">
            <div
              class="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <QuillEditor ref="quillEditor" v-model:content="questionContent" :options="editorOptions"
                contentType="html" class="flex-1 overflow-hidden" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Question Selection List -->
      <div class="w-full lg:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 flex flex-col min-h-0">
        <div class="flex-1 overflow-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Questions</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedCount }} selected
            </span>
          </div>

          <!-- Search and Filter Section -->
          <div
            class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-0 border-gray-200 dark:border-gray-700">
            <div class="flex flex-col space-y-4">
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
                  <SearchableSelect ref="categorySelect" v-model="filters.categoryId"
                    :options="categories.map(c => ({ value: c.id, label: c.name }))" :loading="loadingCategories"
                    :has-more="hasMoreCategories" placeholder="Search categories..." @search="handleCategorySearch"
                    @load-more="handleLoadMoreCategories" @select="selectCategory" />
                </div>

                <!-- Question Type Filter -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
                  <SearchableSelect ref="typeSelect" v-model="filters.questionTypeId" :options="questionTypes"
                    :loading="loadingQuestionTypes" placeholder="Search types..." @search="handleTypeSearch"
                    @select="selectType" />
                </div>
              </div>

              <!-- Secondary Filters Row -->
              <div class="rounded-lg mt-2 space-y-4">
                <!-- Score Range -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="minScore" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min
                      Score</label>
                    <input id="minScore" v-model.number="filters.minScore" type="number" min="0"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Min score" @change="applyFilters">
                  </div>
                  <div>
                    <label for="maxScore" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max
                      Score</label>
                    <input id="maxScore" v-model.number="filters.maxScore" type="number" min="0"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Max score" @change="applyFilters">
                  </div>
                </div>
              </div>

            </div>
            <div class="border-gray-200 dark:border-gray-700 px-4 py-2">
              <div class="flex justify-end">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ totalQuestions }} questions found
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col min-h-0">
            <div class="overflow-y-auto flex-1 max-h-[calc(100vh-300px)]">
              <!-- Pagination Controls -->
              <div v-if="!isLoading && availableQuestions.length > 0" class="flex items-center justify-between mb-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Showing
                  <span class="font-medium">
                    {{ (filters.page * filters.size) + 1 }}
                  </span> to
                  <span class="font-medium">
                    {{ Math.min((filters.page + 1) * filters.size, totalQuestions) }}
                  </span> of
                  <span class="font-medium">
                    {{ totalQuestions }}
                  </span> questions
                  <span class="ml-2">(Page {{ filters.page + 1 }} of {{ totalPages || 1 }})</span>
                </div>
                <div class="flex space-x-2">
                  <button @click="previousPage" :disabled="filters.page === 0"
                    class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="{
                      'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500': filters.page === 0,
                      'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': filters.page !== 0
                    }">
                    Previous
                  </button>
                  <button @click="nextPage" :disabled="filters.page >= totalPages - 1"
                    class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="{
                      'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500': filters.page >= totalPages - 1,
                      'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': filters.page < totalPages - 1
                    }">
                    Next
                  </button>
                </div>
              </div>
              <!-- Loading State -->
              <div v-if="isLoading" class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>

              <!-- Empty State -->
              <div v-else-if="availableQuestions.length === 0"
                class="text-center py-8 text-gray-500 dark:text-gray-400">
                No questions found matching your criteria
              </div>

              <!-- Question List -->
              <transition-group v-else name="question-list" tag="div" class="space-y-3">
                <div v-for="(question, index) in availableQuestions" :key="question.id"
                  class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-150 cursor-pointer"
                  @click.self="toggleQuestion(question.id)">
                  <div class="flex items-center p-4">
                    <!-- Question Number -->
                    <div
                      class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-gray-100 dark:bg-gray-600 flex-shrink-0">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ (filters.page * filters.size) +
                        index + 1 }}</span>
                    </div>

                    <!-- Question Content -->
                    <div class="flex-1 min-w-0 break-words" @click.stop>
                      <div 
                        class="text-sm font-medium text-gray-800 dark:text-gray-200 ql-editor" 
                        v-html="question.prompt ? sanitizeHtml(question.prompt) : ''"
                        style="padding: 0;"
                      ></div>
                    </div>

                    <!-- Toggle Selection Button -->
                    <button @click.stop="toggleQuestion(question.id)"
                      class="ml-3 flex-shrink-0 p-1.5 rounded-full transition-colors duration-150" :class="{
                        'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30': !isQuestionInAvailable(question.id),
                        'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30': isQuestionInAvailable(question.id)
                      }"
                      :title="!isQuestionInAvailable(question.id) ? 'Add to available questions' : 'Remove from available questions'">
                      <svg v-if="!isQuestionInAvailable(question.id)" class="w-5 h-5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Options or Answers -->
                  <div v-if="question.options?.length > 0" class="pl-16 pr-4 pb-4 pt-0 -mt-2 break-words">
                    <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Options:</div>
                    <div class="overflow-x-auto">
                      <div class="flex space-x-4 pb-2" style="min-width: max-content">
                        <div v-for="(option, optIndex) in question.options" :key="option.id"
                          class="flex items-center text-sm whitespace-nowrap" :class="{
                            'text-green-600 dark:text-green-400': option.correct,
                            'text-gray-700 dark:text-gray-300': !option.correct
                          }">
                          <span class="flex items-center mr-1">
                            <svg class="w-1.5 h-1.5 text-gray-500 dark:text-gray-400" fill="currentColor"
                              viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="4" />
                            </svg>
                          </span>
                          <span v-html="option.text"></span>
                          <svg v-if="option.correct" class="w-4 h-4 ml-1 text-green-500 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="question.questionAnswers?.length > 0" class="pl-16 pr-4 pb-4 pt-0 -mt-2 break-words">
                    <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Answers:</div>
                    <div class="overflow-x-auto">
                      <div class="flex space-x-4 pb-2" style="min-width: max-content">
                        <div v-for="(answer, ansIndex) in question.questionAnswers" :key="ansIndex"
                          class="flex items-center text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          <span class="font-medium mr-1">{{ ansIndex + 1 }}.</span>
                          <span v-html="answer"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import DOMPurify from 'dompurify';
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Quill } from '@vueup/vue-quill';
import ImageResize from 'quill-image-resize-vue';
import { questionApi } from '@/api/admin/question/questionApi';
import { questionTypeApi } from '@/api/admin/question-type/questionTypeApi';
import { questionCategoryApi } from '@/api/admin/question-category/questionCategoryApi';

// Register the image resize module with Quill
Quill.register('modules/imageResize', ImageResize.default || ImageResize);

export default {
  name: 'QuestionSet',
  components: {
    QuillEditor,
    SearchableSelect,
  },
  emits: ['questions-selected'],
  setup(props, { emit }) {
    // Reactive state
    const questionContent = ref('');
    const selectedQuestionsSet = ref(new Set());
    const availableQuestions = ref([]);
    const totalQuestions = ref(0);
    const totalPages = ref(1); // Initialize with 1 to prevent undefined access
    const isLoading = ref(false);
    const searchQuery = ref('');
    const currentPage = ref(0);
    const debounceTimer = ref(null);
    const showAdvancedFilters = ref(false);
    const questionTypes = ref([]);
    const categories = ref([]);
    const isDark = ref(document.documentElement.classList.contains('dark'));
    const isMobile = ref(window.innerWidth < 1024);
    const quillEditor = ref(null);
    const loadingQuestionTypes = ref(false);

    // Editor options
    const editorOptions = ref({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        imageResize: {
          displaySize: true,
          modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
      },
      placeholder: 'Type your content here...',
      theme: 'snow',
    });

    // Filters
    const filters = ref({
      questionTypeId: null,
      categoryId: null,
      minScore: null,
      maxScore: null,
      prompt: '',
      page: 0,
      size: 10, // This is the single source of truth for page size
      sort: 'id',
      direction: 'asc'
    });

    // Computed properties
    const selectedCount = computed(() => selectedQuestionsSet.value.size);
    const selectedQuestions = computed(() => Array.from(selectedQuestionsSet.value));

    // Methods
    const previousPage = () => {
      if (filters.value.page > 0) {
        filters.value.page--;
        loadQuestions();
      }
    };

    const nextPage = () => {
      if (filters.value.page < totalPages.value - 1) {
        filters.value.page++;
        loadQuestions();
      }
    };
    
    // Update currentPage ref when filters.page changes for backwards compatibility
    watch(() => filters.value.page, (newPage) => {
      currentPage.value = newPage;
    });

    const handleSearchInput = () => {
      clearTimeout(debounceTimer.value);
      debounceTimer.value = setTimeout(() => {
        filters.value.page = 0;
        loadQuestions();
      }, 500);
    };

    const applyFilters = () => {
      filters.value.page = 0;
      loadQuestions();
    };

    const resetFilters = async () => {
      // Reset all filter values
      filters.value = {
        questionTypeId: null,
        categoryId: null,
        minScore: null,
        maxScore: null,
        prompt: '',
        page: 0,
        size: 10,
        sort: 'id',
        direction: 'asc'
      };

      // Reset pagination
      currentPage.value = 0;
      searchQuery.value = '';

      // Wait for the next tick to ensure the refs are updated
      await nextTick();

      // Reset the SearchableSelect components
      if (categorySelect.value) {
        categorySelect.value.reset();
      }
      if (typeSelect.value) {
        typeSelect.value.reset();
      }

      // Reload questions with reset filters
      loadQuestions();
    };

    const toggleQuestion = (questionId) => {
      const newSet = new Set(selectedQuestionsSet.value);
      const question = availableQuestions.value.find(q => q.id === questionId);
      const isSelected = Array.from(newSet).some(q => q.id === questionId);

      if (isSelected) {
        // Find and remove the question by ID
        for (const q of newSet) {
          if (q.id === questionId) {
            newSet.delete(q);
            break;
          }
        }
      } else if (question) {
        newSet.add(question);
      }

      selectedQuestionsSet.value = newSet;

      // Update the isSelected property in availableQuestions
      const questionIndex = availableQuestions.value.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        availableQuestions.value[questionIndex].isSelected = !isSelected;
        // Create a new array to trigger reactivity
        availableQuestions.value = [...availableQuestions.value];
      }

      emit('questions-selected', Array.from(newSet));
    };

    const isQuestionSelected = (questionId) => {
      return Array.from(selectedQuestionsSet.value).some(q => q.id === questionId);
    };

    const isQuestionInAvailable = (questionId) => {
      return selectedQuestions.value.some(q => q.id === questionId);
    };

    // Load data functions
    const loadQuestionTypes = async () => {
      try {
        const response = await questionTypeApi.getAll({
          page: 0,
          size: 100,
          sort: 'name',
          direction: 'asc'
        });
        questionTypes.value = response.content.map(type => ({
          value: type.id,
          label: type.name
        }));
      } catch (error) {
        console.error('Failed to load question types:', error);
      }
    };

    const fetchCategories = async (isLoadMore = false) => {
      if (loadingCategories.value) return;

      loadingCategories.value = true;
      try {
        const response = await questionCategoryApi.getAll({
          page: currentPageCategories.value,
          size: itemsPerPageCategories,
          search: categorySearch.value,
          sort: 'name',
          direction: 'asc'
        });

        // Check if response and response.content exist before destructuring
        if (!response || !response.content) {
          throw new Error('Invalid response from server');
        }

        if (isLoadMore) {
          // Append new categories when loading more
          categories.value = [...categories.value, ...(response.content || [])];
        } else {
          // Replace categories when searching or first load
          categories.value = response.content || [];
        }

        // Check if there are more items to load
        hasMoreCategories.value = response.totalPages
          ? (currentPageCategories.value + 1) < response.totalPages
          : false;
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Reset to previous page if loading more fails
        if (isLoadMore && currentPageCategories.value > 0) {
          currentPageCategories.value--;
        }
      } finally {
        loadingCategories.value = false;
      }
    };

    const loadQuestions = async () => {
      try {
        isLoading.value = true;

        // Prepare filters
        const params = {
          questionTypeId: filters.value.questionTypeId,
          categoryId: filters.value.categoryId,
          minScore: filters.value.minScore,
          maxScore: filters.value.maxScore,
          prompt: filters.value.prompt || searchQuery.value,
          page: filters.value.page,
          size: filters.value.size,
          sort: filters.value.sort,
          direction: filters.value.direction
        };

        // Remove undefined or null values
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === undefined || params[key] === '') {
            delete params[key];
          }
        });

        const response = await questionApi.getAll(params);

        // Update available questions with current selection state
        availableQuestions.value = response.content.map(question => ({
          ...question,
          isSelected: selectedQuestionsSet.value.has(question.id)
        }));

        totalQuestions.value = response.totalElements;
        totalPages.value = response.totalPages;

        // Emit the current selection when loading new questions
        emit('questions-selected', Array.from(selectedQuestionsSet.value));
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Handle question type search
    const handleTypeSearch = async (query) => {
      typeSearch.value = query;
      loadingQuestionTypes.value = true;
      try {
        const response = await questionTypeApi.getAll({
          page: 0,
          size: 100,
          sort: 'name',
          direction: 'asc',
          search: query
        });
        questionTypes.value = response.content.map(type => ({
          value: type.id,
          label: type.name
        }));
      } catch (error) {
        console.error('Failed to search question types:', error);
      } finally {
        loadingQuestionTypes.value = false;
      }
    };

    // Cleanup function
    const cleanup = () => {
      // Clear any pending debounce timer
      if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
        debounceTimer.value = null;
      }
    };

    // Lifecycle hooks
    onMounted(async () => {
      await Promise.all([
        loadQuestions(),
        loadQuestionTypes(),
        fetchCategories(false)
      ]);

      // Handle window resize
      const handleResize = () => {
        isMobile.value = window.innerWidth < 1024;
      };

      window.addEventListener('resize', handleResize);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        cleanup();
      };
    });
    
    // Cleanup on unmount
    onUnmounted(() => {
      cleanup();
    });

    // Add these new reactive properties
    const loadingCategories = ref(false);
    const hasMoreCategories = ref(true);
    const categorySearch = ref('');
    const typeSearch = ref('');
    const currentPageCategories = ref(0);
    const itemsPerPageCategories = 10;

    // Computed properties for filtered lists
    const filteredCategories = computed(() => categories.value);

    const filteredQuestionTypes = computed(() => questionTypes.value);

    // Methods for category selection
    const handleCategorySearch = async (query) => {
      categorySearch.value = query;
      currentPageCategories.value = 0; // Reset to first page for new search
      await fetchCategories(false);
    };

    const handleLoadMoreCategories = async () => {
      if (!hasMoreCategories.value || loadingCategories.value) return;

      currentPageCategories.value++;
      await fetchCategories(true);
    };

    const selectCategory = (selected) => {
      if (selected) {
        filters.value.categoryId = selected.value;
        applyFilters();
      }
    };

    const selectType = (selected) => {
      if (selected) {
        filters.value.questionTypeId = selected.value;
        applyFilters();
      }
    };

    // Update search values when filters change externally
    watch(() => filters.value.categoryId, (newVal) => {
      if (!newVal) {
        categorySearch.value = '';
      } else {
        const category = categories.value.find(c => c.id === newVal);
        if (category) categorySearch.value = category.name;
      }
    });

    watch(() => filters.value.questionTypeId, (newVal) => {
      if (!newVal) {
        typeSearch.value = '';
      } else {
        const type = questionTypes.value.find(t => t.value === newVal);
        if (type) typeSearch.value = type.label;
      }
    });

    // Refs for SearchableSelect components
    const categorySelect = ref(null);
    const typeSelect = ref(null);

    // Sanitize HTML function
    const sanitizeHtml = (html) => {
      if (!html) return '';
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'blockquote', 'pre', 'code', 'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'data-id']
      });
    };

    // Expose to template
    return {
      // Refs
      questionContent,
      selectedQuestionsSet,
      availableQuestions,
      isLoading,
      searchQuery,
      currentPage,
      totalQuestions,
      totalPages,
      showAdvancedFilters,
      questionTypes,
      categories,
      filters,
      quillEditor,

      // Computed
      selectedCount,
      selectedQuestions,

      // Methods
      handleSearchInput,
      applyFilters,
      resetFilters,
      toggleQuestion,
      isQuestionSelected,
      isQuestionInAvailable,
      previousPage,
      nextPage,
      sanitizeHtml,

      // Constants
      editorOptions,
      isDark,
      isMobile,

      // New properties and methods
      categorySearch,
      typeSearch,
      loadingCategories,
      hasMoreCategories,
      filteredCategories,
      filteredQuestionTypes,
      selectCategory,
      selectType,
      handleCategorySearch,
      handleLoadMoreCategories,
      loadingQuestionTypes,
      handleTypeSearch,
      categorySelect,
      typeSelect,
    };
  },
};
</script>

<style scoped>
/* Hide number input spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

/* Quill Editor Styles */
:deep(.ql-container.ql-snow) {
  border: none;
  background-color: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  min-height: 400px;
}

:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid rgb(229 231 235);
  margin-bottom: 0;
  background-color: white;
  border-radius: 0;
}

.dark :deep(.ql-toolbar.ql-snow) {
  background-color: rgb(31 41 55);
  border-bottom-color: rgb(55 65 81);
}

:deep(.ql-editor) {
  flex: 1;
  background-color: white;
  color: rgb(17 24 39);
}

.dark :deep(.ql-editor) {
  background-color: rgb(31 41 55);
  color: rgb(229 231 235);
}

:deep(.ql-snow .ql-stroke) {
  stroke: rgb(75 85 99);
}

.dark :deep(.ql-snow .ql-stroke) {
  stroke: rgb(156 163 175);
}

:deep(.ql-snow .ql-fill),
:deep(.ql-snow .ql-stroke.ql-fill) {
  fill: rgb(75 85 99);
}

.dark :deep(.ql-snow .ql-fill),
.dark :deep(.ql-snow .ql-stroke.ql-fill) {
  fill: rgb(156 163 175);
}

:deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
  stroke: rgb(59 130 246);
}

.dark :deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
  stroke: rgb(96 165 250);
}

:deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
  stroke: rgb(37 99 235);
}

.dark :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
  stroke: rgb(59 130 246);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 0.375rem;
  height: 0.375rem;
}

::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-track {
  background-color: rgb(55 65 81);
}

::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgb(107 114 128);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .question-set :deep(.ql-container) {
    min-height: 300px;
  }
}
</style>
