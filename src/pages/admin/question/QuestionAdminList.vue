<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Questions Management</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all questions in the system</p>
      </div>
      <button
        @click="addNewQuestion"
        class="inline-flex items-center px-3 py-1.5 text-xs font-normal rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-colors duration-150"
      >
        <svg class="mr-1.5 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Question
      </button>
    </div>

    <DataTable 
      :columns="columns" 
      :data="questions" 
      :showPagination="true"
      :currentPage="currentPage"
      :perPage="itemsPerPage"
      @page-change="handlePageChange"
      :actions="actions"
      :primaryColumn="'question'"
      @sort="handleSort"
      :searchable="true"
      :searchPlaceholder="'Search questions...'"
      :loading="loading"
      @search="handleSearch"
      :loadingText="'Loading questions...'"
      :emptyStateText="'No questions found'"
      class="mt-6"
      :mobile-card-class="'bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700'"
      :mobile-card-title-class="'font-medium text-gray-900 dark:text-white text-base'"
      :mobile-card-meta-class="'flex flex-col gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300'"
    >
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/DataTable.vue';
import { questionApi } from '@/api/admin/question/questionApi';

// Icons for actions as strings
const editIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
`;

const deleteIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
`;

const router = useRouter();

// Table columns configuration
const columns = [
  { 
    key: 'id', 
    label: 'ID', 
    sortable: true, 
    width: '80px',
    hideOnMobile: true
  },
  { 
    key: 'question', 
    label: 'Question', 
    sortable: true, 
    width: '100%',
    hideOnMobile: false,
    render: (value) => `<span class="font-medium text-gray-900 dark:text-white">${value}</span>`
  },
  { 
    key: 'category', 
    label: 'Category', 
    sortable: true, 
    width: '20%',
    hideOnMobile: true
  },
  { 
    key: 'difficulty', 
    label: 'Difficulty', 
    sortable: true, 
    width: '15%',
    hideOnMobile: true,
    render: (value) => {
      const colors = {
        'Easy': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'Hard': 'bg-red-100 text-red-800'
      };
      return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}">${value}</span>`;
    }
  },
  { 
    key: 'type', 
    label: 'Type', 
    sortable: true, 
    width: '15%',
    hideOnMobile: true
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true, 
    width: '15%',
    hideOnMobile: false,
    render: (value) => {
      const isActive = value === 'Active';
      return `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }">
          <span class="h-2 w-2 rounded-full mr-1.5 ${
            isActive ? 'bg-green-500' : 'bg-gray-400'
          }"></span>
          ${value}
        </span>
      `;
    }
  },
  { 
    key: 'createdAt', 
    label: 'Created At', 
    sortable: true, 
    width: '15%',
    hideOnMobile: true,
    render: (value) => new Date(value).toLocaleDateString()
  }
];

// Questions data
const questions = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const sortBy = ref('id');
const sortDirection = ref('asc');
const searchQuery = ref('');

// Fetch all questions from API
const fetchQuestions = async () => {
  try {
    loading.value = true;
    // Fetch all questions (empty search to get all)
    const response = await questionApi.getAll({
      page: 0,
      size: 1000, // Large number to get all questions
      sort: sortBy.value,
      direction: sortDirection.value,
      search: searchQuery.value || undefined
    });
    
    questions.value = response.content;
    totalItems.value = response.totalElements;

    console.log(response);
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    // You might want to show an error notification here
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
};

// Handle sorting
const handleSort = ({ sortBy: newSortBy, sortDirection: newSortDirection }) => {
  sortBy.value = newSortBy;
  sortDirection.value = newSortDirection;
  currentPage.value = 1; // Reset to first page when sorting changes
  fetchQuestions(); // Re-fetch to get sorted data
};

// Handle search
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1; // Reset to first page when search changes
  fetchQuestions(); // Re-fetch to get filtered data
};

// Table actions with inline SVG
const actions = [
  {
    label: 'Edit',
    icon: editIcon,
    handler: (item) => {
      editQuestion(item);
    },
    class: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
  },
  {
    label: 'Delete',
    icon: deleteIcon,
    handler: (item) => {
        deleteQuestion(item);
    },
    class: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
  }
];

// Event handler for actions
function handleAction({ action, item }) {
  action.handler(item);
}

function editQuestion(question) {
  console.log('Editing question:', question);
  // Navigate to edit page or open edit modal
  // router.push(`/admin/questions/edit/${question.id}`);
}

function deleteQuestion(question) {
  if (confirm(`Are you sure you want to delete the question: ${question.question}?`)) {
    // Here you would typically make an API call to delete the question
    const index = questions.value.findIndex(q => q.id === question.id);
    if (index !== -1) {
      questions.value.splice(index, 1);
    }
  }
}

function addNewQuestion() {
  console.log('Adding new question');
  // Navigate to add new question page or open add modal
  // router.push('/admin/questions/new');
}
</script>