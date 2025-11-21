<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full flex flex-col border border-gray-100 dark:border-gray-700/50 hover:shadow-md dark:hover:border-gray-600">
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
        <DocumentTextIcon class="h-5 w-5 mr-2.5 text-blue-500" />
        Test Information
      </h2>
    </div>

    <div class="space-y-6 flex-1">
      <!-- Title Input -->
      <div class="group relative">
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 group-focus-within:text-blue-500">
          Test Title
          <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <input v-model="testData.title" type="text" required
            class="pl-10 pr-4 py-3 w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            placeholder="e.g., IELTS Practice Test 2023" />
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">A clear and descriptive title for your test</p>
      </div>

      <!-- Duration Input -->
      <div class="group relative w-full">
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 group-focus-within:text-blue-500">
          Duration (minutes)
          <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input v-model="testData.duration" type="number" min="1" required
            class="pl-10 pr-4 py-3 w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            placeholder="e.g., 60" />
        </div>
      </div>

      <!-- Test Category Dropdown -->
      <div class="group relative w-full">
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
          Test Category
          <span class="text-red-500 ml-0.5">*</span>
        </label>
        <div class="relative">
          <div @click="toggleCategoryDropdown"
            class="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer flex items-center justify-between"
            :class="{ 'border-red-500': !testData.testCategoryId && isFormSubmitted }">
            <span class="truncate">
              {{ selectedCategoryName || 'Select a category' }}
            </span>
            <svg class="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div v-if="isCategoryDropdownOpen"
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            <div v-for="category in testCategories" :key="category.id" @click="selectCategory(category)"
              class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              {{ category.name }} ({{ category.code }})
            </div>
          </div>

          <div v-if="!testData.testCategoryId && isFormSubmitted" class="mt-1 text-sm text-red-500">
            Please select a test category
          </div>
        </div>
      </div>

      <!-- Skills Multi-Select -->
      <div class="group relative w-full">
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
          Skills
          <span class="text-gray-400 text-xs ml-1">(Optional)</span>
        </label>
        <div class="relative">
          <div @click="toggleSkillsDropdown"
            class="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer">
            <div v-if="selectedSkills.length > 0" class="flex flex-wrap gap-2">
              <span v-for="skill in selectedSkills" :key="skill.id"
                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ skill.name }}
                <button @click.stop="removeSkill(skill.id)" class="ml-1.5 hover:text-blue-900 dark:hover:text-blue-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
            <div v-else class="flex items-center justify-between text-gray-400">
              <span>Select skills</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div v-if="isSkillsDropdownOpen"
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            <div v-if="availableSkills.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No skills available
            </div>
            <div v-for="skill in availableSkills" :key="skill.id" @click="toggleSkill(skill)"
              class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
              <span>{{ skill.name }} ({{ skill.code }})</span>
              <svg v-if="isSkillSelected(skill.id)" class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Select the skills tested in this test</p>
      </div>

      <!-- Audio File Input -->
      <div class="group relative mt-6">
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
          Audio File
          <span class="text-gray-400 text-xs ml-1">(Optional)</span>
        </label>
        <div class="relative">
          <input type="file" ref="audioFileInput" class="hidden" accept="audio/*" @change="handleFileUpload">
          <div class="flex items-stretch">
            <button type="button" @click="$refs.audioFileInput.click()"
              class="inline-flex items-center px-4 py-2.5 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              Choose File
            </button>
            <div
              class="flex-1 flex items-center px-4 py-2.5 rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 truncate">
              <div class="flex-1 truncate">
                {{ testData.audioFile?.name || 'No file selected' }}
              </div>
              <button v-if="testData.audioFile" @click.stop="clearAudioFile"
                class="ml-2 text-gray-400 hover:text-red-500" aria-label="Remove file">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Supported formats: MP3, WAV, OGG</p>
      </div>

      <!-- Description Textarea -->
      <div class="group relative">
        <label
          class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 group-focus-within:text-blue-500">
          Description
          <span class="text-gray-400 text-xs ml-1">(Optional)</span>
        </label>
        <div class="relative">
          <textarea v-model="testData.description" rows="6"
            class="w-full px-4 py-3 pr-10 text-base rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none min-h-[150px] leading-relaxed"
            placeholder="Enter a detailed description of the test..." maxlength="500"></textarea>
          <div
            class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-1.5 py-0.5 rounded">
            {{ testData.description ? testData.description.length : 0 }}/500
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Provide additional details about this test</p>
      </div>

      <!-- Add Content Section -->
      <div class="pt-6 mt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Content
          </h3>
          <span class="text-xs text-gray-400 dark:text-gray-500">Select content type</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" @click="openAddPartModal"
            class="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
            <div
              class="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg mb-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Add Part</span>
            <span class="text-xs text-gray-400 mt-0.5">Group questions into parts</span>
          </button>

          <button type="button" @click="$emit('add-question', 0)"
            class="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10">
            <div
              class="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg mb-2 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Add Question</span>
            <span class="text-xs text-gray-400 mt-0.5">Single question</span>
          </button>

          <button type="button" @click="openQuestionSetModal"
            class="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
            <div
              class="w-10 h-10 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg mb-2 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Question Set</span>
            <span class="text-xs text-gray-400 mt-0.5">Multiple questions</span>
          </button>
        </div>
      </div>

      <!-- Save Button -->
      <div class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <p>Make sure all required fields are filled</p>
            <p v-if="!isFormValid" class="text-amber-500 text-xs mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 24 24"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clip-rule="evenodd" />
              </svg>
              <span>Please complete all required fields</span>
            </p>
          </div>
          <button type="button" @click="$emit('save')" :disabled="!isFormValid"
            class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="isSaving" class="animate-spin mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Part Modal -->
    <div v-if="showPartModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="showPartModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button @click="showPartModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Part to Add</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Search Parts
            </label>
            <SearchableSelect :model-value="selectedPart?.id" :options="availableParts" value-key="id" label-key="name"
              placeholder="Search parts..." :loading="isLoading" :has-more="hasMore" @search="handleSearch"
              @select="handleSelectPart" @load-more="handleLoadMore"
              @update:modelValue="(val) => selectedPart = availableParts.find(p => p.id === val)" />
          </div>

          <!-- Selected Part Preview -->
          <div v-if="selectedPart"
            class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-1">{{ selectedPart.name }}</h4>
            <p v-if="selectedPart.description" class="text-sm text-blue-700 dark:text-blue-300">{{
              selectedPart.description }}</p>
            <p v-else class="text-xs text-blue-600/70 dark:text-blue-400/70 italic">No additional description available
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="showPartModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="button" @click="addSelectedPart" :disabled="!selectedPart" :class="[
              'px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              !selectedPart ? 'opacity-50 cursor-not-allowed' : ''
            ]">
              Add Selected Part
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Set Modal -->
    <QuestionSetModal v-if="showQuestionSetModal" :is-open="showQuestionSetModal" @close="showQuestionSetModal = false"
      @select="$emit('select-question-set', $event)" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';
