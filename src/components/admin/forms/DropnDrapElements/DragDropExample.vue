<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
      Vue Drag & Drop File Components
    </h1>

    <!-- Basic File Uploader -->
    <section
      class="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Basic File Uploader</h2>
      <FileUploader :accepted-types="['image/*', '.pdf', '.doc', '.docx']" :max-files="5" :max-size="10"
        placeholder-text="Drop your files here" subtext="Images, PDFs, and Documents up to 10MB"
        @files-added="onFilesAdded" @upload-complete="onUploadComplete" @error="onError" />
    </section>

    <!-- Image Only Uploader -->
    <section
      class="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Image Only Uploader</h2>
      <FileUploader :accepted-types="['image/*']" :max-files="3" :max-size="5" placeholder-text="Drop images here"
        subtext="PNG, JPG, GIF up to 5MB each" :auto-upload="true">
        <template #icon>🖼️</template>
      </FileUploader>
    </section>

    <!-- Custom Drag Zone -->
    <section
      class="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Custom Drag Zone</h2>
      <DragDropZone :accepted-types="['.pdf', '.doc', '.docx']" :max-files="1" placeholder-text="Drop documents here"
        @files-dropped="handleCustomFiles">
        <template #icon>📄</template>
      </DragDropZone>
      <FileList :files="customFiles" @remove-file="removeCustomFile" />
    </section>

    <!-- Audio Uploader -->
    <section
      class="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Audio Upload Only</h2>
      <AudioUploader :accepted-types="['audio/*']" :max-files="2" :max-size="20"
        placeholder-text="Drop audio files here">
        <template #icon>🎵</template>
      </AudioUploader>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUploader from './FileUploader.vue'
import DragDropZone from './DragDropZone.vue'
import FileList from './FileList.vue'
import AudioUploader from './AudioUploader.vue'

const customFiles = ref([])

const onFilesAdded = (files) => {
  console.log('Files added:', files)
}

const onUploadComplete = (files) => {
  console.log('Upload complete:', files)
}

const onError = (error) => {
  console.error('Error:', error)
}

const handleCustomFiles = (files) => {
  customFiles.value.push(
    ...files.map((file, index) => ({
      ...file,
      id: Date.now() + index,
    }))
  )
}

const removeCustomFile = (index) => {
  customFiles.value.splice(index, 1)
}
</script>
