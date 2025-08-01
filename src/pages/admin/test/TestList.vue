<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
      <div class="space-y-1">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Test Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage and organize your test collection</p>
      </div>
      <router-link to="/admin/tests/create"
        class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create New Test
      </router-link>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <DataTable :columns="columns" :data="tests" :server-side-pagination="true" :total-items="totalElements"
        :current-page="currentPage" :per-page="pageSize" :loading="loading" :searchable="true"
        search-placeholder="Search tests..." @page-change="fetchTests" @search="handleSearch" class="border-0 p-4">
        <template #cell-name="{ row, value }">
          <div
            class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {{ value }}
          </div>
        </template>

        <template #cell-category="{ value }">
          <span class="text-gray-700 dark:text-gray-300">{{ value || '—' }}</span>
        </template>

        <template #cell-listSkill="{ value }">
          <div v-if="Array.isArray(value) && value.length > 0" class="flex flex-wrap gap-1.5 py-1">
            <span v-for="(skill, idx) in value" :key="idx"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {{ skill.name }}
            </span>
          </div>
          <span v-else class="text-gray-400 text-sm">No skills</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center space-x-2">
            <button @click="handleEdit(row as TestVMSimple)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="handleDelete(row as TestVMSimple)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tests found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new test.
            </p>
            <div class="mt-6">
              <router-link to="/admin/tests/create"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd" />
                </svg>
                New Test
              </router-link>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';
import { getAllTestsSimple, TestVMSimple } from '@/api/admin/test/testApi';
import debounce from 'lodash/debounce';

const tests = ref<TestVMSimple[]>([]);
const totalElements = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const searchQuery = ref('');

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

const handleDelete = async (test: TestVMSimple) => {
  if (confirm(`Are you sure you want to delete test "${test.name}"?`)) {
    // Add your delete API call here
    try {
      // await deleteTest(test.id);
      await fetchTests(currentPage.value);
    } catch (error) {
      console.error('Error deleting test:', error);
    }
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
  } catch (error) {
    // handle error, maybe show a notification
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
  background-color: #f8fafc;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.dark .data-table thead th) {
  background-color: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

:deep(.data-table tbody tr) {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.dark .data-table tbody tr) {
  background-color: #1f2937;
  border-color: #4b5563;
}

:deep(.data-table tbody tr:hover) {
  background-color: #f8fafc;
}

:deep(.dark .data-table tbody tr:hover) {
  background-color: #374151;
}

:deep(.data-table tbody tr:last-child) {
  border-bottom: 0;
}

:deep(.data-table td) {
  padding: 1.25rem 1.75rem;
  white-space: nowrap;
  vertical-align: middle;
}

:deep(.data-table th) {
  padding: 1rem 1.75rem;
}

:deep(.data-table .loading-row) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #f8fafc;
}

:deep(.dark .data-table .loading-row) {
  background-color: #374151;
}

:deep(.data-table .loading-row td) {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

:deep(.pagination) {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

:deep(.dark .pagination) {
  background-color: #374151;
  border-color: #4b5563;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
