<template>
  <div class="w-full h-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
    <div class="flex flex-col lg:flex-row h-full w-full divide-x divide-gray-200 dark:divide-gray-700">
      <!-- Left column for editor -->
      <div class="w-full lg:w-1/2 p-4 flex flex-col overflow-hidden">
        <div class="mb-4 flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Question Set Content
          </h2>
        </div>
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <QuillEditor 
            ref="quillEditor" 
            v-model:content="questionContent" 
            :options="editorOptions" 
            contentType="html" 
            class="flex-1 bg-white dark:bg-gray-800 overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700" 
          />
        </div>
      </div>

      <!-- Right Column - Question Selection List -->
      <div class="w-full lg:w-1/2 bg-gray-50 dark:bg-gray-800 p-6 flex flex-col h-full overflow-hidden">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Questions</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedQuestionIds.size }} selected
          </span>
        </div>

        <!-- Search and Filter Section -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-4">
            <!-- Header with Title and Reset -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filter Questions</h3>
              <button 
                @click="resetFilters"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>
            
            <!-- Search Bar -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                v-model="searchQuery"
                @input="handleSearchInput"
                type="text" 
                class="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150" 
                placeholder="Search questions by prompt, content, or tags..."
              >
            </div>

            <!-- Main Filters Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Category Filter -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <div class="relative">
                  <select 
                    v-model="filters.category"
                    @change="applyFilters"
                    class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-150"
                  >
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Question Type Filter -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type</label>
                <div class="relative">
                  <select 
                    v-model="filters.type"
                    @change="applyFilters"
                    class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-150"
                  >
                    <option value="">All Types</option>
                    <option v-for="type in questionTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Difficulty Filter -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
                <div class="relative">
                  <select 
                    v-model="filters.difficulty"
                    @change="applyFilters"
                    class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-150"
                  >
                    <option value="">All Difficulty</option>
                    <option value="EASY" class="text-green-600 dark:text-green-400">Easy</option>
                    <option value="MEDIUM" class="text-yellow-600 dark:text-yellow-400">Medium</option>
                    <option value="HARD" class="text-red-600 dark:text-red-400">Hard</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Score Range -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Score Range</label>
                <div class="flex items-center space-x-2">
                  <div class="relative flex-1">
                    <input
                      v-model.number="filters.minScore"
                      type="number"
                      min="0"
                      placeholder="Min score"
                      class="block w-full pl-3 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-150"
                      @change="applyFilters"
                    >
                  </div>
                  <span class="text-gray-500 text-sm">-</span>
                  <div class="relative flex-1">
                    <input
                      v-model.number="filters.maxScore"
                      type="number"
                      min="0"
                      placeholder="Max score"
                      class="block w-full pl-3 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-150"
                      @change="applyFilters"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle Filters -->
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <input
                    id="hasAudioFilter"
                    v-model="filters.hasAudio"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    @change="applyFilters"
                  >
                  <label for="hasAudioFilter" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    With Audio
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="hasImagesFilter"
                    v-model="filters.hasImages"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    @change="applyFilters"
                  >
                  <label for="hasImagesFilter" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    With Images
                  </label>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ totalQuestions }} questions found
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
          <!-- Pagination Controls -->
          <div 
            v-if="!isLoading && availableQuestions.length > 0" 
            class="flex items-center justify-between mb-4"
          >
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Showing 
              <span class="font-medium">
                {{ (currentPage * pageSize) + 1 }}
              </span> to 
              <span class="font-medium">
                {{ Math.min((currentPage + 1) * pageSize, totalQuestions) }}
              </span> of 
              <span class="font-medium">
                {{ totalQuestions }}
              </span> questions
            </div>
            <div class="flex space-x-2">
              <button
                type="button"
                @click="previousPage"
                :disabled="currentPage === 0"
                class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500': currentPage === 0,
                  'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': currentPage !== 0
                }"
              >
                Previous
              </button>
              <button
                type="button"
                @click="nextPage"
                :disabled="(currentPage + 1) * pageSize >= totalQuestions"
                class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{
                  'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500': (currentPage + 1) * pageSize >= totalQuestions,
                  'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700': (currentPage + 1) * pageSize < totalQuestions
                }"
              >
                Next
              </button>
            </div>
          </div>
          <!-- Loading State -->
          <div 
            v-if="isLoading" 
            class="flex justify-center items-center h-32"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          
          <!-- Empty State -->
          <div 
            v-else-if="availableQuestions.length === 0" 
            class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            No questions found matching your criteria
          </div>
          
          <!-- Question List -->
          <transition-group 
            v-else
            name="question-list"
            tag="div"
            class="space-y-3"
          >
            <div 
              v-for="(question, index) in availableQuestions" 
              :key="question.id"
              class="flex items-start p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-150 cursor-pointer"
              :class="{ 
                'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30': isQuestionSelected(question.id) 
              }"
              @click.self="toggleQuestion(question.id)"
            >
              <!-- Question Number and Checkbox -->
              <div class="flex flex-col items-center mr-3 w-6">
                <span class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {{ index + 1 }}
                </span>
                <input 
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                  :checked="isQuestionSelected(question.id)" 
                  @click.stop
                  @change="toggleQuestion(question.id)"
                />
              </div>
              
              <!-- Question Content -->
              <div class="flex-1 min-w-0">
                <div 
                  class="text-sm font-medium text-gray-800 dark:text-gray-200" 
                  v-html="question.text"
                ></div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Quill } from '@vueup/vue-quill';
import ImageResize from 'quill-image-resize-vue';
import { questionApi } from '@/api/admin/question/questionApi';

