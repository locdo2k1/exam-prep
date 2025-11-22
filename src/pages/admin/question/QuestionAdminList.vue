<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Questions Management</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all questions in the system</p>
      </div>
      <button @click="addNewQuestion"
        class="inline-flex items-center px-3 py-1.5 text-xs font-normal rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-colors duration-150">
        <svg class="mr-1.5 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Add Question
      </button>
    </div>

    <DataTable :columns="columns" :data="questions" :showPagination="true" :currentPage="currentPage"
      :itemsPerPage="itemsPerPage" :totalItems="totalItems" @page-change="handlePageChange" :actions="actions"
      :primaryColumn="'prompt'" @sort="handleSort" :searchable="true" :searchPlaceholder="'Search questions...'"
      :loading="loading" @search="handleSearch" :loadingText="'Loading questions...'"
      :emptyStateText="'No questions found'" class="mt-6"
      :mobile-card-class="'bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700'"
      :mobile-card-title-class="'font-medium text-gray-900 dark:text-white text-base'"
      :mobile-card-meta-class="'flex flex-col gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300'"
      :serverSidePagination="true">
      <template #cell-status="{ value }">
        <span :class="{
          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
          'bg-green-100 text-green-800': value === 'Active',
          'bg-yellow-100 text-yellow-800': value === 'Draft',
          'bg-red-100 text-red-800': value === 'Inactive'
        }">
          {{ value }}
        </span>
      </template>
    </DataTable>
  </div>

  <!-- Question Preview Popup -->
  <div v-if="isPopupVisible && selectedQuestion"
    class="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4" style="top: 70px;">
    <div class="relative w-full max-w-xl shadow-lg rounded-md bg-white dark:bg-gray-800 flex flex-col max-h-full">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-4 border-b rounded-t dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Question Details</h3>
        <button @click="closePopup"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <!-- Modal body with custom scrollbar -->
      <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <!-- Question Prompt -->
        <div class="grid grid-cols-4 gap-4 items-start">
          <div class="col-span-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1 1.5 1.5 2.5">
              </path>
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
            </svg>
            <span class="font-semibold text-gray-800 dark:text-gray-200">Question Prompt</span>
          </div>
          <div class="col-span-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg"
            v-html="selectedQuestion.prompt || '—'"></div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div class="grid grid-cols-2 items-center">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.23A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z">
                </path>
              </svg>
              <span class="font-semibold text-gray-800 dark:text-gray-200">Category</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ selectedQuestion.questionCategory?.name || '—' }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 items-center">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <path d="M12 11h4"></path>
                <path d="M12 16h4"></path>
                <path d="M8 11h.01"></path>
                <path d="M8 16h.01"></path>
              </svg>
              <span class="font-semibold text-gray-800 dark:text-gray-200">Type</span>
            </div>
            <div class="flex items-center">
              <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ selectedQuestion.questionType?.name || '—' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 items-center">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="6"></circle>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
              </svg>
              <span class="font-semibold text-gray-800 dark:text-gray-200">Score</span>
            </div>
            <div class="flex items-center">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {{ selectedQuestion.score || '0' }} points
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 items-center">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
              <span class="font-semibold text-gray-800 dark:text-gray-200">Audio</span>
            </div>
            <div class="flex items-center">
              <span :class="{
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-800': selectedQuestion.questionAudios?.length,
                'bg-gray-100 text-gray-800': !selectedQuestion.questionAudios?.length
              }">
                <svg :class="{
                  '-ml-0.5 mr-1.5 h-2 w-2': true,
                  'text-green-400': selectedQuestion.questionAudios?.length,
                  'text-gray-400': !selectedQuestion.questionAudios?.length
                }" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {{ selectedQuestion.questionAudios?.length ? 'Available' : 'Not Available' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="grid grid-cols-4 gap-4 items-start">
          <div class="col-span-1 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m3 17 2 2 4-4"></path>
              <path d="m3 7 2 2 4-4"></path>
              <path d="M13 6h8"></path>
              <path d="M13 12h8"></path>
              <path d="M13 18h8"></path>
            </svg>
            <span class="font-semibold text-gray-800 dark:text-gray-200">Options</span>
          </div>
          <div class="col-span-3">
            <div v-if="selectedQuestion.options?.length" class="space-y-2">
              <div v-for="(option, index) in selectedQuestion.options" :key="index"
                class="flex items-start p-2 rounded-lg transition-colors duration-200" :class="{
                  'bg-green-50 dark:bg-green-900/20': option.correct,
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50': !option.correct
                }">
                <div class="flex-shrink-0 mt-0.5">
                  <div class="flex items-center justify-center w-5 h-5 rounded-full border-2" :class="{
                    'border-green-500 bg-green-500': option.correct,
                    'border-gray-300 dark:border-gray-500': !option.correct
                  }">
                    <svg v-if="option.correct" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium" :class="{
                    'text-gray-900 dark:text-white': option.correct,
                    'text-gray-700 dark:text-gray-300': !option.correct
                  }">
                    {{ option.text }}
                  </p>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 dark:text-gray-400 italic">No options available</p>
          </div>
        </div>

        <!-- Correct Answers -->
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-1 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span class="font-semibold text-gray-800 dark:text-gray-200">Correct Answers</span>
          </div>
          <div class="col-span-3">
            <div v-if="selectedQuestion.questionAnswers?.length" class="flex flex-wrap gap-2">
              <span v-for="(answer, index) in selectedQuestion.questionAnswers" :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                <svg class="mr-1.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ answer }}
              </span>
            </div>
            <div v-else class="flex items-center text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No correct answers specified
            </div>
          </div>
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b sticky bottom-0 space-x-3">
        <button @click="closePopup"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          Close
        </button>
        <button @click="editQuestion(selectedQuestion)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
          Edit Question
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="cancelDelete"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
        <div class="p-6">
          <div class="flex items-start">
            <div
              class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ deleteError ? 'Cannot Delete Question' : 'Delete Question' }}
              </h3>
              <div class="mt-2 text-sm">
                <div v-if="deleteError" class="text-red-600 dark:text-red-400">
                  <p>{{ deleteError }}</p>
                </div>
                <div v-else>
                  <p class="text-gray-500 dark:text-gray-400">Are you sure you want to delete this question?</p>
                  <p v-if="questionToDelete" class="mt-1 font-medium text-gray-700 dark:text-gray-300 truncate"
                    v-html="(questionToDelete.prompt?.length > 50 ? questionToDelete.prompt?.substring(0, 50) + '...' : questionToDelete.prompt) || ''">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end space-x-3">
          <button type="button" @click="cancelDelete" :disabled="deleting"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {{ deleteError ? 'Close' : 'Cancel' }}
          </button>
          <button v-if="!deleteError" type="button" @click="confirmDelete" :disabled="deleting"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePopup } from '@/composables/usePopup';
