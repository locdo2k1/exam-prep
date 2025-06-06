<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <ComponentCard title="Question Detail">
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
                <select name="question-type" v-model="question.type"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option disabled="" selected="" value="">Select Option</option>
                  <option v-for="type in questionTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
                <span
                  class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                  <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5"
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
              <SearchableSelect v-model="question.category" :options="questionCategories" :loading="loadingCategories"
                :has-more="hasMore" placeholder="Search categories..." @search="handleCategorySearch"
                @load-more="loadMore" />
            </div>
          </div>
          <!-- the multiple choice options section -->
          <div v-if="question.type === 'multiple_choice'" class="space-y-4">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-400">Options</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(option, index) in question.options" :key="option.id" class="flex items-center gap-3">
                <div
                  class="flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                  <!-- Left Side: Checkbox + Delete -->
                  <div class="flex flex-col items-center gap-3 pt-1">
                    <!-- Correct Checkbox -->
                    <label class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <input type="checkbox" v-model="option.isCorrect" :id="`option-${option.id}`"
                        class="h-4 w-4 rounded border-gray-400 bg-white text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-brand-500 dark:focus:ring-brand-500" />
                    </label>

                    <!-- Delete Button -->
                    <button v-if="question.options.length > 4" @click="removeOption(index)" type="button" class="p-1 rounded-full bg-red-50 text-red-400 
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
          <!-- the fill-in blank section -->
          <div v-if="question.type === 'fill_blank'" class="space-y-4">
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

        <!-- Audio Files -->
        <div class="mb-4.5">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Audio Files
          </label>
          <AudioUploader :max-files="1" :max-size="20" :show-progress="true" :auto-upload="false"
            class="dark:border-gray-700" @files-added="handleAudioFilesAdded" @file-removed="handleAudioFileRemoved"
            @error="handleAudioUploadError" @clear-all="handleClearAudio" />
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="flex justify-end gap-4">
        <button @click="cancel"
          class="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          Cancel
        </button>

        <button @click="saveQuestion"
          class="rounded-lg bg-blue-500 px-6 py-2.5 font-medium text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 dark:text-white/90">
          Save Question
        </button>
      </div>
    </div>
  </ComponentCard>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import PageBreadcrumb from '@/components/admin/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/admin/common/ComponentCard.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import AudioUploader from '@/components/admin/forms/DropnDrapElements/AudioUploader.vue'
import { questionCategoryApi } from '@/api/admin/question-category/questionCategoryApi'
import SearchableSelect from '@/components/admin/forms/FormElements/SearchableSelect.vue'
import Editor from '@/components/admin/common/Editor.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const question = ref({
  prompt: '', // This will store the editor content
  type: '',
  category: '',
  clipNumber: '',
  correctOptions: '',
  parts: [],
  tests: [],
  options: [],
  blanks: [],
  audioFiles: []
})

const parts = ref([]);
const questionCategories = ref([])
const loadingCategories = ref(false)

const validationErrors = ref({
  prompt: '',
  type: '',
  category: '',
  options: '',
  blanks: ''
})

const addOption = () => {
  try {
    const newId = Math.max(...question.value.options.map(o => o.id)) + 1
    question.value.options.push({
      id: newId,
      text: '',
      isCorrect: false
    })
    toast.info('New option added', { timeout: 1500 })
  } catch (error) {
    toast.error('Failed to add option', { timeout: 2000 })
  }
}

const removeOption = (index) => {
  try {
    question.value.options.splice(index, 1)
    toast.info('Option removed', { timeout: 1500 })
  } catch (error) {
    toast.error('Failed to remove option', { timeout: 2000 })
  }
}

const initializeMultipleChoiceOptions = () => {
  question.value.options = [
    { id: 1, text: '', isCorrect: false },
    { id: 2, text: '', isCorrect: false },
    { id: 3, text: '', isCorrect: false },
    { id: 4, text: '', isCorrect: false }
  ]
}

const initializeFillBlankAnswers = () => {
  question.value.blanks = [
    { id: 1, answer: '' }
  ]
}

watch(() => question.value.type, (newType) => {
  if (newType === 'multiple_choice') {
    initializeMultipleChoiceOptions()
    question.value.blanks = []
  } else if (newType === 'fill_blank') {
    initializeFillBlankAnswers()
    question.value.options = []
  } else {
    question.value.options = []
    question.value.blanks = []
  }
},)

watch(() => question.value.options, (newOptions) => {
  if (newOptions.length === 0) {
    initializeMultipleChoiceOptions()
  }
}, { deep: true })

const handlePartsChange = (newParts) => {
  question.value.parts = newParts
}

const currentPageTitle = ref('Create Question for Exam Bank')

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'fill_blank', label: 'Fill in the Blank' }
]

