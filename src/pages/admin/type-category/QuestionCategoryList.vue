<template>
   <div>
      <!-- Stats Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div
            class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-lg p-6 border border-indigo-200 dark:border-indigo-700">
            <div class="flex items-center justify-between">
               <div>
                  <p class="text-sm font-medium text-indigo-600 dark:text-indigo-300">Total Categories</p>
                  <p class="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">{{ totalElements }}</p>
               </div>
               <div class="text-4xl opacity-20">🏷️</div>
            </div>
         </div>
         <div
            class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 border border-green-200 dark:border-green-700">
            <div class="flex items-center justify-between">
               <div>
                  <p class="text-sm font-medium text-green-600 dark:text-green-300">Current Page</p>
                  <p class="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{{ currentPage }} / {{
                     Math.ceil(totalElements / pageSize) || 1 }}</p>
               </div>
               <div class="text-4xl opacity-20">📄</div>
            </div>
         </div>
         <div
            class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
            <div class="flex items-center justify-between">
               <div>
                  <p class="text-sm font-medium text-orange-600 dark:text-orange-300">Per Page</p>
                  <p class="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">{{ pageSize }}</p>
               </div>
               <div class="text-4xl opacity-20">⚙️</div>
            </div>
         </div>
      </div>

      <!-- Header with Create Button -->
      <div class="flex justify-between items-center mb-6">
         <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Question Categories</h2>
         <button @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
               </path>
            </svg>
            Create New Category
         </button>
      </div>

      <!-- Data Table -->
      <div
         class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-6">
         <DataTable :columns="columns" :data="categories" :server-side-pagination="true" :total-items="totalElements"
            :current-page="currentPage" :per-page="pageSize" :loading="loading" :searchable="true"
            search-placeholder="🔍 Search question categories..."
            td-class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 break-words" @page-change="fetchCategories"
            @search="handleSearch">
            <template #cell-name="{ value }">
               <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                     <div
                        class="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                           </path>
                        </svg>
                     </div>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ value }}</span>
               </div>
            </template>

            <template #cell-code="{ value }">
               <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{{
                  value }}</span>
            </template>

            <template #cell-skill="{ value }">
               <span v-if="value"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 dark:from-purple-900 dark:to-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                  <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                     </path>
                  </svg>
                  {{ value }}
               </span>
               <span v-else class="text-gray-400 text-sm italic">No skill assigned</span>
            </template>

            <template #cell-actions="{ row }">
               <div class="flex items-center gap-2">
                  <button @click="openEditModal(row)"
                     class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                     </svg>
                     Edit
                  </button>
                  <button @click="handleDelete(row)"
                     class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                     </svg>
                     Delete
                  </button>
               </div>
            </template>
         </DataTable>
      </div>

      <!-- Create/Edit Modal -->
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
         enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200"
         leave-from-class="opacity-100" leave-to-class="opacity-0">
         <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div @click.self="closeModal" class="w-full h-full absolute inset-0"></div>
            <div
               class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full relative z-10 transform transition-all">
               <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                     {{ isEditing ? 'Edit Question Category' : 'Create Question Category' }}
                  </h3>

                  <form @submit.prevent="handleSubmit" class="space-y-4">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Name <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.name" type="text" required
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                           placeholder="Enter category name" />
                     </div>

                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Code <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.code" type="text" required
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                           placeholder="Enter category code" />
                     </div>

                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Skill <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.skill" type="text" required
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                           placeholder="Enter skill (e.g., Reading, Listening)" />
                     </div>

                     <div class="flex justify-end gap-3 mt-6">
                        <button type="button" @click="closeModal"
                           class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                           Cancel
                        </button>
                        <button type="submit" :disabled="isSaving"
                           class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                           {{ isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </Transition>

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal :show="showDeleteModal" title="Delete Question Category"
         :message="`Are you sure you want to delete the question category '${itemToDelete?.name}'?\nThis action cannot be undone.`"
         confirm-text="Delete" cancel-text="Cancel" :processing="isDeleting" @confirm="confirmDelete"
         @cancel="cancelDelete" />

      <!-- Toast Notification -->
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-2 opacity-0"
         enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200"
         leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 opacity-0">
         <div v-if="toast.show"
            class="fixed top-4 right-4 z-[9999] max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="p-4">
               <div class="flex items-start">
                  <div class="flex-shrink-0">
                     <svg v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <svg v-else class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>
                  <div class="ml-3 w-0 flex-1 pt-0.5">
                     <p class="text-sm font-medium text-gray-900 dark:text-white">{{ toast.title }}</p>
                     <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ toast.message }}</p>
                  </div>
                  <button @click="toast.show = false"
                     class="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500">
                     <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                           d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </Transition>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import {
   getAllQuestionCategories,
   createQuestionCategory,
   updateQuestionCategory,
   deleteQuestionCategory,
   type QuestionCategoryVM,
   type QuestionCategoryRequest
} from '@/api/questionCategoryApi';
import debounce from 'lodash/debounce';

