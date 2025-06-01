<template>
  <div>
    <div
      class="relative overflow-hidden cursor-pointer rounded-2xl border-3 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 md:p-12 text-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      :class="{
        'border-primary/60 bg-primary/5 dark:border-primary/40 dark:bg-primary/5 transform scale-[1.02]': isDragOver,
        'border-red-500 dark:border-red-500': error
      }" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" @click="openFileDialog">
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 transition-opacity duration-300 z-0"
        :class="{ 'opacity-10': isDragOver }"></div>

      <!-- Content -->
      <div class="relative z-10">
        <!-- Upload Icon -->
        <div
          class="mx-auto mb-4 h-16 w-16 md:h-[64px] md:w-[64px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <slot name="icon">
            <span class="text-2xl text-white">📁</span>
          </slot>
        </div>

        <!-- Text Content -->
        <div class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {{ placeholderText }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ subtext }}
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input ref="fileInput" type="file" :accept="getAcceptAttribute()" :multiple="maxFiles > 1" @change="handleFileInput"
      class="hidden" />

    <!-- Error Message -->
    <div v-if="error"
      class="mt-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DragDropZone',
  props: {
    acceptedTypes: {
      type: Array,
      default: () => ['*']
    },
    maxFiles: {
      type: Number,
      default: 10
    },
    maxSize: {
      type: Number,
      default: 25 // MB
    },
    placeholderText: {
      type: String,
      default: 'Drag & drop files here'
    },
    subtext: {
      type: String,
      default: 'or click to browse'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['files-dropped', 'error'],
  setup(props, { emit }) {
    const isDragOver = ref(false)
    const error = ref('')
    const fileInput = ref(null)

    const handleDragOver = (e) => {
      if (props.disabled) return
      e.preventDefault()
      isDragOver.value = true
    }

    const handleDragLeave = (e) => {
      if (props.disabled) return
      e.preventDefault()
      if (!e.currentTarget.contains(e.relatedTarget)) {
        isDragOver.value = false
      }
    }

    const handleDrop = (e) => {
      if (props.disabled) return
      e.preventDefault()
      isDragOver.value = false

      const files = Array.from(e.dataTransfer.files)
      processFiles(files)
    }

    const handleFileInput = (e) => {
      const target = e.target
      const files = target.files ? Array.from(target.files) : []
      if (props.disabled) return
      processFiles(files)
      target.value = '' // Reset input
    }

    const processFiles = (files) => {
      error.value = ''

      // Check file count
      if (files.length > props.maxFiles) {
        const errorMsg = `Maximum ${props.maxFiles} files allowed`
        error.value = errorMsg
        emit('error', errorMsg)
        return
      }

      // Validate files
      const validFiles = []
      for (const file of files) {
        if (!isValidFileType(file)) {
          const errorMsg = `File type "${file.type}" not allowed`
          error.value = errorMsg
          emit('error', errorMsg)
          return
        }

        if (file.size > props.maxSize * 1024 * 1024) {
          const errorMsg = `File "${file.name}" exceeds ${props.maxSize}MB limit`
          error.value = errorMsg
          emit('error', errorMsg)
          return
        }

        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        emit('files-dropped', validFiles)
      }
    }

    const isValidFileType = (file) => {
      if (props.acceptedTypes.includes('*')) return true

      return props.acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.includes('/*')) {
          const category = type.split('/')[0]
          return file.type.startsWith(category)
        }
        return file.type === type
      })
    }

    const openFileDialog = () => {
      if (props.disabled) return
      fileInput.value.click()
    }

    const getAcceptAttribute = () => {
      return props.acceptedTypes.join(',')
    }

    const clearError = () => {
      error.value = ''
    }

    return {
      isDragOver,
      error,
      fileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileInput,
      openFileDialog,
      getAcceptAttribute,
      clearError
    }
  }
}
</script>