import { getAllTestCategories } from '@/api/admin/test-category/testCategoryApi';
import { getAllSkills } from '@/api/admin/skill/skillApi';
import DropdownMenu from '@/components/admin/common/DropdownMenu.vue';
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue';
import { partApi } from '@/api/admin/part/partApi';
import QuestionSetModal from './QuestionSetModal.vue';

const emit = defineEmits([
  'update:modelValue',
  'save',
  'select-question-set'
]);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '',
      duration: 60,
      testCategoryId: null,
      skillIds: [],
      description: '',
      audioFile: null,
      files: [],
      listPart: [],
      listQuestionAndQuestionSet: []
    })
  },
  isSaving: {
    type: Boolean,
    default: false
  }
});

// Helper function to deep clone while preserving File objects
const deepCloneWithFiles = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof File) return obj; // Preserve File objects
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(item => deepCloneWithFiles(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepCloneWithFiles(obj[key]);
    }
  }
  return cloned;
};

// Create a local copy of the test data for two-way binding
const initialData = deepCloneWithFiles(props.modelValue);
// Ensure skillIds is always an array
if (!initialData.skillIds) {
  initialData.skillIds = [];
}
const testData = ref(initialData);
const testCategories = ref([]);
const availableSkills = ref([]);
const isFormSubmitted = ref(false);
const isCategoryDropdownOpen = ref(false);
const isSkillsDropdownOpen = ref(false);

