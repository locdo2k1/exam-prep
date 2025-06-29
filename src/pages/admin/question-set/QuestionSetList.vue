<template>
    <div class="relative w-full px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Question Sets</h1>
            <router-link to="/admin/question-sets/create"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-150">
                <PlusIcon class="h-3 w-3 mr-1" />
                <span>Add</span>
            </router-link>

        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <DataTable 
                :data="questionSets" 
                :columns="columns" 
                :actions="actions" 
                :loading="loading"
                :total-items="totalItems" 
                :current-page="currentPage"
                :items-per-page="itemsPerPage" 
                :searchable="true"
                :server-side-pagination="true"
                search-placeholder="Search question sets..." 
                @update:current-page="handlePageChange"
                @sort="handleSort"
                @search="handleSearch"
            />
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="cancelDelete"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
                    <div class="p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                                Delete Question Set
                            </h3>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 dark:text-gray-300">
                                Are you sure you want to delete this question set? This action cannot be undone.
                            </p>
                        </div>
                        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="button"
                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                                :disabled="deleting"
                                @click="confirmDelete"
                            >
                                <span v-if="deleting" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </span>
                                <span v-else>Delete</span>
                            </button>
                            <button
                                type="button"
                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                :disabled="deleting"
                                @click="cancelDelete"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Question Set Preview Modal -->
        <div v-if="isModalOpen && previewData" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
            <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeModal"></div>
            <div class="relative w-full max-w-4xl bg-white rounded-xl shadow-xl dark:bg-gray-800 overflow-hidden">
                <!-- Header -->
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <div class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ previewData.title || 'Question Set Preview' }}
                            </h3>
                            <button @click="closeModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Question Set Description -->
                    <div v-if="previewData.description" class="px-6 pb-4">
                        <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r">
                            <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 uppercase tracking-wider mb-2">
                                Description
                            </h4>
                            <div class="prose dark:prose-invert prose-sm max-w-none text-blue-700 dark:text-blue-100" v-html="previewData.description"></div>
                        </div>
                    </div>
                </div>

                <!-- Questions List -->
                <div class="overflow-y-auto max-h-[60vh] p-6 space-y-6 custom-scrollbar">
                    <div v-if="!previewData.questions?.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        No questions in this set
                    </div>

                    <div v-for="(question, qIndex) in previewData.questions" :key="question.id" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <!-- Question Header -->
                        <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <span class="font-medium text-gray-900 dark:text-white">Question {{ qIndex + 1 }}</span>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                                        :class="question.questionCategory?.skill === 'Listening' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                                        {{ question.questionCategory?.skill || 'General' }}
                                    </span>
                                </div>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ question.score || 0 }} point{{ question.score !== 1 ? 's' : '' }}
                                </span>
                            </div>
                            <div v-if="question.questionCategory" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {{ question.questionCategory.name }}
                            </div>
                        </div>

                        <!-- Question Content -->
                        <div class="p-4">
                            <div v-if="question.description" class="prose dark:prose-invert prose-sm max-w-none mb-4">
                                <div v-html="question.description"></div>
                            </div>
                            
                            <div v-if="question.prompt" class="prose dark:prose-invert prose-sm max-w-none mb-4 text-gray-800 dark:text-gray-200" v-html="question.prompt"></div>
                            
                            <!-- Audio Player (if any) -->
                            <div v-if="question.questionAudios?.length" class="mb-4">
                                <audio controls class="w-full">
                                    <source :src="question.questionAudios[0].url" type="audio/mpeg">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>

                            <!-- Show Options if available -->
                            <div v-if="question.options?.length" class="space-y-2">
                                <div v-for="(option, oIndex) in question.options" :key="option.id"
                                    class="flex items-start p-3 rounded-lg border"
                                    :class="{
                                        'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/30': option.correct,
                                        'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50': !option.correct
                                    }">
                                    <span class="text-gray-700 dark:text-gray-200">{{ option.text }}</span>
                                    <span v-if="option.correct" class="ml-auto text-green-600 dark:text-green-400 text-sm flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Correct
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Show Question Answers if no options -->
                            <div v-else-if="question.questionAnswers?.length" class="space-y-2">
                                <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Answer:</h5>
                                    <div class="space-y-2">
                                        <div v-for="(answer, aIndex) in question.questionAnswers" :key="aIndex" 
                                             class="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <div v-html="answer.text"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <div class="px-6 py-4 flex items-center justify-between">
                        <div class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span v-if="previewData?.questions?.length">
                                {{ previewData.questions.length }} question{{ previewData.questions.length !== 1 ? 's' : '' }}
                            </span>
                            <span v-else>No questions</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button @click="closeModal" type="button"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close
                            </button>
                            <button v-if="previewData?.id"
                                @click="$router.push({ name: 'admin-question-sets-edit', params: { id: previewData.id } })" type="button"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Question Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PlusIcon } from '@heroicons/vue/24/outline';
import DataTable from '@/components/DataTable.vue';

import { questionSetApi } from '@/api/admin/question-set/questionSet';