const addBlank = () => {
  try {
    question.value.blanks.push({ answer: '' })
    toast.info('New blank added', { timeout: 1500 })
  } catch (error) {
    toast.error('Failed to add blank', { timeout: 2000 })
  }
}

const removeBlank = (index) => {
  try {
    question.value.blanks.splice(index, 1)
    toast.info('Blank removed', { timeout: 1500 })
  } catch (error) {
    toast.error('Failed to remove blank', { timeout: 2000 })
  }
}

const validateForm = () => {
  // Reset all validation errors
  validationErrors.value = {
    prompt: '',
    type: '',
    category: '',
    options: '',
    blanks: ''
  }

  let isValid = true
  const errors = []

  if (!question.value.prompt.trim()) {
    validationErrors.value.prompt = 'Question prompt is required'
    errors.push('Question prompt is required')
    isValid = false
  }

  if (!question.value.type) {
    validationErrors.value.type = 'Question type is required'
    errors.push('Question type is required')
    isValid = false
  }

  if (!question.value.category) {
    validationErrors.value.category = 'Category is required'
    errors.push('Category is required')
    isValid = false
  }

  if (question.value.type === 'multiple_choice') {
    if (question.value.options.some(option => !option.text.trim())) {
      validationErrors.value.options = 'All options must be filled'
      errors.push('All options must be filled')
      isValid = false
    }

    if (!question.value.options.some(option => option.isCorrect)) {
      validationErrors.value.options = 'Select at least one correct answer'
      errors.push('Select at least one correct answer')
      isValid = false
    }
  }

  if (question.value.type === 'fill_blank') {
    if (question.value.blanks.some(blank => !blank.answer.trim())) {
      validationErrors.value.blanks = 'All blanks must be filled'
      errors.push('All blanks must be filled')
      isValid = false
    }
  }

  // Show all validation errors as toasts
  if (!isValid) {
    errors.forEach(error => {
      toast.error(error, {
        timeout: 3000,
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    })
  }

  return isValid
}

const saveQuestion = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // Add your API call here
    // await questionApi.create(question.value)

    toast.success('Question saved successfully', {
      timeout: 2000,
      position: "top-right",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

    // Optional: Reset form or redirect
    // resetForm() or router.push('/questions')

  } catch (error) {
    toast.error('Failed to save question. Please try again.', {
      timeout: 3000,
      position: "top-right",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    console.error('Error saving question:', error)
  }
}

const cancel = () => {
  console.log('Cancel clicked')
}

const handleAudioFilesAdded = (files) => {
  console.log('Audio files added:', files)
  question.value.audioFiles.push(files);
}

const handleAudioFileRemoved = (file) => {
  console.log('Audio file removed:', file)
  question.value.audioFiles = question.value.audioFiles.filter((audio) => audio !== file);
}

const handleClearAudio = () => {
  question.value.audioFiles = []
  toast.info('Audio files cleared', { timeout: 1500 })
}

const handleAudioUploadError = (error) => {
  toast.error(`Audio upload error: ${error.message || 'Unknown error'}`, {
    timeout: 3000,
    position: "top-right",
  })
  console.error('Audio upload error:', error)
}

const fetchQuestionCategories = async () => {
  try {
    loadingCategories.value = true
    const response = await questionCategoryApi.getAll({
      size: 10
    })
    questionCategories.value = response.content.map(category => ({
      value: category.id,
      label: category.name
    }))
  } catch (error) {
    toast.error('Failed to fetch categories', {
      timeout: 3000,
      position: "top-right",
    })
    console.error('Error fetching categories:', error)
  } finally {
    loadingCategories.value = false
  }
}

onMounted(() => {
  fetchQuestionCategories()
})

const page = ref(0)
const hasMore = ref(true)

const loadMore = async (searchQuery) => {
  const response = await questionCategoryApi.getAll({
    size: 10,
    page: page.value + 1,
    search: searchQuery
  })
  questionCategories.value = [...questionCategories.value, ...response.content.map(category => ({
    value: category.id,
    label: category.name
  }))]
  page.value++
  hasMore.value = response.content.length === 10
}

const handleCategorySearch = async (searchQuery) => {
  try {
    loadingCategories.value = true
    const response = await questionCategoryApi.getAll({
      search: searchQuery,
      size: 10
    })
    questionCategories.value = response.content.map(category => ({
      value: category.id,
      label: category.name
    }))
    page.value = 0
    hasMore.value = response.totalPages > 1
  } catch (error) {
    toast.error('Failed to search categories', {
      timeout: 3000,
      position: "top-right",
    })
    console.error('Error searching categories:', error)
  } finally {
    loadingCategories.value = false
  }
};


</script>

<style scoped>
/* Add these styles if needed for editor spacing */
:deep(.editor-container) {
  margin-bottom: 1rem;
}
</style>
