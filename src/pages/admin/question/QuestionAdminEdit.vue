<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <ComponentCard title="Edit Question">
    <div class="space-y-6">
      <!-- Question Details -->
      <div class="mb-4.5">
        <!-- Question Prompt -->
        <div class="mb-4.5">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Question Prompt
          </label>
          <Editor v-model="question.prompt" placeholder="Write your question here..."
            class="dark:bg-gray-900 dark:border-gray-700" />
        </div>

        <!-- Question Type and Category -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-4.5">
          <div class="grid grid-cols-2 gap-6">
            <!-- Question Type -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Question Type
              </label>
              <div class="relative z-20 bg-transparent">
                <select name="question-type" v-model="question.type" :disabled="loadingQuestionTypes"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option disabled selected value="">
                    {{ loadingQuestionTypes ? 'Loading...' : 'Select Option' }}
                  </option>
                  <option v-for="type in questionTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
                <span
                  class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-2.5 top-1/2 dark:text-gray-400">
                  <svg class="stroke-current w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                    <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.75"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
            <!-- Question Category -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Category
              </label>
              <SearchableSelect v-model="question.category" :previousValue="previousValue" :options="questionCategories"
                :loading="loadingCategories" :has-more="hasMore" placeholder="Search categories..."
                @search="handleCategorySearch" @load-more="loadMore" />
            </div>
          </div>
          <!-- the multiple choice options section -->
          <div v-if="questionTypes.find(type => type.value === question.type)?.label === QUESTION_TYPES.MULTIPLE_CHOICE"
            class="space-y-4">
            <h5 :class="[
              'text-sm font-medium text-gray-700 dark:text-gray-400',
              { 'mb-0': question.options.length === 0 }
            ]">
              Options
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(option, index) in question.options" :key="option.id" class="flex items-center gap-3">
                <div
                  class="flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                  <div class="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ index + 1 }}
                  </div>
                  <!-- Left Side: Checkbox + Delete -->
                  <div class="flex flex-col items-center gap-3 pt-1">
                    <!-- Correct Checkbox -->
                    <label class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <input type="checkbox" v-model="option.isCorrect" :id="`option-${option.id}`"
                        class="h-4 w-4 rounded border-gray-400 bg-white text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-brand-500 dark:focus:ring-brand-500" />
                    </label>

                    <!-- Delete Button -->
                    <button v-if="question.options.length > 1" @click="removeOption(index)" type="button" class="p-1 rounded-full bg-red-50 text-red-400 
                        hover:bg-red-100 hover:text-red-500 
                        transition-colors duration-150 
                        dark:bg-red-500/10 dark:text-red-300 
                        dark:hover:bg-red-500/20 dark:hover:text-red-200" aria-label="Remove option">
                      <svg role="button" width="14" height="14" viewBox="0 0 14 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                          fill="currentColor" />
                      </svg>
                    </button>
                  </div>

                  <!-- Right Side: Option Input -->
                  <div class="flex-grow">
                    <input type="text" v-model="option.text" :placeholder="`Option ${index + 1}`"
                      class="w-full h-11 rounded-md px-4 py-2 text-sm shadow-sm border border-gray-300 text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90 dark:placeholder-white/30 dark:focus:ring-brand-500" />
                    <label :for="`option-${option.id}`" class="mt-2 block text-xs text-gray-500 dark:text-gray-400">
                      Mark as correct if applicable
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button @click="addOption" type="button" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium 
                text-gray-600/70 dark:text-gray-300/70
                bg-emerald-200/80 dark:bg-emerald-500/20
                hover:bg-emerald-300/90 dark:hover:bg-emerald-500/30
                rounded-lg transition-colors duration-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Add option
            </button>
          </div>
          <!-- Single choice options section -->
          <div v-if="questionTypes.find(type => type.value === question.type)?.label === QUESTION_TYPES.SINGLE_CHOICE"
            class="space-y-4">
            <h5 :class="[
              'text-sm font-medium text-gray-700 dark:text-gray-400',
              { 'mb-0': question.options.length === 0 }
            ]">
              Options
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(option, index) in question.options" :key="option.id" class="flex items-center gap-3">
                <div
                  class="flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                  <div class="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ index + 1 }}
                  </div>
                  <div class="flex flex-col items-center gap-3 pt-1">
                    <label class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <input type="radio" v-model="selectedSingleCorrectId" :value="option.id"
                        class="h-4 w-4 rounded border-gray-400 bg-white text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-brand-500 dark:focus:ring-brand-500" />
                    </label>
                    <button v-if="question.options.length > 1" @click="removeOption(index)" type="button" class="p-1 rounded-full bg-red-50 text-red-400 
                        hover:bg-red-100 hover:text-red-500 
                        transition-colors duration-150 
                        dark:bg-red-500/10 dark:text-red-300 
                        dark:hover:bg-red-500/20 dark:hover:text-red-200" aria-label="Remove option">
                      <svg role="button" width="14" height="14" viewBox="0 0 14 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                          fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex-grow">
                    <input type="text" v-model="option.text" :placeholder="`Option ${index + 1}`"
                      class="w-full h-11 rounded-md px-4 py-2 text-sm shadow-sm border border-gray-300 text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90 dark:placeholder-white/30 dark:focus:ring-brand-500" />
                  </div>
                </div>
              </div>
            </div>
            <button @click="addOption" type="button" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium 
                text-gray-600/70 dark:text-gray-300/70
                bg-emerald-200/80 dark:bg-emerald-500/20
                hover:bg-emerald-300/90 dark:hover:bg-emerald-500/30
                rounded-lg transition-colors duration-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Add option
            </button>
          </div>
          <!-- the fill-in blank section -->
          <div v-if="questionTypes.find(type => type.value === question.type)?.label === QUESTION_TYPES.FILL_IN_THE_BLANK"
            class="space-y-4">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-400">Fill in the blank answers</h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(blank, index) in question.blanks" :key="index" class="flex items-center gap-3">
                <div
                  class="flex w-full items-center gap-3 rounded-lg border p-4 shadow-sm bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                  <!-- Remove Button on the Left -->
                  <button @click="removeBlank(index)" type="button" class="p-1 rounded-full bg-red-50 text-red-400 
                      hover:bg-red-100 hover:text-red-500 
                      transition-colors duration-150 
                      dark:bg-red-500/10 dark:text-red-300 
                      dark:hover:bg-red-500/20 dark:hover:text-red-200" aria-label="Remove blank">
                    <svg role="button" width="14" height="14" viewBox="0 0 14 14" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                        fill="currentColor" />
                    </svg>
                  </button>

                  <!-- Input on the Right -->
                  <div class="flex-grow">
                    <input type="text" v-model="blank.answer" :placeholder="`Answer ${index + 1}`"
                      class="w-full h-11 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90 dark:placeholder-white/30 dark:focus:ring-brand-500" />
                  </div>
                </div>
              </div>
            </div>

            <button @click="addBlank" type="button" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium 
                text-gray-600/70 dark:text-gray-300/70
                bg-emerald-200/80 dark:bg-emerald-500/20
                hover:bg-emerald-300/90 dark:hover:bg-emerald-500/30
                rounded-lg transition-colors duration-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Add blank
            </button>
          </div>
        </div>

        <!-- Score Field -->
        <div class="mb-4f.5">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Score
          </label>
          <input type="number" v-model="question.score" placeholder="Enter question score"
            class="no-spinner w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90 dark:placeholder-white/30 dark:focus:ring-brand-500" />
        </div>

        <!-- Audio Files -->
        <div class="mb-4.5">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Audio Files
          </label>
          <AudioUploader :max-files="1" :max-size="20" :show-progress="true" :auto-upload="false"
            :initial-files="question.audioFiles" class="dark:border-gray-700" @files-added="handleAudioFilesAdded" 
            @file-removed="handleAudioFileRemoved" @error="handleAudioUploadError" @clear-all="handleClearAudio" />
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="flex justify-end gap-4">
        <button @click="cancel"
          class="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          Cancel
        </button>

        <button @click="updateQuestion"
          class="rounded-lg bg-blue-500 px-6 py-2.5 font-medium text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 dark:text-white/90">
          Update Question
        </button>
      </div>
    </div>
  </ComponentCard>
