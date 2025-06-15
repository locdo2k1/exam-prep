<template>
  <div class="w-full">
    <!-- Mobile cards view -->
    <div class="sm:hidden space-y-3">
      <div 
        v-for="(item, index) in tableData" 
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700"
      >
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
                  <span 
                    class="text-sm text-gray-700 dark:text-gray-300 break-words flex-1"
                    v-html="column.render ? column.render(item[column.key], item) : item[column.key]"
                  ></span>
                </div>
              </template>
            </div>
          </div>
          <div v-if="actions && actions.length > 0" class="ml-2 flex-shrink-0">
            <div class="flex flex-col space-y-1">
              <button
                v-for="(action, actionIndex) in actions"
                :key="actionIndex"
                @click="action.handler(item)"
                class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="action.class"
                :title="action.label"
              >
                <component 
                  :is="action.icon || 'span'" 
                  class="w-4 h-4"
                  v-if="action.icon"
                />
                <span v-else class="text-xs">{{ action.label.charAt(0) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop table view -->
    <div class="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr class="divide-x divide-gray-200 dark:divide-gray-700">
            <th 
              v-for="(column, index) in props.columns" 
              :key="index"
              :class="{
                'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap': true,
                'cursor-pointer': column.sortable !== false,
                'hidden md:table-cell': column.hideOnMobile
              }"
              @click="column.sortable !== false && handleSort(column.key)"
            >
              <div class="flex items-center">
                <span class="truncate">{{ column.label }}</span>
                <span v-if="column.sortable !== false" class="ml-1 flex-shrink-0 opacity-50 group-hover:opacity-100">
                  <svg 
                    class="w-3 h-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </span>
              </div>
            </th>
            <th 
              v-if="actions && actions.length > 0" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="(item, rowIndex) in paginatedData" 
            :key="rowIndex"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <td 
              v-for="(column, colIndex) in props.columns" 
              :key="colIndex"
              :class="{
                'px-4 py-3 text-sm text-gray-900 dark:text-gray-100 break-words': true,
                'hidden md:table-cell': column.hideOnMobile,
                'font-medium': column.key === primaryColumn
              }"
              :style="{ width: column.width || 'auto' }"
            >
              <slot :name="`cell-${column.key}`" :row="item" :value="item[column.key]">
                <span v-html="column.render ? column.render(item[column.key], item) : item[column.key]"></span>
              </slot>
            </td>
            <td 
              v-if="actions && actions.length > 0" 
              class="px-4 py-3 whitespace-nowrap text-sm font-medium"
            >
              <div class="flex justify-end space-x-2">
                <button
                  v-for="(action, actionIndex) in actions"
                  :key="actionIndex"
                  @click="action.handler(item)"
                  class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="action.class"
                  :title="action.label"
                >
                  <component 
                    :is="action.icon || 'span'" 
                    class="w-4 h-4"
                    v-if="action.icon"
                  />
                  <span v-else class="text-xs">{{ action.label.charAt(0) }}</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="tableData.length === 0">
            <td :colspan="props.columns.length + (actions && actions.length > 0 ? 1 : 0)" class="px-6 py-4 text-center text-sm text-gray-500">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="tableData.length > itemsPerPage" class="mt-4 flex flex-col sm:flex-row items-center justify-between px-2">
        <div class="text-sm text-gray-700 dark:text-gray-400 mb-2 sm:mb-0">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, tableData.length) }}</span> of 
          <span class="font-medium">{{ tableData.length }}</span> results
        </div>
        <div class="flex space-x-1">
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1"
            :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            First
          </button>
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="{
              'px-3 py-1 rounded-md text-sm font-medium': true,
              'bg-blue-600 text-white': currentPage === page,
              'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': currentPage !== page
            }"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

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
    default: 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150'
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
  actions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['sort', 'page-change']);

// Local state
const tableData = computed(() => [...props.data]);
const sortBy = ref('');
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed properties
const sortedData = computed(() => {
  if (!sortBy.value) return tableData.value;
  
  return [...tableData.value].sort((a, b) => {
    let modifier = 1;
    if (sortDirection.value === 'desc') modifier = -1;
    
    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier;
    return 0;
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / itemsPerPage.value);
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
  emit('page-change', page);
};

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1; // Reset to first page when data changes
}, { deep: true });

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
