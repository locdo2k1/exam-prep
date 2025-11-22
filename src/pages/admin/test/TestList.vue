<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
      <div class="space-y-2">
        <h1
          class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          style="line-height: 1.5;">
          Test Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage and organize your test collection</p>
      </div>
      <router-link to="/admin/tests/create"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create New Test
      </router-link>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600 dark:text-blue-300">Total Tests</p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{{ totalElements }}</p>
          </div>
          <div class="text-4xl opacity-20">📝</div>
        </div>
      </div>
      <div
        class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 border border-green-200 dark:border-green-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600 dark:text-green-300">Current Page</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{{ currentPage }} / {{
              Math.ceil(totalElements / pageSize) }}</p>
          </div>
          <div class="text-4xl opacity-20">📄</div>
        </div>
      </div>
      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600 dark:text-purple-300">Per Page</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">{{ pageSize }}</p>
          </div>
          <div class="text-4xl opacity-20">⚙️</div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div v-if="loading"
        class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-3 text-gray-600 dark:text-gray-300 font-medium">Loading tests...</p>
        </div>
      </div>
      <DataTable :columns="columns" :data="tests" :server-side-pagination="true" :total-items="totalElements"
        :current-page="currentPage" :per-page="pageSize" :loading="loading" :searchable="true"
        search-placeholder="🔍 Search tests by name..." @page-change="fetchTests" @search="handleSearch"
        class="border-0 p-4">
        <template #cell-name="{ row, value }">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
              </div>
            </div>
            <div>
              <p
                class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ value }}
              </p>
            </div>
          </div>
        </template>

        <template #cell-category="{ value }">
          <span v-if="value"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {{ value }}
          </span>
          <span v-else class="text-gray-400 text-sm">—</span>
        </template>

        <template #cell-listSkill="{ value }">
          <div v-if="Array.isArray(value) && value.length > 0" class="flex flex-wrap gap-2 py-1">
            <span v-for="(skill, idx) in value.slice(0, 2)" :key="idx"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-200 shadow-sm">
              🎯 {{ skill.name }}
            </span>
            <span v-if="value.length > 2"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              +{{ value.length - 2 }} more
            </span>
          </div>
          <span v-else class="text-gray-400 text-sm italic">No skills assigned</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="relative group">
            <button
              class="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title="Actions">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button @click="handlePreview(row as TestVMSimple)"
                class="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors flex items-center space-x-3 first:rounded-t-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="text-gray-700 dark:text-gray-200 font-medium">Preview</span>
              </button>
              <button @click="handleEdit(row as TestVMSimple)"
                class="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors flex items-center space-x-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="text-gray-700 dark:text-gray-200 font-medium">Edit</span>
              </button>
              <button @click="handleDelete(row as TestVMSimple)"
                class="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center space-x-3 last:rounded-b-lg">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span class="text-red-600 dark:text-red-400 font-medium">Delete</span>
              </button>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-16">
            <div
              class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mb-4">
              <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No tests found</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Get started by creating your first test.
            </p>
            <div class="mt-8">
              <router-link to="/admin/tests/create"
                class="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd" />
                </svg>
                Create First Test
              </router-link>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <ConfirmationModal :show="showDeleteModal" title="Delete Test"
    :message="`Are you sure you want to delete test &quot;${testToDelete?.name}&quot;? This action cannot be undone.`"
    confirm-text="Delete" cancel-text="Cancel" :processing="isDeleting" @confirm="confirmDelete"
    @cancel="cancelDelete" />

  <!-- Success/Error Toast Notification -->
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 opacity-0">
    <div v-if="toast.show"
      class="fixed top-4 right-4 z-[9999] max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ toast.title }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button @click="toast.show = false"
              class="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { getAllTestsSimple, TestVMSimple, deleteTest } from '@/api/admin/test/testApi';
import debounce from 'lodash/debounce';

const tests = ref<TestVMSimple[]>([]);
const totalElements = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const searchQuery = ref('');

// Delete modal state
const showDeleteModal = ref(false);
const testToDelete = ref<TestVMSimple | null>(null);
const isDeleting = ref(false);