</template>

<script setup>
import { ref, watch, onMounted, mergeProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { QUESTION_TYPES } from '@/constants/question.constants'
import PageBreadcrumb from '@/components/admin/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/admin/common/ComponentCard.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import AudioUploader from '@/components/admin/forms/DropnDrapElements/AudioUploader.vue'
import { questionCategoryApi } from '@/api/admin/question-category/questionCategoryApi'
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue'
import Editor from '@/components/admin/common/Editor.vue'
import { useToast } from 'vue-toastification'
import { questionApi } from '@/api/admin/question/questionApi'
import { questionTypeApi } from '@/api/admin/question-type/questionTypeApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const currentPageTitle = ref('Question Detail')
const loadingQuestionTypes = ref(true)
const loadingCategories = ref(true)
const questionId = ref(route.params.id)
const isPageLoading = ref(true)
const deletedFiles = ref([])

const question = ref({
  score: 1,
  prompt: '',
  category: null,
  type: null,
  options: [],
  blanks: [],
  audioFiles: []
})

// Track selected answer for Single Choice
const selectedSingleCorrectId = ref(null)

const questionTypes = ref([])
const questionCategories = ref([])
const previousValue = ref('')

// Fetch question details
const fetchQuestion = async () => {
  try {
    isPageLoading.value = true;
    const { data: responseData, success, message } = await questionApi.getById(questionId.value);
    
    if (!success) {
      throw new Error(message || 'Failed to fetch question details');
    }

    if (responseData) {
      question.value = {
        score: responseData.score,
        prompt: responseData.prompt || '',
        category: responseData.questionCategory ? responseData.questionCategory.id : null,
        type: responseData.questionType ? responseData.questionType.id : null,
        blanks: (responseData.questionAnswers || []).map(blank => ({
          answer: blank || ''
        })),
        options: (responseData.options || []).map(option => ({
          ...option,
          isCorrect: option.correct || false
        })),
        audioFiles: (responseData.questionAudios || []).map(audio => ({
          id: audio.id,
          name: audio.fileName,
          size: audio.fileSize,
          type: audio.fileType,
          originalName: audio.fileName,
          uploaded: true,
          progress: 100
        }))
      };

      previousValue.value = responseData.questionCategory?.name || '';

      // Initialize options or blanks based on question type
      if (responseData.type === 'multiple_choice') {
        question.value.options = responseData.options || [];
      } else if (responseData.type === 'fill_in_blank') {
        question.value.blanks = responseData.answers || [];
      }

      // Initialize selectedSingleCorrectId from data if any single-correct present
      const existingCorrect = (question.value.options || []).find(o => o.isCorrect)
      if (existingCorrect) {
        selectedSingleCorrectId.value = existingCorrect.id
      }
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    toast.error(error.message || 'Failed to load question details', {
      timeout: 3000,
      position: 'top-right'
    });
  } finally {
    isPageLoading.value = false;
  }
}

// Fetch question types
const fetchQuestionTypes = async () => {
  try {
    loadingQuestionTypes.value = true;
    const { data: responseData, success, message } = await questionTypeApi.getAll({
      size: 100,
      sort: 'name',
      direction: 'asc'
    });
    
    if (!success) {
      throw new Error(message || 'Failed to fetch question types');
    }

    if (responseData && Array.isArray(responseData.content)) {
      questionTypes.value = responseData.content.map(type => ({
        value: type.id,
        label: type.name
      }));
    }
  } catch (error) {
    console.error('Error fetching question types:', error);
    toast.error(error.message || 'Failed to fetch question types', {
      timeout: 3000,
      position: 'top-right'
    });
  } finally {
    loadingQuestionTypes.value = false;
  }
}


// Fetch question categories
const fetchQuestionCategories = async () => {
  try {
    loadingCategories.value = true;
    const { data: responseData, success, message } = await questionCategoryApi.getAll({
      search: previousValue.value,
      size: 10,
      sort: 'name',
      direction: 'asc'
    });
    
    if (!success) {
      throw new Error(message || 'Failed to fetch categories');
    }

    if (responseData && Array.isArray(responseData.content)) {
      questionCategories.value = responseData.content.map(category => ({
        value: category.id,
        label: category.name
      }));
      
      hasMore.value = responseData.totalPages > 1;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error(error.message || 'Failed to fetch categories', {
      timeout: 3000,
      position: 'top-right'
    });
  } finally {
    loadingCategories.value = false;
  }
}

const page = ref(0)
const hasMore = ref(true)
// Handle category search
const handleCategorySearch = async (searchQuery) => {
  try {
    loadingCategories.value = true;
    const { data: responseData, success, message } = await questionCategoryApi.getAll({
      search: searchQuery,
      size: 10,
      sort: 'name',
      direction: 'asc'
    });
    
    if (!success) {
      throw new Error(message || 'Failed to search categories');
    }

    if (responseData && Array.isArray(responseData.content)) {
      questionCategories.value = responseData.content.map(category => ({
        value: category.id,
        label: category.name
      }));
      
      page.value = 0;
      hasMore.value = responseData.totalPages > 1;
    }
  } catch (error) {
    console.error('Error searching categories:', error);
    toast.error(error.message || 'Failed to search categories', {
      timeout: 3000,
      position: 'top-right'
    });
  } finally {
    loadingCategories.value = false;
  }
};

// Load more categories (pagination)
const loadMore = async (searchQuery) => {
  try {
    loadingCategories.value = true;
    const { data: responseData, success, message } = await questionCategoryApi.getAll({
      size: 10,
      page: page.value + 1,
      search: searchQuery,
      sort: 'name',
      direction: 'asc'
    });
    
    if (!success) {
      throw new Error(message || 'Failed to load more categories');
    }

    if (responseData && Array.isArray(responseData.content)) {
      questionCategories.value = [
        ...questionCategories.value, 
        ...responseData.content.map(category => ({
          value: category.id,
          label: category.name
        }))
      ];
      
      page.value++;
      hasMore.value = responseData.content.length === 10;
    }
  } catch (error) {
    console.error('Error loading more categories:', error);
    toast.error(error.message || 'Failed to load more categories', {
      timeout: 3000,
      position: 'top-right'
    });
  } finally {
    loadingCategories.value = false;
  }
}

// Handle form submission
const updateQuestion = async () => {
  if (!validateForm()) return;

  try {
    const payload = {
      prompt: question.value.prompt,
      questionTypeId: question.value.type || '',
      categoryId: question.value.category || '',
      options: (question.value.options || []).map((o, i) => ({
        text: o.text,
        correct: !!o.isCorrect,
        displayOrder: typeof o.displayOrder === 'number' ? o.displayOrder : (i + 1)
      })),
      blanks: question.value.blanks?.map(b => b.answer) || [],
      audios: question.value.audioFiles || [],
      score: question.value.score,
      deletedFileIds: deletedFiles.value
    };

    const { success, message, data } = await questionApi.update(questionId.value, payload);
    
    if (!success) {
      throw new Error(message || 'Failed to update question');
    }

    toast.success(message || 'Question updated successfully', {
      timeout: 3000,
      position: 'top-right'
    });
    
    // Uncomment when ready to navigate
    // router.push({ name: 'admin-question-list' });
  } catch (error) {
    console.error('Error updating question:', error);
    toast.error(error.message || 'Failed to update question', {
      timeout: 3000,
      position: 'top-right'
    });
  }
}

// Form validation
const validateForm = () => {
  if (!question.value.prompt.trim()) {
    toast.error('Question prompt is required')
    return false
  }

  if (!question.value.type) {
    toast.error('Please select a question type')
    return false
  }

  if (!question.value.category) {
    toast.error('Please select a category')
    return false
  }

  const type = questionTypes.value.find(t => t.value === question.value.type)?.label

  if (type === QUESTION_TYPES.MULTIPLE_CHOICE && (!question.value.options || question.value.options.length < 2)) {
    toast.error('At least two options are required for multiple choice questions')
    return false
  }

  if (type === QUESTION_TYPES.MULTIPLE_CHOICE && !question.value.options.some(opt => opt.isCorrect)) {
    toast.error('At least one option must be marked as correct')
    return false
  }

  if (type === QUESTION_TYPES.FILL_IN_THE_BLANK) {
    if (!question.value.blanks || question.value.blanks.length === 0) {
      toast.error('At least one blank answer is required')
      return false
    }
    
    // Check if any blank is empty
    const emptyBlank = question.value.blanks.some(blank => !blank.answer || !blank.answer.trim())
    if (emptyBlank) {
      toast.error('Blank answers cannot be empty')
      return false
    }
  }

  if (!question.value.score || question.value.score <= 0) {
    toast.error('Please enter a valid score')
    return false
  }

  // Validate audio files
  // if (!question.value.audioFiles || question.value.audioFiles.length === 0) {
  //   toast.error('At least one audio file is required')
  //   return false
  // }

  // Validate each audio file
  for (const file of question.value.audioFiles) {

    // Check file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/mp3']
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Only MP3, WAV, and AAC audio files are allowed')
      return false
    }

    // Check file size (20MB max)
    const maxSize = 20 * 1024 * 1024 // 20MB in bytes
    if (file.size > maxSize) {
      toast.error('Audio file size must be less than 20MB')
      return false
    }
  }

  return true
}

// Navigation
const cancel = () => {
  router.go(-1) // Go back to previous page
}

// Audio file handlers
const handleAudioFilesAdded = (files) => {
  // Handle audio file uploads
  question.value.audioFiles = [...(question.value.audioFiles || []), ...files]
}

const handleAudioFileRemoved = (file) => {
  // If the file was previously uploaded, add its ID to deletedFiles
  if (file.uploaded && file.id) {
    deletedFiles.value.push(file.id)
  }
  // Remove the file from the question.audioFiles array
  question.value.audioFiles = question.value.audioFiles.filter(f => f !== file)
}

const handleClearAudio = () => {
  // Clear all audio files
  question.value.audioFiles = []
}

const handleAudioUploadError = (error) => {
  console.error('Audio upload error:', error)
  toast.error('Failed to upload audio file')
}

// Initialize component
onMounted(async () => {
  try {
    await fetchQuestion()
    await Promise.all([
      fetchQuestionTypes(),
      fetchQuestionCategories()
    ])
  } catch (error) {
    console.error('Error initializing component:', error)
    isPageLoading.value = false
  }
})

// Watch for question type changes to initialize appropriate fields
watch(() => question.value.type, (newType) => {
  const typeName = questionTypes.value.find(type => type.value === newType)?.label

  if (typeName === QUESTION_TYPES.MULTIPLE_CHOICE) {
    if (!question.value.options || question.value.options.length === 0) {
      initializeMultipleChoiceOptions()
    }
  } else if (typeName === QUESTION_TYPES.SINGLE_CHOICE) {
    if (!question.value.options || question.value.options.length === 0) {
      initializeSingleChoiceOptions()
    } else {
      // Ensure exactly one is selected based on selectedSingleCorrectId
      const first = question.value.options[0]
      if (selectedSingleCorrectId.value == null && first) {
        selectedSingleCorrectId.value = first.id
      }
      question.value.options = question.value.options.map(o => ({
        ...o,
        isCorrect: selectedSingleCorrectId.value != null && o.id === selectedSingleCorrectId.value
      }))
    }
  } else if (typeName === QUESTION_TYPES.FILL_IN_THE_BLANK) {
    if (!question.value.blanks || question.value.blanks.length === 0) {
      initializeFillBlankAnswers()
    }
  }
})

// Initialize multiple choice options
const initializeMultipleChoiceOptions = () => {
  question.value.options = [
    { id: Date.now(), text: '', isCorrect: false, displayOrder: 1 },
  ]
}

const initializeSingleChoiceOptions = () => {
  const id = Date.now()
  question.value.options = [
    { id, text: '', isCorrect: true, displayOrder: 1 },
  ]
  selectedSingleCorrectId.value = id
}

// Initialize fill in the blank answers
const initializeFillBlankAnswers = () => {
  question.value.blanks = [{ answer: '' }]
}

// Add/remove options for multiple choice
const addOption = () => {
  const nextOrder = (question.value.options?.length || 0) + 1
  question.value.options.push({
    id: Date.now(),
    text: '',
    isCorrect: false,
    displayOrder: nextOrder
  })
}

const removeOption = (index) => {
  if (question.value.options.length > 1) {
    const removed = question.value.options.splice(index, 1)[0]
    // Reindex displayOrder
    question.value.options = question.value.options.map((o, i) => ({ ...o, displayOrder: i + 1 }))
    // If Single Choice and removed was selected, select first remaining
    const typeName = questionTypes.value.find(type => type.value === question.value.type)?.label
    if (typeName === QUESTION_TYPES.SINGLE_CHOICE && removed && removed.id === selectedSingleCorrectId.value) {
      const first = question.value.options[0]
      selectedSingleCorrectId.value = first ? first.id : null
      question.value.options = question.value.options.map(o => ({ ...o, isCorrect: first ? o.id === first.id : false }))
    }
  }
}

// Keep Single Choice radio selection in sync with option.isCorrect
watch(selectedSingleCorrectId, (newId) => {
  const typeName = questionTypes.value.find(type => type.value === question.value.type)?.label
  if (typeName === QUESTION_TYPES.SINGLE_CHOICE) {
    question.value.options = question.value.options.map(o => ({
      ...o,
      isCorrect: o.id === newId
    }))
  }
})

// Add/remove blanks for fill in the blank
const addBlank = () => {
  question.value.blanks.push({ answer: '' })
}

const removeBlank = (index) => {
  if (question.value.blanks.length > 1) {
    question.value.blanks.splice(index, 1)
  }
}
</script>

<style scoped>
/* Add any custom styles here */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
}
</style>