const selectedCategoryName = computed(() => {
  if (!testData.value.testCategoryId) return '';
  const category = testCategories.value.find(cat => cat.id === testData.value.testCategoryId);
  return category ? `${category.name} (${category.code})` : '';
});

const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
};

const selectCategory = (category) => {
  testData.value.testCategoryId = category.id;
  isCategoryDropdownOpen.value = false;
};

// Skills dropdown and selection
const toggleSkillsDropdown = () => {
  isSkillsDropdownOpen.value = !isSkillsDropdownOpen.value;
};

const selectedSkills = computed(() => {
  if (!testData.value.skillIds || !Array.isArray(testData.value.skillIds)) {
    return [];
  }

  // Check if skillIds contains objects or IDs
  const firstItem = testData.value.skillIds[0];
  if (firstItem && typeof firstItem === 'object') {
    // skillIds contains full skill objects
    return testData.value.skillIds;
  }

  // skillIds contains IDs, filter from available skills
  return availableSkills.value.filter(skill =>
    testData.value.skillIds.includes(skill.id)
  );
});

const isSkillSelected = (skillId) => {
  if (!testData.value.skillIds) return false;

  // Check if skillIds contains objects or IDs
  const firstItem = testData.value.skillIds[0];
  if (firstItem && typeof firstItem === 'object') {
    // skillIds contains full skill objects
    return testData.value.skillIds.some(s => s.id === skillId);
  }

  // skillIds contains IDs
  return testData.value.skillIds.includes(skillId);
};

const toggleSkill = (skill) => {
  if (!testData.value.skillIds) {
    testData.value.skillIds = [];
  }

  // Normalize to array of IDs
  const firstItem = testData.value.skillIds[0];
  if (firstItem && typeof firstItem === 'object') {
    // Convert objects to IDs
    testData.value.skillIds = testData.value.skillIds.map(s => s.id);
  }

  const index = testData.value.skillIds.indexOf(skill.id);
  if (index > -1) {
    testData.value.skillIds.splice(index, 1);
  } else {
    testData.value.skillIds.push(skill.id);
  }
};

const removeSkill = (skillId) => {
  if (!testData.value.skillIds) return;

  // Normalize to array of IDs if needed
  const firstItem = testData.value.skillIds[0];
  if (firstItem && typeof firstItem === 'object') {
    // Convert objects to IDs
    testData.value.skillIds = testData.value.skillIds.map(s => s.id);
  }

  const index = testData.value.skillIds.indexOf(skillId);
  if (index > -1) {
    testData.value.skillIds.splice(index, 1);
  }
};

// Watch for changes in the modelValue prop and update the local copy
watch(() => props.modelValue, (newValue) => {
  // Preserve the current audioFile if it exists
  const currentAudioFile = testData.value.audioFile;
  testData.value = deepCloneWithFiles(newValue);

  // Ensure skillIds is always an array and normalize format
  if (!testData.value.skillIds) {
    testData.value.skillIds = [];
  } else if (Array.isArray(testData.value.skillIds) && testData.value.skillIds.length > 0) {
    const firstItem = testData.value.skillIds[0];
    // If skillIds contains full objects, extract just the IDs for internal use
    if (firstItem && typeof firstItem === 'object' && firstItem.id) {
      testData.value.skillIds = testData.value.skillIds.map(s => s.id);
    }
  }

  // Restore audioFile if it was cleared in the update
  if (currentAudioFile && !testData.value.audioFile) {
    testData.value.audioFile = currentAudioFile;
  }
}, { deep: true, immediate: true });

// Emit update when local data changes
watch(() => ({
  id: testData.value.id,
  title: testData.value.title,
  duration: testData.value.duration,
  testCategoryId: testData.value.testCategoryId,
  skillIds: [...(testData.value.skillIds || [])],
  description: testData.value.description,
  audioFile: testData.value.audioFile,
  files: [...(testData.value.files || [])],
  listPart: [...(testData.value.listPart || [])],
  listQuestionAndQuestionSet: [...(testData.value.listQuestionAndQuestionSet || [])]
}), (newValue) => {
  // Only emit if the values are different
  if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', { ...newValue });
  }
}, { deep: true });

