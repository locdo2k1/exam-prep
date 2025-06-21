<template>
   <div class="file-uploader dark:bg-gray-800 rounded-lg mb-4">
      <DragDropZone :accepted-types="['audio/*']" :max-files="maxFiles" :max-size="maxSize"
         placeholder-text="Drop audio files here" :subtext="`MP3, WAV, AAC up to ${maxSize}MB`" :disabled="disabled"
         class="dark:border-gray-700 dark:hover:border-primary" @files-dropped="handleFilesDropped"
         @error="handleError">
         <template #icon>
            <slot name="icon">
               <span class="text-2xl dark:text-gray-400">🎵</span>
            </slot>
         </template>
      </DragDropZone>

      <FileList :files="files" :show-progress="showProgress" @remove-file="removeFile" class="dark:text-gray-300" />

      <div v-if="files.length > 0 && showActions" class="actions mt-3">
         <button @click="clearAll" :disabled="isUploading" class="clear-btn group flex items-center gap-1.5 px-3.5 py-2 rounded-xl 
               bg-gradient-to-r from-red-400/80 to-red-500/80 
               hover:from-red-500/90 hover:to-red-600/90
               text-white/90 font-medium text-sm
               transform transition-all duration-200 ease-out
               hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5
               disabled:opacity-50 disabled:cursor-not-allowed
               backdrop-filter backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg"
               class="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
               <line x1="10" y1="11" x2="10" y2="17" />
               <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Clear All
         </button>
      </div>
   </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import DragDropZone from './DragDropZone.vue'
import FileList from './FileList.vue'

export default {
   name: 'AudioUploader',
   components: {
      DragDropZone,
      FileList
   },
   props: {
      maxFiles: {
         type: Number,
         default: 3
      },
      maxSize: {
         type: Number,
         default: 20
      },
      disabled: {
         type: Boolean,
         default: false
      },
      showProgress: {
         type: Boolean,
         default: true
      },
      showActions: {
         type: Boolean,
         default: true
      },
      autoUpload: {
         type: Boolean,
         default: false
      },
      uploadUrl: {
         type: String,
         default: null
      },
      uploadHeaders: {
         type: Object,
         default: () => ({})
      },
      initialFiles: {
         type: Array,
         default: () => []
      }
   },
   emits: [
      'files-added',
      'file-removed',
      'upload-start',
      'upload-progress',
      'upload-complete',
      'upload-error',
      'error',
      'clear-all'
   ],
   setup(props, { emit }) {
      const files = ref([])
      
      // Format initial files to match the expected file object structure
      const formatInitialFiles = (fileList) => {
         return fileList.map(file => file)
      }

      // Watch for changes to initialFiles
      watch(() => props.initialFiles, (newFiles) => {
         if (newFiles?.length) {
            files.value = formatInitialFiles(newFiles)
         } else {
            files.value = []
         }
      }, { immediate: true })

      const isUploading = computed(() =>
         files.value.some(file => file.uploading)
      )

      const handleFilesDropped = (newFiles) => {

         files.value.push(...newFiles)
         emit('files-added', newFiles)

         if (props.autoUpload) {
            uploadFiles()
         }
      }

      const handleError = (error) => {
         emit('error', error)
      }

      const removeFile = (index) => {
         const removedFile = files.value.splice(index, 1)[0]
         emit('file-removed', removedFile)
      }

      const clearAll = () => {
         files.value = []
         emit('clear-all');
      }

      const uploadFiles = async () => {
         if (!props.uploadUrl) {
            simulateUpload()
            return
         }

         const filesToUpload = files.value.filter(file => !file.uploaded && !file.uploading)
         emit('upload-start', filesToUpload)

         for (const file of filesToUpload) {
            try {
               await uploadSingleFile(file)
            } catch (error) {
               file.error = error.message
               emit('upload-error', { file, error })
            }
         }

         emit('upload-complete', files.value)
      }

      const uploadSingleFile = async (file) => {
         file.uploading = true
         file.progress = 0

         const formData = new FormData()
         formData.append('file', file)

         try {
            const response = await fetch(props.uploadUrl, {
               method: 'POST',
               headers: props.uploadHeaders,
               body: formData
            })

            if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)

            file.uploaded = true
            file.uploading = false
            file.progress = 100
            return await response.json()
         } catch (error) {
            file.uploading = false
            file.error = error.message
            throw error
         }
      }

      const simulateUpload = () => {
         const filesToUpload = files.value.filter(file => !file.uploaded && !file.uploading)

         filesToUpload.forEach(file => {
            file.uploading = true
            file.progress = 0

            const interval = setInterval(() => {
               file.progress += Math.random() * 20
               emit('upload-progress', { file, progress: file.progress })

               if (file.progress >= 100) {
                  file.progress = 100
                  file.uploading = false
                  file.uploaded = true
                  clearInterval(interval)
               }
            }, 250)
         })
      }

      return {
         files,
         isUploading,
         handleFilesDropped,
         handleError,
         removeFile,
         clearAll,
         uploadFiles
      }
   }
}
</script>

<style scoped>
.file-uploader {
   width: 100%;
   transition: background-color 0.2s ease;
}

/* Remove old button styles since we're using Tailwind classes */
</style>
