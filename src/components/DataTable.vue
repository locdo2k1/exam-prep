<template>
  <div class="w-full">
    <!-- Mobile cards view -->
    <div class="sm:hidden space-y-3">
      <div v-for="(item, index) in sortedData" :key="index"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-medium text-gray-900 dark:text-white truncate">
              {{ item[primaryColumn] }}
            </h3>
            <div class="mt-2 space-y-1">
              <template v-for="column in props.columns" :key="column.key">
                <div v-if="!column.hideOnMobile && column.key !== primaryColumn" class="flex items-start">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    {{ column.label }}:
                  </span>
                  <span class="text-sm text-gray-700 dark:text-gray-300 break-words flex-1"
                    v-html="column.render ? column.render(item[column.key], item) : item[column.key]"></span>
                </div>
              </template>
            </div>
          </div>
          <div v-if="props.actions && props.actions.length > 0" class="ml-2 flex-shrink-0">
            <div class="flex flex-col space-y-1">
              <button v-for="(action, actionIndex) in props.actions" :key="actionIndex" @click="action.handler(item)"
                class="p-1.5 rounded-full hover:bg-opacity-20 flex items-center justify-center" :class="action.class"
                :title="action.label">
                <span v-if="typeof action.icon === 'string'" v-html="action.icon"></span>
                <span class="sr-only">{{ action.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop table view -->
    <div class="hidden sm:block">
      <!-- Search input -->
      <div v-if="props.searchable" class="mb-4">
        <div class="relative max-w-xs">
          <input type="text" :placeholder="props.searchPlaceholder || 'Search...'" v-model="searchQuery"
            @input="handleSearch"
            class="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 pl-5" />
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 custom-scrollbar">
        <table class="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr class="divide-x divide-gray-200 dark:divide-gray-700">
              <th v-for="(column, index) in props.columns" :key="index" :class="{
                'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap': true,
                'cursor-pointer': column.sortable !== false,
                'hidden md:table-cell': column.hideOnMobile
              }" @click="column.sortable !== false && handleSort(column.key)">
                <div class="flex items-center">
                  <span class="truncate">{{ column.label }}</span>
                  <span v-if="column.sortable !== false" class="ml-1 flex-shrink-0 opacity-50 group-hover:opacity-100">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </div>
              </th>
              <th v-if="props.actions && props.actions.length > 0"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(item, rowIndex) in paginatedData" :key="rowIndex"
              class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td v-for="(column, colIndex) in props.columns" :key="colIndex" :class="[tdClass, {
                'hidden md:table-cell': column.hideOnMobile,
                'font-medium': column.key === primaryColumn
              }]">
                <slot :name="`cell-${column.key}`" :row="item" :value="item[column.key]">
                  <span v-html="column.render ? column.render(item[column.key], item) : item[column.key]"></span>
                </slot>
              </td>
              <td v-if="props.actions && props.actions.length > 0" class="px-4 py-3 text-sm font-medium text-right">
                <div class="relative inline-block text-left actions-dropdown-container">
                  <div>
                    <button @click="toggleActionMenu(rowIndex)" type="button"
                      class="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                      aria-expanded="true" aria-haspopup="true">
                      <span class="sr-only">Open options</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        aria-hidden="true">
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <div v-if="openActionMenu === rowIndex"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-10"
                      role="menu" aria-orientation="vertical" tabindex="-1">
                      <div class="py-1" role="none">
                        <button v-for="(action, actionIndex) in props.actions" :key="actionIndex"
                          @click="() => { action.handler(item); closeActionMenu(); }"
                          :class="[action.class, 'flex items-center w-full px-4 py-2 text-sm text-left']"
                          role="menuitem" tabindex="-1">
                          <span v-if="typeof action.icon === 'string'" v-html="action.icon" class="mr-3 h-5 w-5"></span>
                          <span>{{ action.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td :colspan="props.columns.length + (props.actions && props.actions.length > 0 ? 1 : 0)"
                class="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="props.showPagination && totalItems > 0"
        class="mt-4 flex flex-col sm:flex-row items-center justify-between px-2">
        <div class="text-sm text-gray-700 dark:text-gray-400 mb-2 sm:mb-0">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> of
          <span class="font-medium">{{ totalItems }}</span> results
        </div>
        <div class="flex space-x-1">
          <button @click="changePage(1)" :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            First
          </button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>

          <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="{
            'px-3 py-1 rounded-md text-sm font-medium': true,
            'bg-blue-600 text-white': currentPage === page,
            'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': currentPage !== page
          }">
            {{ page }}
          </button>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            Last
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

// Icons
const EditIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  `
};

const DeleteIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  `
};

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [],
    validator: (cols) => cols.every(col => col.key && col.label)
  },
  actions: {
    type: Array,
    default: () => []
  },
  primaryColumn: {
    type: String,
    default: 'name'
  },
  showActionsOnMobile: {
    type: Boolean,
    default: true
  },
  cardViewBreakpoint: {
    type: String,
    default: 'sm' // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  },
  mobileCardClass: {
    type: String,
    default: 'bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700'
  },
  mobileCardHeaderClass: {
    type: String,
    default: 'flex justify-between items-start'
  },
  mobileCardTitleClass: {
    type: String,
    default: 'font-medium text-gray-900 dark:text-white'
  },
  mobileCardMetaClass: {
    type: String,
    default: 'flex flex-wrap gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400'
  },
  mobileCardActionsClass: {
    type: String,
    default: 'flex space-x-2'
  },
  mobileCardActionClass: {
    type: String,
    default: 'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
  },
  tableContainerClass: {
    type: String,
    default: 'overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'
  },
  tableClass: {
    type: String,
    default: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
  },
  theadClass: {
    type: String,
    default: 'bg-gray-50 dark:bg-gray-800'
  },
  thClass: {
    type: String,
    default: 'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap'
  },
  tbodyClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'
  },
  trClass: {
    type: String,
    default: 'hover:bg-gray-50 dark:hover:bg-gray-800'
  },
  tdClass: {
    type: String,
    default: 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100 break-words'
  },
  actionsContainerClass: {
    type: String,
    default: 'flex justify-end space-x-2'
  },
  actionButtonClass: {
    type: String,
    default: 'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
  },
  sortIconClass: {
    type: String,
    default: 'w-3 h-3 opacity-50 group-hover:opacity-100'
  },
  emptyStateClass: {
    type: String,
    default: 'px-6 py-4 text-center text-sm text-gray-500'
  },
  emptyStateText: {
    type: String,
    default: 'No data available'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  loadingClass: {
    type: String,
    default: 'flex justify-center items-center p-8 text-gray-500'
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  searchable: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  sortable: {
    type: Boolean,
    default: true
  },
  perPageSelect: {
    type: [Boolean, Array],
    default: false
  },
  perPage: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  serverSidePagination: {
    type: Boolean,
    default: false
  },
  actions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['sort', 'page-change', 'search']);

// Action menu state
const openActionMenu = ref(null); // Will store the row index

const toggleActionMenu = (rowIndex) => {
  openActionMenu.value = openActionMenu.value === rowIndex ? null : rowIndex;
};

const closeActionMenu = () => {
  openActionMenu.value = null;
};

const handleClickOutside = (event) => {
  if (openActionMenu.value !== null && !event.target.closest('.actions-dropdown-container')) {
    closeActionMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Local state
const tableData = computed(() => [...props.data]);
const sortBy = ref('');
const sortDirection = ref('asc');
const currentPage = ref(props.currentPage);
const itemsPerPage = ref(10);
const searchQuery = ref('');

// Handle search input
const handleSearch = (event) => {
  searchQuery.value = event.target.value;
  currentPage.value = 1; // Reset to first page when searching
  emit('search', searchQuery.value);
};

// Filter data based on search query
const filteredData = computed(() => {
  if (props.serverSidePagination) return tableData.value; // Skip client-side filtering for server-side mode
  if (!searchQuery.value) return tableData.value;

  const query = searchQuery.value.toLowerCase();
  return tableData.value.filter(item => {
    return Object.entries(item).some(([key, value]) => {
      // Skip if the column is not searchable
      const column = props.columns.find(col => col.key === key);
      if (column && column.searchable === false) return false;

      // Check if the value matches the search query
      return String(value || '').toLowerCase().includes(query);
    });
  });
});

// Computed properties
const sortedData = computed(() => {
  const dataToSort = searchQuery.value ? filteredData.value : tableData.value;
  if (!sortBy.value) return dataToSort;

  return [...dataToSort].sort((a, b) => {
    let modifier = 1;
    if (sortDirection.value === 'desc') modifier = -1;

    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1 * modifier;
    if (bValue === undefined || bValue === null) return -1 * modifier;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }

    return (aValue > bValue ? 1 : -1) * modifier;
  });
});

const paginatedData = computed(() => {
  if (props.serverSidePagination) {
    return tableData.value; // Server already paginated the data
  }
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  const total = props.serverSidePagination ? props.totalItems : filteredData.value.length;
  return Math.ceil(total / itemsPerPage.value);
});

// Methods
const handleSort = (key) => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDirection.value = 'asc';
  }
  emit('sort', { sortBy: key, sortDirection: sortDirection.value });
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  emit('update:current-page', page);
  emit('page-change', page);
};

// Watch for data changes
watch(() => props.data, () => {
  if (!props.serverSidePagination) {
    currentPage.value = 1; // Only reset for client-side pagination
  }
}, { deep: true });

// Sync currentPage prop with local ref
watch(() => props.currentPage, (newPage) => {
  if (newPage !== currentPage.value) {
    currentPage.value = newPage;
  }
});



// Initialize on mount
onMounted(() => {

  // Set default sort if specified
  const defaultSort = props.columns.find(col => col.defaultSort);
  if (defaultSort) {
    sortBy.value = defaultSort.key;
    sortDirection.value = defaultSort.defaultSort;
  }

  // Set default items per page from props if provided
  if (props.perPage) {
    itemsPerPage.value = props.perPage;
  }
});
</script>

<style scoped>
/* Custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 2px;
  margin: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dark mode scrollbar */
.dark .custom-scrollbar {
  scrollbar-color: #4b5563 #1f2937;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
