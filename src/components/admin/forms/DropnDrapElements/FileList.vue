<template>
  <div v-if="files.length > 0" class="file-list">
    <div v-for="(file, index) in files" :key="file.id || index" class="file-item"
      :class="{ 'uploading': file.uploading }">
      <div class="file-info">
        <div class="file-icon" :style="{ background: getIconColor(file.type) }">
          {{ getFileIcon(file.type) }}
        </div>
        <div class="file-details">
          <h4 class="file-name">{{ file.name }}</h4>
          <p class="file-meta">
            {{ formatFileSize(file.size) }}
            <span v-if="file.type"> • {{ getFileTypeDisplay(file.type) }}</span>
            <span v-if="file.category"> • {{ file.category }}</span>
          </p>
          <div v-if="file.uploading" class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: file.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ Math.round(file.progress) }}%</span>
          </div>
        </div>
      </div>
      <button @click="removeFile(index)" class="remove-btn" :disabled="file.uploading" title="Remove file">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      required: true
    },
    showProgress: {
      type: Boolean,
      default: true
    }
  },
  emits: ['remove-file'],
  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    getFileIcon(type) {
      if (!type) return '📎'
      if (type.startsWith('image/')) return '🖼️'
      if (type.startsWith('video/')) return '🎥'
      if (type.startsWith('audio/')) return '🎵'
      if (type.includes('pdf')) return '📄'
      if (type.includes('doc') || type.includes('word')) return '📝'
      if (type.includes('sheet') || type.includes('excel')) return '📊'
      if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'
      if (type.includes('text')) return '📃'
      if (type.includes('zip') || type.includes('rar')) return '🗜️'
      return '📎'
    },

    getIconColor(type) {
      if (!type) return 'linear-gradient(45deg, #718096, #4a5568)'
      if (type.startsWith('image/')) return 'linear-gradient(45deg, #48bb78, #38a169)'
      if (type.startsWith('video/')) return 'linear-gradient(45deg, #ed8936, #dd6b20)'
      if (type.startsWith('audio/')) return 'linear-gradient(45deg, #9f7aea, #805ad5)'
      if (type.includes('pdf')) return 'linear-gradient(45deg, #e53e3e, #c53030)'
      if (type.includes('doc')) return 'linear-gradient(45deg, #3182ce, #2c5aa0)'
      return 'linear-gradient(45deg, #667eea, #764ba2)'
    },

    getFileTypeDisplay(type) {
      if (!type) return 'Unknown'
      const parts = type.split('/')
      return parts[parts.length - 1].toUpperCase()
    },

    removeFile(index) {
      this.$emit('remove-file', index)
    }
  }
}
</script>

<style scoped>
.file-list {
  margin-top: 1.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  animation: fadeInUp 0.3s ease;
}

.file-item:hover {
  background: #edf2f7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-item.uploading {
  opacity: 0.8;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
  font-size: 16px;
  flex-shrink: 0;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  color: #2d3748;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  word-break: break-word;
}

.file-meta {
  color: #718096;
  font-size: 0.8rem;
  margin: 0 0 0.5rem 0;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #48bb78, #38a169);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-text {
  font-size: 0.75rem;
  color: #4a5568;
  font-weight: 600;
  min-width: 35px;
}

.remove-btn {
  background: #fed7d7;
  border: none;
  color: #c53030;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  flex-shrink: 0;
}

.remove-btn:hover:not(:disabled) {
  background: #feb2b2;
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .file-item {
    padding: 0.75rem;
  }

  .file-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
    margin-right: 0.75rem;
  }

  .file-name {
    font-size: 0.85rem;
  }

  .file-meta {
    font-size: 0.75rem;
  }
}
</style>