// Toast notification state
const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: ''
});

const showToast = (type: 'success' | 'error', title: string, message: string) => {
  toast.value = { show: true, type, title, message };
  setTimeout(() => {
    toast.value.show = false;
  }, 5000);
};

const debouncedFetch = debounce((query: string) => {
  fetchTests(1, query);
}, 300);

const handleSearch = (query: string) => {
  searchQuery.value = query;
  debouncedFetch(query);
};

const handleEdit = (test: TestVMSimple) => {
  // Navigate to edit page
  window.location.href = `/admin/tests/edit/${test.id}`;
};

const handlePreview = (test: TestVMSimple) => {
  // Navigate to preview page or open in modal
  window.location.href = `/admin/tests/preview/${test.id}`;
};

const handleDelete = (test: TestVMSimple) => {
  testToDelete.value = test;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  testToDelete.value = null;
};

const confirmDelete = async () => {
  if (!testToDelete.value) return;

  isDeleting.value = true;
  const testName = testToDelete.value.name;
  const testId = testToDelete.value.id;

  try {
    const response = await deleteTest(testId);

    if (response.success) {
      showToast('success', 'Test Deleted', `Test "${testName}" has been deleted successfully.`);

      // Close modal
      showDeleteModal.value = false;
      testToDelete.value = null;

      // If we're on the last page and delete the last item, go to previous page
      if (tests.value.length === 1 && currentPage.value > 1) {
        await fetchTests(currentPage.value - 1);
      } else {
        await fetchTests(currentPage.value);
      }
    } else {
      showToast('error', 'Delete Failed', response.message || 'Unknown error occurred');
    }
  } catch (error: any) {
    const errorMessage = error?.data?.message || error?.message || 'An unexpected error occurred while deleting the test';
    showToast('error', 'Delete Failed', errorMessage);
    console.error('Error deleting test:', error);
  } finally {
    isDeleting.value = false;
  }
};

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'listSkill', label: 'Skills', sortable: false, render: null },
  { key: 'actions', label: 'Actions', sortable: false },
];

const fetchTests = async (page = 1, search?: string) => {
  loading.value = true;
  try {
    const { data } = await getAllTestsSimple({
      page: page - 1,
      size: pageSize.value,
      search: search || searchQuery.value
    });
    tests.value = data.content;
    totalElements.value = data.totalElements;
    currentPage.value = data.number + 1;
  } catch {
    // handle error, maybe show a notification
    console.error('Error fetching tests');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTests();
});
</script>

<style scoped>
:deep(.data-table) {
  border: 0;
}

:deep(.data-table thead th) {
  background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.75rem;
  border-bottom: 2px solid #e5e7eb;
  color: #374151;
}

:deep(.dark .data-table thead th) {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  color: #f3f4f6;
  border-color: #4b5563;
}

:deep(.data-table tbody tr) {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.dark .data-table tbody tr) {
  background-color: #1f2937;
  border-color: #4b5563;
}

:deep(.data-table tbody tr:hover) {
  background-color: #f9fafb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

:deep(.dark .data-table tbody tr:hover) {
  background-color: #374151;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
}

:deep(.data-table tbody tr:last-child) {
  border-bottom: 0;
}

:deep(.data-table td) {
  padding: 1.25rem 1.75rem;
  vertical-align: middle;
}

:deep(.data-table th) {
  padding: 1rem 1.75rem;
}

:deep(.data-table .loading-row) {
  animation: shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: linear-gradient(90deg, #f8fafc 25%, #f3f4f6 50%, #f8fafc 75%);
  background-size: 200% 100%;
}

:deep(.dark .data-table .loading-row) {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

:deep(.data-table .loading-row td) {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

:deep(.pagination) {
  padding: 1rem 1.75rem;
  border-top: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%);
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.dark .pagination) {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-color: #4b5563;
}

:deep(.pagination button) {
  transition: all 0.3s ease;
}

:deep(.pagination button:hover:not(:disabled)) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.data-table tbody tr) {
  animation: fadeIn 0.3s ease-out;
}
</style>