const showPartModal = ref(false);
const showQuestionSetModal = ref(false);
const selectedPart = ref(null);
const availableParts = ref([]);

// Question Set Methods
const openQuestionSetModal = () => {
  showQuestionSetModal.value = true;
};

const handleQuestionSetSave = (questionSet) => {
  emit('add-question-set', questionSet);
  showQuestionSetModal.value = false;
};
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(0);
const totalPages = ref(1);
const hasMore = computed(() => currentPage.value < totalPages.value - 1);
const searchQuery = ref('');

const fetchParts = async (page = 0, search = '') => {
  try {
    isLoading.value = true;
    const response = await partApi.getAllParts(search, {
      page,
      size: 10, // Adjust page size as needed
      sort: 'name,asc' // Default sort
    });

    if (page === 0) {
      availableParts.value = response.content;
    } else {
      availableParts.value = [...availableParts.value, ...response.content];
    }

    totalPages.value = response.totalPages;
    currentPage.value = page;
  } catch (err) {
    error.value = 'Failed to load parts. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

// Fetch test categories
const fetchTestCategories = async () => {
  try {
    const response = await getAllTestCategories();
    testCategories.value = response.data || [];
  } catch (error) {
    console.error('Error fetching test categories:', error);
    // Show error to user
    error.value = 'Failed to load test categories. Please try again later.';
  }
};

// Fetch skills
const fetchSkills = async () => {
  try {
    const response = await getAllSkills();
    availableSkills.value = response.data || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    error.value = 'Failed to load skills. Please try again later.';
  }
};

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = testCategories.value.find(cat => cat.id === categoryId);
  return category ? `${category.name} (${category.code})` : 'Unknown Category';
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.group')) {
    isCategoryDropdownOpen.value = false;
    isSkillsDropdownOpen.value = false;
  }
};

// Initial load
onMounted(async () => {
  await fetchTestCategories();
  await fetchSkills();
  fetchParts();
  document.addEventListener('click', handleClickOutside);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleSearch = (query) => {
  searchQuery.value = query;
  fetchParts(0, query);
};

const handleLoadMore = () => {
  if (!isLoading.value && hasMore.value) {
    fetchParts(currentPage.value + 1, searchQuery.value);
  }
};

const openAddPartModal = () => {
  selectedPart.value = null;
  showPartModal.value = true;
};

const handleSelectPart = (part) => {
  selectedPart.value = part;
};

const addSelectedPart = () => {
  if (!selectedPart.value) return;

  emit('add-part', {
    ...selectedPart.value,
    listQuestionAndQuestionSet: []
  });
  showPartModal.value = false;
};

// Form validation
const isFormValid = computed(() => {
  return testData.value?.title?.trim() !== '' &&
    testData.value?.duration > 0 &&
    testData.value?.testCategoryId;
});

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check file type
  const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
  if (!validTypes.includes(file.type)) {
    // Show error or handle invalid file type
    alert('Please select a valid audio file (MP3, WAV, or OGG)');
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
    return;
  }

  // Check file size (e.g., 10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    alert('File size must be less than 10MB');
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
    return;
  }

  testData.value.audioFile = file;
};

// Clear audio file
const clearAudioFile = () => {
  testData.value.audioFile = null;
  // Reset the file input
  const fileInput = document.querySelector('input[type="file"][accept="audio/*"]');
  if (fileInput) {
    fileInput.value = '';
  }
};

// Handle save with validation
const handleSave = () => {
  if (isFormValid.value) {
    emit('save');
  }
};
</script>

<style scoped>
/* Hide number input spinner */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Textarea placeholder */
textarea::placeholder {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  /* gray-300 */
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
  /* gray-400 */
}

/* Dark mode scrollbar styles */
n.dark textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
  /* gray-600 */
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
  /* gray-500 */
}

/* Firefox scrollbar */
textarea {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  /* gray-300 */
}

.dark textarea {
  scrollbar-color: #4b5563 transparent;
  /* gray-600 */
}
</style>
