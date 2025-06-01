<template>
  <div class="file-uploader">
    <DragDropZone :accepted-types="acceptedTypes" :max-files="maxFiles" :max-size="maxSize"
      :placeholder-text="placeholderText" :subtext="subtext" :disabled="disabled" @files-dropped="handleFilesDropped"
      @error="handleError">
      <template #icon v-if="$slots.icon">
        <slot name="icon"></slot>
      </template>
    </DragDropZone>

    <FileList :files="files" :show-progress="false" @remove-file="removeFile" />

    <div v-if="files.length > 0 && showActions" class="actions">
      <button @click="clearAll" class="clear-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Clear All
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import DragDropZone from './DragDropZone.vue'
import FileList from './FileList.vue'

export default {
  name: 'FileUploader',
  components: {
    DragDropZone,
    FileList
  },
  props: {
    acceptedTypes: {
      type: Array,
      default: () => ['audio/mpeg', 'audio/wav', 'audio/aac']
    },
    maxFiles: {
      type: Number,
      default: 10
    },
    maxSize: {
      type: Number,
      default: 25
    },
    placeholderText: {
      type: String,
      default: 'Drop audio files here'
    },
    subtext: {
      type: String,
      default: 'MP3, WAV, AAC up to {{ maxSize }}MB'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'files-added',
    'file-removed',
    'error'
  ],
  setup(props, { emit }) {
    const files = ref([])
    let fileIdCounter = 0

    const handleFilesDropped = newFiles => {
      const processedFiles = newFiles.map(file => ({
        id: ++fileIdCounter,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file, // Keep original File object
        uploading: false,
        progress: 0,
        uploaded: false,
        error: null
      }))

      console.log('Files dropped:', processedFiles);

      files.value.push(...processedFiles)
      emit('files-added', processedFiles)
    }

    const handleError = error => {
      emit('error', error)
    }

    const removeFile = index => {
      const removedFile = files.value.splice(index, 1)[0]
      emit('file-removed', removedFile)
    }

    const clearAll = () => {
      files.value = []
    }

    return {
      files,
      handleFilesDropped,
      handleError,
      removeFile,
      clearAll
    }
  }
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.clear-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, rgba(255, 107, 107, 0.6), rgba(245, 101, 101, 0.6));
  color: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 400;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(245, 101, 101, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
}

.clear-btn:hover {
  background: linear-gradient(to right, rgba(245, 101, 101, 0.7), rgba(229, 62, 62, 0.7));
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(245, 101, 101, 0.15);
}

.clear-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(245, 101, 101, 0.08);
}

.clear-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.15);
}
</style>