import { useRouter } from 'vue-router';
import DataTable from '@/components/DataTable.vue';
import { questionApi } from '@/api/admin/question/questionApi';

const { isPopupVisible, showPopup, hidePopup } = usePopup();

// Icons for actions as strings
const previewIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
`;

const editIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
`;

const deleteIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
`;

const router = useRouter();

// Popup state

const selectedQuestion = ref(null);

// Table columns configuration
const columns = [
  {
    key: 'prompt',
    label: 'Question',
    sortable: true,
    hideOnMobile: false,
    render: (value) => `<span class="font-medium text-gray-900 dark:text-white">${value || '—'}</span>`
  },
  {
    key: 'questionCategory',
    label: 'Category',
    sortable: true,
    sortKey: 'category',
    hideOnMobile: true,
    render: (category) => category?.name || '—'
  },
  {
    key: 'questionType',
    label: 'Type',
    sortable: true,
    hideOnMobile: true,
    render: (type) => type?.name || '—'
  },
  {
    key: 'score',
    label: 'Score',
    sortable: true,
    hideOnMobile: true,
    render: (value) => value || '0'
  },
  {
    key: 'questionAnswers',
    label: 'Answers',
    sortable: false,
    hideOnMobile: true,
    render: (answers) => answers?.length ? answers.join(', ') : '—'
  },
  {
    key: 'options',
    label: 'Options',
    sortable: false,
    hideOnMobile: true,
    render: (options) => {
      if (!options?.length) return '—';
      const listItems = options.map(opt => `<li>${opt.text || ''}</li>`).join('');
      return `<ul class="list-disc list-inside">${listItems}</ul>`;
    }
  },
  {
    key: 'questionAudios',
    label: 'Audio',
    sortable: false,
    hideOnMobile: true,
    render: (audios) => audios?.length ? 'Available' : '—'
  }
];

// Questions data
const questions = ref([]);
const showDeleteModal = ref(false);
const deleting = ref(false);
const questionToDelete = ref(null);
const deleteError = ref('');
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const sortBy = ref('insertedAt');
const sortDirection = ref('desc');
const searchQuery = ref('');

/**
 * Fetch questions with pagination and filtering
 */
const fetchQuestions = async () => {
  try {
    loading.value = true;

    // Prepare filter parameters
    const filter = {
      page: currentPage.value - 1, // Convert to 0-based for the API
      size: itemsPerPage.value,
      sort: sortBy.value,
      direction: sortDirection.value,
      prompt: searchQuery.value ? searchQuery.value.trim() : undefined
    };

    // Remove undefined values
    const cleanFilter = {};
    Object.keys(filter).forEach(key => {
      if (filter[key] !== undefined) {
        cleanFilter[key] = filter[key];
      }
    });

    // Make the API call
    const response = await questionApi.getAll(cleanFilter);

    if (!response.success) {
      // Optionally show a warning to the user
      return;
    }

    if (response.data) {
      questions.value = response.data.content;
      totalItems.value = response.data.totalElements;
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    // You might want to show an error notification to the user here
    // For example: showErrorNotification('Failed to load questions. Please try again.');
  } finally {
    loading.value = false;
  }
};

// Computed property for paginated data
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return questions.value.slice(start, end);
});

// Initialize component
onMounted(() => {
  fetchQuestions();
});

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchQuestions();
};

// Handle sorting
const handleSort = (sortEvent) => {
  // Handle both object (from DataTable) and string (direct call) parameters
  if (typeof sortEvent === 'object' && sortEvent !== null) {
    sortBy.value = sortEvent.sortBy;
    sortDirection.value = sortEvent.sortDirection;
  } else {
    // Fallback for direct string parameter (for backward compatibility)
    const key = sortEvent;
    if (sortBy.value === key) {
      // Toggle sort direction if same column is clicked
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      sortBy.value = key;
      sortDirection.value = 'asc';
    }
  }
  fetchQuestions();
};

// Handle search with debounce for better performance
let searchTimeout = null;
const handleSearch = (query) => {
  searchQuery.value = query;

  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Set a new timeout to fetch after user stops typing
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    fetchQuestions();
  }, 300);
};

// Client-side search function (alternative to server-side search)
// Uncomment and use this if you want to implement client-side search
/*
const filterQuestions = () => {
  if (!searchQuery.value) {
    fetchQuestions();
    return;
  }
  
  loading.value = true;
  
  // Filter questions based on search query
  const filtered = questions.value.filter(question => {
    // Search in prompt
    if (question.prompt?.toLowerCase().includes(searchQuery.value)) return true;
    
    // Search in category name
    if (question.questionCategory?.name?.toLowerCase().includes(searchQuery.value)) return true;
    
    // Search in question type
    if (question.questionType?.name?.toLowerCase().includes(searchQuery.value)) return true;
    
    // Search in answers
    if (question.questionAnswers?.some(answer => 
      answer.toLowerCase().includes(searchQuery.value)
    )) return true;
    
    // Search in options
    if (question.options?.some(option => 
      option.text?.toLowerCase().includes(searchQuery.value)
    )) return true;
    
    return false;
  });
  
  questions.value = filtered;
  loading.value = false;
};
*/

// Table actions with inline SVG
const actions = [
  {
    label: 'Preview',
    icon: previewIcon,
    handler: (item) => previewQuestion(item),
    class: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/30'
  },
  {
    label: 'Edit',
    icon: editIcon,
    handler: (item) => editQuestion(item),
    class: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
  },
  {
    label: 'Delete',
    icon: deleteIcon,
    handler: (item) => deleteQuestion(item),
    class: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
  }
];

function previewQuestion(question) {
  selectedQuestion.value = question;
  showPopup();
}

function closePopup() {
  hidePopup();
  selectedQuestion.value = null;
}

function editQuestion(question) {
  router.push(`/admin/question-management/edit/${question.id}`);
}

// Delete question function
function deleteQuestion(question) {
  questionToDelete.value = question;
  deleteError.value = ''; // Reset error message when opening the modal
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!questionToDelete.value) return;

  try {
    deleting.value = true;
    // Call the API to delete the question
    await questionApi.delete(questionToDelete.value.id);

    // Remove the question from the local state
    const index = questions.value.findIndex(q => q.id === questionToDelete.value.id);
    if (index !== -1) {
      questions.value.splice(index, 1);
    }

    showDeleteModal.value = false;
    // You might want to show a success message here
    console.log('Question deleted successfully');
  } catch (error) {
    console.error('Error deleting question:', error);
    // Set user-friendly error message based on the error type
    const errorMessage = error?.response?.data?.message || '';
    if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('being used')) {
      deleteError.value = 'This question is currently being used in one or more question sets and cannot be deleted.\n\nPlease remove it from all question sets before attempting to delete it.';
    } else if (error?.response?.status === 403) {
      deleteError.value = 'You do not have permission to delete this question.\n\nPlease contact an administrator if you believe this is an error.';
    } else if (error?.response?.status === 404) {
      deleteError.value = 'The question could not be found. It may have already been deleted.';
    } else if (!navigator.onLine) {
      deleteError.value = 'No internet connection.\n\nPlease check your network and try again.';
    } else {
      deleteError.value = 'An unexpected error occurred while trying to delete the question.\n\nPlease try again later or contact support if the problem persists.';
    }
  } finally {
    deleting.value = false;
    questionToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  questionToDelete.value = null;
  deleteError.value = ''; // Clear error when closing
}

function addNewQuestion() {
  router.push('/admin/question-management/create');
}
</script>

<style scoped>
/* Custom scrollbar for WebKit browsers (Chrome, Safari, etc.) */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
  margin: 0.5rem;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background-color: #374151;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.3s ease;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #6b7280;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background-color: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:active {
  background-color: #d1d5db;
}

/* Custom scrollbar for Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #e5e7eb;
  scroll-behavior: smooth;
}

.dark .custom-scrollbar {
  scrollbar-color: #6b7280 #374151;
}
</style>