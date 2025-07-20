<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-[100000]" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[80vh]">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Select Question Sets</h3>
        <button 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Search and Filter -->
      <div class="p-4 border-b dark:border-gray-700">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search question sets..."
            @input="handleSearch"
          >
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
        
        <div v-else-if="questionSets.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          No question sets found.
        </div>
        
        <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="questionSet in questionSets" :key="questionSet.id" class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="selectQuestionSet(questionSet)">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ questionSet.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  ID: {{ questionSet.id }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click.stop="selectQuestionSet(questionSet)"
                >
                  Select
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Pagination -->
      <div v-if="!isLoading && questionSets.length > 0" class="bg-gray-50 dark:bg-gray-800/80 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="pagination.page === 0"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 0 }"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page >= pagination.totalPages - 1"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= pagination.totalPages - 1 }"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing page <span class="font-medium">{{ pagination.page + 1 }}</span> of
              <span class="font-medium">{{ pagination.totalPages || 1 }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="previousPage"
                :disabled="pagination.page === 0"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 0 }"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages - 1"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= pagination.totalPages - 1 }"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { questionSetApi } from '@/api/admin/question-set/questionSet';
import { debounce } from 'lodash';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  selectedQuestionSets: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'select']);

const isLoading = ref(false);
const searchQuery = ref('');
const questionSets = ref([]);
const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0
});

// Fetch question sets
const fetchQuestionSets = async () => {
  try {
    isLoading.value = true;
    const { content, totalPages, totalElements, number } = await questionSetApi.getSimpleQuestionSets(
      pagination.value.page,
      pagination.value.size,
      'title',
      'asc',
      searchQuery.value || undefined
    );
    
    questionSets.value = content;
    pagination.value = {
      ...pagination.value,
      totalPages,
      totalElements,
      page: number
    };
  } catch (error) {
    console.error('Failed to fetch question sets:', error);
  } finally {
    isLoading.value = false;
  }
};

// Handle search with debounce
const handleSearch = debounce(() => {
  pagination.value.page = 0; // Reset to first page when searching
  fetchQuestionSets();
}, 300);

// Pagination methods
const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages - 1) {
    pagination.value.page++;
    fetchQuestionSets();
  }
};

const previousPage = () => {
  if (pagination.value.page > 0) {
    pagination.value.page--;
    fetchQuestionSets();
  }
};

// Handle question set selection
const selectQuestionSet = (questionSet) => {
  emit('select', questionSet);
  emit('close');
};

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    fetchQuestionSets();
  }
});

// Initial fetch
onMounted(() => {
  if (props.isOpen) {
    fetchQuestionSets();
  }
});
</script>

<style scoped>
/* Custom scrollbar styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 5px;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background-color: #374151;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 5px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

/* For Firefox */
.custom-scrollbar {
  scrollbar-width: 10px;
  scrollbar-color: rgba(209, 213, 219, 0.5) rgba(243, 244, 246, 0.5);
}

.dark .custom-scrollbar {
  scrollbar-color: rgba(75, 85, 99, 0.5) rgba(55, 65, 81, 0.5);
}
</style>
