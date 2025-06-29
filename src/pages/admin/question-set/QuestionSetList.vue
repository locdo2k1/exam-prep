<template>
    <div class="container mx-auto px-4 py-6">
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
        <ConfirmationModal :show="showDeleteModal" title="Delete Question Set"
            message="Are you sure you want to delete this question set? This action cannot be undone."
            confirm-text="Delete" cancel-text="Cancel" :processing="deleting" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import DataTable from '@/components/DataTable.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { questionSetApi } from '@/api/admin/question-set/questionSet';

export default {
    name: 'QuestionSetList',
    components: {
        DataTable,
        ConfirmationModal,
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
                key: 'questionCount',
                label: 'Questions',
                sortable: false,
                align: 'center',
                width: '120px',
                render: (_, row) => row.questionSetItems?.length || 0,
            },
        ];

        // Table actions
        const actions = [
            {
                label: 'View',
                icon: EyeIcon,
                handler: (item) => {
                    router.push(`/admin/question-sets/${item.id}`);
                },
            },
            {
                label: 'Edit',
                icon: PencilIcon,
                handler: (item) => {
                    router.push(`/admin/question-sets/${item.id}/edit`);
                },
            },
            {
                label: 'Delete',
                icon: TrashIcon,
                class: 'text-red-600 hover:text-red-800',
                handler: (item) => {
                    itemToDelete.value = item;
                    showDeleteModal.value = true;
                },
            },
        ];

        // Fetch question sets with pagination and sorting
        const fetchQuestionSets = async () => {
            try {
                loading.value = true;
                
                // Prepare the filter object with pagination and sorting
                const filter = {
                    search: searchQuery.value || undefined,
                    page: currentPage.value - 1, // Backend is 0-based
                    size: itemsPerPage.value,
                    sort: sortBy.value,
                    direction: sortDirection.value,
                };

                console.log('Fetching question sets with filter:', filter);
                
                const response = await questionSetApi.getAll(filter);
                console.log('API Response:', response);
                
                if (response?.success && response.data) {
                    // Update the question sets list
                    questionSets.value = response.data.content || [];
                    totalItems.value = response.data.totalElements || 0;
                    
                    // Calculate total pages from the API response
                    const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);
                    
                    // If current page is out of bounds, adjust and refetch
                    if (currentPage.value > totalPages && totalPages > 0) {
                        console.log(`Adjusting current page from ${currentPage.value} to ${totalPages}`);
                        currentPage.value = totalPages;
                        return fetchQuestionSets(); // Refetch with corrected page
                    }
                    
                    console.log(`Fetched ${questionSets.value.length} of ${totalItems.value} items (page ${currentPage.value} of ${totalPages})`);
                } else {
                    console.warn('No data received from API or invalid response format');
                    questionSets.value = [];
                    totalItems.value = 0;
                    currentPage.value = 1;
                }
            } catch (error) {
                console.error('Error fetching question sets:', error);
                toast.error('Failed to load question sets');
            } finally {
                loading.value = false;
            }
        };

        // Handle page change
        const handlePageChange = (page) => {
            console.log('Page changed to:', page);
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
                console.error('Error deleting question set:', error);
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

            // Table config
            columns,
            actions,

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
/* Add any custom styles here */
</style>
