<template>
  <div
    class="w-full h-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
    <div class="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 h-full">
      <!-- Left Column - Quill Editor -->
      <div class="p-6 flex flex-col h-full overflow-hidden">
        <div class="mb-4 flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Question Set Content
          </h2>
        </div>
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <QuillEditor ref="quillEditor" v-model:content="questionContent" :options="editorOptions" contentType="html"
            class="flex-1 bg-white dark:bg-gray-800 overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700" />
        </div>
      </div>

      <!-- Right Column - Question Selection List -->
      <div class="bg-gray-50 dark:bg-gray-800 p-6 flex flex-col h-full overflow-hidden">
        <div class="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Select Questions
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedQuestions.length }} selected</span>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
          <div v-for="(question, index) in questions" :key="index"
            class="flex items-start p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-150 cursor-pointer"
            :class="{ 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30': selectedQuestions.includes(index) }"
            @click="toggleQuestionSelection(index)">
            <div class="flex items-center h-5 mr-3">
              <input type="checkbox"
                class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                :checked="selectedQuestions.includes(index)" @change.stop="toggleQuestionSelection(index)" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {{ index + 1 }}. {{ question.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageResize from 'quill-image-resize-vue'

// Register the image resize module
Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'QuestionSet',
  components: {
    QuillEditor
  },
  provide() {
    return {
      isDark: this.isDark
    };
  },
  data() {
    return {
      isMobile: window.innerWidth < 1024,
      isDark: document.documentElement.classList.contains('dark'),
      questionContent: '<h2>Listening Test - Part 1</h2><p>Look at the picture and answer the questions below.</p>',
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ],
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        },
        placeholder: 'Type your content here...',
        theme: 'snow'
      },
      selectedQuestions: [],
      questions: [
        { text: 'Look at the picture and answer the questions' },
        { text: 'What is the woman doing?' },
        { text: 'Where is the cat?' },
        { text: 'What color is the chair?' },
        { text: 'How many people are in the car?' },
      ]
    };
  },
  watch: {
    isDark: {
      immediate: true,
      handler(isDark) {
        const quill = this.$refs.quillEditor?.getQuill();
        if (quill) {
          quill.theme.quill.container.classList.toggle('dark', isDark);
        }
      }
    }
  },
  methods: {
    toggleQuestionSelection(index) {
      const selected = this.selectedQuestions
      const position = selected.indexOf(index)
      if (position === -1) {
        selected.push(index)
      } else {
        selected.splice(position, 1)
      }
      this.selectedQuestions.sort((a, b) => a - b)
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
};
</script>

<style scoped>
/* Quill Editor Styles */
:deep(.ql-container.ql-snow) {
  border: none;
  background-color: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0;
}

:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid rgb(229 231 235);
  margin-bottom: 0;
  background-color: white;
  border-radius: 0;
}

.dark :deep(.ql-toolbar.ql-snow) {
  background-color: rgb(31 41 55);
  border-bottom-color: rgb(55 65 81);
}

:deep(.ql-editor) {
  flex: 1;
  background-color: white;
  color: rgb(17 24 39);
}

.dark :deep(.ql-editor) {
  background-color: rgb(31 41 55);
  color: rgb(229 231 235);
}

:deep(.ql-snow .ql-stroke) {
  stroke: rgb(75 85 99);
}

.dark :deep(.ql-snow .ql-stroke) {
  stroke: rgb(156 163 175);
}

:deep(.ql-snow .ql-fill),
:deep(.ql-snow .ql-stroke.ql-fill) {
  fill: rgb(75 85 99);
}

.dark :deep(.ql-snow .ql-fill),
.dark :deep(.ql-snow .ql-stroke.ql-fill) {
  fill: rgb(156 163 175);
}

:deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
  stroke: rgb(59 130 246);
}

.dark :deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
  stroke: rgb(96 165 250);
}

:deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
  stroke: rgb(37 99 235);
}

.dark :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
  stroke: rgb(59 130 246);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 0.375rem;
  height: 0.375rem;
}

::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-track {
  background-color: rgb(55 65 81);
}

::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgb(107 114 128);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .question-set :deep(.ql-container) {
    min-height: 300px;
  }
}
</style>
