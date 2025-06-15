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
      :data="filteredQuestions" 
      :actions="actions"
      primary-column="question"
      @sort="handleSort"
      @page-change="handlePageChange"
      :per-page="10"
      :current-page="currentPage"
      :total-items="filteredQuestions.length"
      :show-pagination="true"
      :show-search="true"
      search-placeholder="Search questions..."
      :loading="loading"
      loading-text="Loading questions..."
      empty-text="No questions found"
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

// Sample data - replace with your actual data fetching logic
const questions = ref([
  {
    id: 1,
    question: 'What is the capital of France?',
    category: 'Geography',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-15',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    category: 'Math',
    difficulty: 'Easy',
    type: 'True/False',
    status: 'Active',
    createdAt: '2023-05-16',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4'
  },
  {
    id: 3,
    question: 'Which planet is known as the Red Planet?',
    category: 'Science',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    status: 'Draft',
    createdAt: '2023-05-17',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    id: 4,
    question: 'What is the largest mammal?',
    category: 'Biology',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-18',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 'Blue Whale'
  },
  {
    id: 5,
    question: 'Who painted the Mona Lisa?',
    category: 'Art',
    difficulty: 'Hard',
    type: 'Short Answer',
    status: 'Inactive',
    createdAt: '2023-05-19',
    correctAnswer: 'Leonardo da Vinci'
  },
  {
    id: 6,
    question: 'What is the chemical symbol for gold?',
    category: 'Chemistry',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-20',
    options: ['Au', 'Ag', 'Fe', 'Pb'],
    correctAnswer: 'Au'
  },
  {
    id: 7,
    question: 'Which country is home to the Great Barrier Reef?',
    category: 'Geography',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-21',
    options: ['Brazil', 'Australia', 'Thailand', 'Mexico'],
    correctAnswer: 'Australia'
  },
  {
    id: 8,
    question: 'What is the largest ocean on Earth?',
    category: 'Geography',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-22',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 'Pacific'
  },
  {
    id: 9,
    question: 'Who wrote "Romeo and Juliet"?',
    category: 'Literature',
    difficulty: 'Medium',
    type: 'Short Answer',
    status: 'Active',
    createdAt: '2023-05-23',
    correctAnswer: 'William Shakespeare'
  },
  {
    id: 10,
    question: 'What is the square root of 144?',
    category: 'Math',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-24',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12'
  },
  {
    id: 11,
    question: 'Which element has the atomic number 1?',
    category: 'Chemistry',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-25',
    options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'],
    correctAnswer: 'Hydrogen'
  },
  {
    id: 12,
    question: 'What is the capital of Japan?',
    category: 'Geography',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-26',
    options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
    correctAnswer: 'Tokyo'
  },
  {
    id: 13,
    question: 'Who developed the theory of relativity?',
    category: 'Physics',
    difficulty: 'Hard',
    type: 'Short Answer',
    status: 'Active',
    createdAt: '2023-05-27',
    correctAnswer: 'Albert Einstein'
  },
  {
    id: 14,
    question: 'What is the largest planet in our solar system?',
    category: 'Astronomy',
    difficulty: 'Easy',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-28',
    options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
    correctAnswer: 'Jupiter'
  },
  {
    id: 15,
    question: 'What is the main component of the Sun?',
    category: 'Astronomy',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    status: 'Active',
    createdAt: '2023-05-29',
    options: ['Liquid Lava', 'Hydrogen and Helium', 'Oxygen and Nitrogen', 'Carbon Dioxide'],
    correctAnswer: 'Hydrogen and Helium'
  }
]);

const currentPage = ref(1);
const loading = ref(false);

// Use questions directly since search is now handled by DataTable
const filteredQuestions = computed(() => questions.value);

// Table actions
const actions = [
  {
    label: 'Edit',
    icon: 'EditIcon',
    handler: (item) => {
      // Handle edit action
      console.log('Edit:', item);
    },
    class: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
  },
  {
    label: 'Delete',
    icon: 'DeleteIcon',
    handler: (item) => {
      // Handle delete action
      if (confirm(`Are you sure you want to delete "${item.question}"?`)) {
        console.log('Delete confirmed:', item);
      }
    },
    class: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
  }
];

// Event handlers
function handlePageChange(page) {
  currentPage.value = page;
  // Here you would typically fetch data for the new page
  // For now, we're just updating the currentPage
}

function handleSort({ sortBy, sortDirection }) {
  // Simple client-side sorting
  questions.value.sort((a, b) => {
    let modifier = sortDirection === 'asc' ? 1 : -1;
    if (a[sortBy] < b[sortBy]) return -1 * modifier;
    if (a[sortBy] > b[sortBy]) return 1 * modifier;
    return 0;
  });
}

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