export default {
    name: 'QuestionSetList',
    components: {
        DataTable,
        PlusIcon
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        // State
        const questionSets = ref([]);
        const loading = ref(false);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const totalItems = ref(0);
        const sortBy = ref('order');
        const sortDirection = ref('asc');
        const searchQuery = ref('');
        const showDeleteModal = ref(false);
        const deleting = ref(false);
        const itemToDelete = ref(null);
        const isModalOpen = ref(false);
        const previewData = ref(null);

        // Modal methods
        const openModal = async (item) => {
            try {
                loading.value = true;
                // Set basic data first
                previewData.value = item;
                isModalOpen.value = true;

                console.log(item);

            } catch (error) {
                toast.error('Failed to load question details');
            } finally {
                loading.value = false;
            }
        };

        const closeModal = () => {
            isModalOpen.value = false;
            previewData.value = null;
        };

        // Table columns
        const columns = [
            {
                key: 'title',
                label: 'Title',
                sortable: true,
            },
            {
                key: 'description',
                label: 'Description',
                sortable: false,
                hideOnMobile: true,
                render: (value) => value || '—',
            },
            {
                key: 'order',
                label: 'Order',
                sortable: true,
                align: 'center',
                width: '100px',
            },
            {
                key: 'totalQuestions',
                label: 'Total Questions',
                sortable: true,
                align: 'center',
                width: '120px',
            },
            {
                key: 'questions',
                label: 'Questions',
                sortable: false,
                align: 'center',
                width: '200px',
                render: (value, row) => {
                    if (!row.questions?.length) return '—';
                    return row.questions
                        .slice(0, 3)
                        .map(q => `• ${q.prompt || ''}`)
                        .join('<br>');
                }
            },
            {
                key: 'totalScore',
                label: 'Total Score',
                sortable: true,
                align: 'center',
                width: '120px',
            },
        ];

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

        const duplicateIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        `;

        const archiveIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <rect width="20" height="5" x="2" y="4" rx="2" />
            <path d="M4 9v9.5C4 19.9 5.1 21 6.5 21h11c1.4 0 2.5-1.1 2.5-2.5V9" />
            <path d="M10 13h4" />
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

        // Table actions
        const actions = [
            {
                label: 'Preview',
                icon: previewIcon,
                handler: (item) => {
                    openModal(item);
                },
                class: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/30',
            },
            {
                label: 'Edit',
                icon: editIcon,
                handler: (item) => {
                    router.push({ name: 'admin-question-sets-edit', params: { id: item.id } });
                },
                class: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',
            },
            {
                label: 'Delete',
                icon: deleteIcon,
                handler: (item) => {
                    itemToDelete.value = item;
                    showDeleteModal.value = true;
                },
                class: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30',
            },
        ];

        // Fetch question sets with pagination and sorting
        const fetchQuestionSets = async () => {
            try {
                loading.value = true;

                // Prepare the filter object with pagination and sorting
                const filter = {
                    search: searchQuery.value || undefined, // Using search to search in both title and description
                    page: currentPage.value - 1, // Backend is 0-based
                    size: itemsPerPage.value,
                    sort: sortBy.value,
                    direction: sortDirection.value,
                };

                const response = await questionSetApi.getAll(filter);

                if (response) {
                    // Update the question sets list
                    questionSets.value = response.content || [];
                    totalItems.value = response.totalElements || 0;

                    // Calculate total pages from the API response
                    const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);

                    // If current page is out of bounds, adjust and refetch
                    if (currentPage.value > totalPages && totalPages > 0) {
                        currentPage.value = totalPages;
                        return fetchQuestionSets(); // Refetch with corrected page
                    }

                } else {
                    questionSets.value = [];
                    totalItems.value = 0;
                    currentPage.value = 1;
                }
            } catch (error) {
                toast.error('Failed to load question sets');
            } finally {
                loading.value = false;
            }
        };

        // Handle page change
        const handlePageChange = (page) => {
            if (currentPage.value !== page) {
                currentPage.value = page;
                fetchQuestionSets();
            }
        };

        // Handle sort
        const handleSort = ({ sortBy: key, sortDirection: direction }) => {
            sortBy.value = key;
            sortDirection.value = direction;
            currentPage.value = 1; // Reset to first page when sorting
            fetchQuestionSets();
        };

        // Handle search
        const handleSearch = (query) => {
            searchQuery.value = query;
            currentPage.value = 1; // Reset to first page when searching
            fetchQuestionSets();
        };

        // Handle delete confirmation
        const confirmDelete = async () => {
            if (!itemToDelete.value) return;

            try {
                deleting.value = true;
                await questionSetApi.delete(itemToDelete.value.id);
                toast.success('Question set deleted successfully');
                fetchQuestionSets();
            } catch (error) {
                toast.error('Failed to delete question set');
            } finally {
                deleting.value = false;
                showDeleteModal.value = false;
                itemToDelete.value = null;
            }
        };

        // Cancel delete
        const cancelDelete = () => {
            showDeleteModal.value = false;
            itemToDelete.value = null;
        };

        // Initial fetch
        onMounted(() => {
            fetchQuestionSets();
        });


        return {
            // State
            questionSets,
            loading,
            currentPage,
            itemsPerPage,
            totalItems,
            showDeleteModal,
            deleting,
            itemToDelete,
            isModalOpen,
            previewData,

            // Table config
            columns,
            actions,

            // Modal methods
            openModal,
            closeModal,

            // Methods
            handlePageChange,
            handleSort,
            handleSearch,
            confirmDelete,
            cancelDelete,
        };
    },
};
</script>

<style scoped>
/* Custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

/* Webkit browsers (Chrome, Safari, etc.) */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
  border: 2px solid #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}

/* Dark mode styles */
.dark .custom-scrollbar {
  scrollbar-color: #4a5568 #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-color: #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