const categories = ref<QuestionCategoryVM[]>([]);
const totalElements = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const searchQuery = ref('');

const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const formData = ref<QuestionCategoryRequest>({
   name: '',
   code: '',
   skill: ''
});

const showDeleteModal = ref(false);
const itemToDelete = ref<QuestionCategoryVM | null>(null);
const isDeleting = ref(false);

const toast = ref({
   show: false,
   type: 'success' as 'success' | 'error',
   title: '',
   message: ''
});

const columns = [
   { key: 'name', label: 'Name', sortable: true },
   { key: 'code', label: 'Code', sortable: true },
   { key: 'skill', label: 'Skill', sortable: true },
   { key: 'actions', label: 'Actions', sortable: false }
];

const showToast = (type: 'success' | 'error', title: string, message: string) => {
   toast.value = { show: true, type, title, message };
   setTimeout(() => {
      toast.value.show = false;
   }, 5000);
};

const fetchCategories = async (page: number = 1, search: string = '') => {
   loading.value = true;
   try {
      const response = await getAllQuestionCategories(page - 1, pageSize.value, 'name', 'asc', search);
      categories.value = response.data.content;
      totalElements.value = response.data.totalElements;
      currentPage.value = page;
   } catch (error: any) {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to fetch question categories');
   } finally {
      loading.value = false;
   }
};

const debouncedFetch = debounce((query: string) => {
   fetchCategories(1, query);
}, 300);

const handleSearch = (query: string) => {
   searchQuery.value = query;
   debouncedFetch(query);
};

const openCreateModal = () => {
   isEditing.value = false;
   editingId.value = null;
   formData.value = { name: '', code: '', skill: '' };
   showModal.value = true;
};

const openEditModal = (item: QuestionCategoryVM) => {
   isEditing.value = true;
   editingId.value = item.id;
   formData.value = { name: item.name, code: item.code, skill: item.skill };
   showModal.value = true;
};

const closeModal = () => {
   showModal.value = false;
   formData.value = { name: '', code: '', skill: '' };
};

const handleSubmit = async () => {
   isSaving.value = true;
   try {
      if (isEditing.value && editingId.value) {
         await updateQuestionCategory(editingId.value, formData.value);
         showToast('success', 'Success', 'Question category updated successfully');
      } else {
         await createQuestionCategory(formData.value);
         showToast('success', 'Success', 'Question category created successfully');
      }
      closeModal();
      fetchCategories(currentPage.value, searchQuery.value);
   } catch (error: any) {
      showToast('error', 'Error', error.response?.data?.message || 'Operation failed');
   } finally {
      isSaving.value = false;
   }
};

const handleDelete = (item: QuestionCategoryVM) => {
   itemToDelete.value = item;
   showDeleteModal.value = true;
};

const cancelDelete = () => {
   showDeleteModal.value = false;
   itemToDelete.value = null;
};

const confirmDelete = async () => {
   if (!itemToDelete.value) return;

   const itemId = itemToDelete.value.id;
   isDeleting.value = true;
   try {
      await deleteQuestionCategory(itemId);
      showToast('success', 'Success', 'Question category deleted successfully');
      showDeleteModal.value = false;
      itemToDelete.value = null;
      fetchCategories(currentPage.value, searchQuery.value);
   } catch (error: any) {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to delete question category');
   } finally {
      isDeleting.value = false;
   }
};

onMounted(() => {
   fetchCategories();
});
</script>
