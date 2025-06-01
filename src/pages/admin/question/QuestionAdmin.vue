<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <ComponentCard title="Create Question for Exam Bank">
    <div class="space-y-6">
      <!-- Question Details -->
      <div class="mb-4.5">
        <!-- Question Prompt -->
        <div class="mb-4.5">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Question Prompt
          </label>
          <textarea v-model="question.prompt" rows="4" placeholder="Enter question text"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
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
              <div class="relative z-20 bg-transparent">
                <select name="question-category" v-model="question.category"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option disabled="" selected="" value="">Select Option</option>
                  <option v-for="category in questionCategories" :key="category.value" :value="category.value">
                    {{ category.label }}
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
          </div>

          <!-- Replace the multiple choice options section -->
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
                    <button v-if="question.options.length > 4" @click="removeOption(index)" type="button"
                      class="text-red-500 hover:text-red-600 transition-colors duration-150" aria-label="Remove option">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd" />
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
            <button @click="addOption" type="button"
              class="text-primary dark:text-white/90 hover:bg-primary/5 dark:hover:bg-transparent inline-flex items-center gap-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd" />
              </svg>
              Add option
            </button>
          </div>

          <!-- Replace the fill-in blank section -->
          <div v-if="question.type === 'fill_blank'" class="space-y-4">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-400">Fill-In-the Blank Answers</h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(blank, index) in question.blanks" :key="index" class="flex items-center gap-3">
                <div
                  class="flex w-full items-center gap-3 rounded-lg border p-4 shadow-sm bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                  <!-- Remove Button on the Left -->
                  <button @click="removeBlank(index)" type="button"
                    class="text-red-500 hover:text-red-600 transition-colors duration-150" aria-label="Remove blank">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
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

            <button @click="addBlank" type="button"
              class="text-primary hover:bg-primary/5 dark:text-white/90 dark:hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd" />
              </svg>
              Add blank
            </button>
          </div>
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
import { ref, reactive, watch } from 'vue'
import PageBreadcrumb from '@/components/admin/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/admin/common/ComponentCard.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const addOption = () => {
  const newId = Math.max(...question.value.options.map(o => o.id)) + 1
  question.value.options.push({
    id: newId,
    text: '',
    isCorrect: false
  })
}

// Add this function in the script setup section
const removeBlank = (index) => {
  question.value.blanks.splice(index, 1)
}

const removeOption = (index) => {
  question.value.options.splice(index, 1)
}

const initializeMultipleChoiceOptions = () => {
  question.value.options = [
    { id: 1, text: '', isCorrect: false },
    { id: 2, text: '', isCorrect: false },
    { id: 3, text: '', isCorrect: false },
    { id: 4, text: '', isCorrect: false }
  ]
}

// Add this function after initializeMultipleChoiceOptions
const initializeFillBlankAnswers = () => {
  question.value.blanks = [
    { id: 1, answer: '' }
  ]
}

const question = ref({
  prompt: '',
  type: '',
  clipNumber: '',
  correctOptions: '',
  assignedTests: '',
  assignedParts: '',
  options: [],
  blanks: [],
})

// Update the existing watch function
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
})

const currentPageTitle = ref('Create Question for Exam Bank')
const formData = reactive({
  input: '',
  inputWithPlaceholder: '',
  selectInput: '',
  password: '',
  date: '',
  time: '',
  cardNumber: '',
})

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'fill_blank', label: 'Fill in the Blank' }
]

const tests = ref([
  { value: 'test1', label: 'Test 1' },
  { value: 'test2', label: 'Test 2' }
])

const testParts = ref([
  { value: 'part1', label: 'Part 1' },
  { value: 'part2', label: 'Part 2' }
])

const addBlank = () => {
  question.value.blanks.push({ answer: '' })
}

const saveQuestion = () => {
  console.log('Saving question:', question.value)
}

const cancel = () => {
  console.log('Cancel clicked')
}
</script>