// Register the image resize module with Quill
Quill.register('modules/imageResize', ImageResize.default || ImageResize);

export default {
  name: 'QuestionSet',
  
  components: {
    QuillEditor,
  },
  
  provide() {
    return {
      isDark: this.isDark,
    };
  },
  
  data() {
    return {
      isMobile: window.innerWidth < 1024,
      isDark: document.documentElement.classList.contains('dark'),
      questionContent: '',
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
          imageResize: {
            displaySize: true,
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: function imageHandler() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                
                input.onchange = async () => {
                  const file = input.files[0];
                  if (!file) return;
                  
                  const quill = this.$refs.quillEditor.getQuill();
                  const range = quill.getSelection(true);
                  const reader = new FileReader();
                  
                  reader.onload = (e) => {
                    quill.insertEmbed(range.index, 'image', e.target.result, 'user');
                    quill.setSelection(range.index + 1);
                  };
                  
                  reader.readAsDataURL(file);
                };
                
                input.click();
              }.bind(this),
            },
          },
        },
        placeholder: 'Type your content here...',
        theme: 'snow',
      },
      selectedQuestionIds: new Set(),
      availableQuestions: [],
      isLoading: false,
      searchQuery: '',
      currentPage: 0,
      pageSize: 10,
      totalQuestions: 0,
      debounceTimer: null,
      showAdvancedFilters: false,
      questionTypes: [
        { id: 'SINGLE_CHOICE', name: 'Single Choice' },
        { id: 'MULTIPLE_CHOICE', name: 'Multiple Choice' },
        { id: 'ESSAY', name: 'Essay' },
        { id: 'TRUE_FALSE', name: 'True/False' },
        { id: 'FILL_IN_BLANK', name: 'Fill in Blank' },
        { id: 'MATCHING', name: 'Matching' },
        { id: 'SHORT_ANSWER', name: 'Short Answer' },
        { id: 'CODE', name: 'Code' },
      ],
      categories: [], // Will be populated from API
      filters: {
        type: '',
        category: '',
        minScore: null,
        maxScore: null,
        hasAudio: false,
        hasImages: false,
        difficulty: '',
      },
      questions: [],
    };
  },
  
  watch: {
    isDark: {
      immediate: true,
      handler(isDark) {
        const quill = this.$refs.quillEditor?.getQuill();
        if (quill) {
          quill.theme.quill.container.classList.toggle('dark', isDark);
        }
      },
    },
  },
  
  async mounted() {
    await Promise.all([
      this.loadQuestions(),
      this.fetchQuestionTypes(),
      this.fetchCategories()
    ]);
    window.addEventListener('resize', this.handleResize);
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  
  methods: {
    async fetchQuestionTypes() {
      try {
        // Replace with your actual API call to fetch question types
        // const response = await questionApi.getQuestionTypes();
        // this.questionTypes = response.data;
      } catch (error) {
        console.error('Error fetching question types:', error);
      }
    },
    
    async fetchCategories() {
      try {
        // Replace with your actual API call to fetch categories
        // const response = await questionApi.getCategories();
        // this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    
    async loadQuestions() {
      try {
        this.isLoading = true;
        
        // Prepare query parameters
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          sort: 'id',
          direction: 'asc',
          search: this.searchQuery || undefined,
          questionTypeId: this.filters.type || undefined,
          categoryId: this.filters.category || undefined,
          minScore: this.filters.minScore || undefined,
          maxScore: this.filters.maxScore || undefined,
          hasAudio: this.filters.hasAudio || undefined,
          hasImages: this.filters.hasImages || undefined,
          difficulty: this.filters.difficulty || undefined,
        };
        
        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        
        const response = await questionApi.getAll(params);

        this.availableQuestions = response.data.content.map((q) => ({
          id: q.id,
          text: q.prompt || q.content,
          type: q.questionType?.name || 'Unknown',
          category: q.questionCategory?.name || 'Uncategorized',
          score: q.score,
          hasAudio: q.questionAudios?.length > 0,
          hasImages: q.prompt?.includes('<img') || false,
          ...q,
        }));
        
        this.totalQuestions = response.data.totalElements || response.data.content.length;
      } catch (error) {
        console.error('Error loading questions:', error);
        this.availableQuestions = [];
        this.totalQuestions = 0;
      } finally {
        this.isLoading = false;
      }
    },
    
    handleSearchInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.currentPage = 0;
        this.loadQuestions();
      }, 500);
    },
    
    applyFilters() {
      this.currentPage = 0;
      this.loadQuestions();
    },
    
    nextPage() {
      if ((this.currentPage + 1) * this.pageSize < this.totalQuestions) {
        this.currentPage += 1;
        this.loadQuestions();
      }
    },
    
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
        this.loadQuestions();
      }
    },
    
    isQuestionSelected(questionId) {
      return this.selectedQuestionIds.has(questionId);
    },
    
    toggleQuestion(questionId) {
      if (this.selectedQuestionIds.has(questionId)) {
        this.selectedQuestionIds.delete(questionId);
      } else {
        this.selectedQuestionIds.add(questionId);
      }
      
      const selectedIds = Array.from(this.selectedQuestionIds);
      this.$emit('questions-selected', selectedIds);
    },
    
    getSelectedQuestions() {
      return this.availableQuestions.filter((q) => 
        this.selectedQuestionIds.has(q.id),
      );
    },
    
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    },
  },
};
</script>

<style scoped>
/* Quill Editor Styles */
:deep(.ql-container.ql-snow) {
  border: none;
  background-color: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0;
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
