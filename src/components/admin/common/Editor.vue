<template>
  <div class="quill-formula-editor">
    <div ref="editorRef" class="editor-container"></div>
    <!-- <div class="actions" v-if="showActions">
      <button @click="getContent" class="btn btn-primary">Get Content</button>
      <button @click="insertFormula" class="btn btn-success">Insert Formula</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Start typing...'
  },
  showActions: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '200px'
  },
  toolbar: {
    type: Array,
    default: () => [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['formula'], // Formula button
      ['clean']
    ]
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'ready'])

// Template refs
const editorRef = ref(null)
const quillInstance = ref(null)
const isReady = ref(false)

// Local script and CSS management
const loadedResources = new Set()

const loadResource = (url, type = 'script') => {
  return new Promise((resolve, reject) => {
    if (loadedResources.has(url)) {
      resolve()
      return
    }

    let element
    if (type === 'script') {
      element = document.createElement('script')
      element.src = url
    } else if (type === 'css') {
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
    }

    element.onload = () => {
      loadedResources.add(url)
      resolve()
    }
    element.onerror = reject

    document.head.appendChild(element)
  })
}

// Initialize Quill with formula support
const initQuill = async () => {
  try {
    // Load Quill and KaTeX resources
    await Promise.all([
      loadResource('https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.css', 'css'),
      loadResource('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.18/katex.min.css', 'css'),
      loadResource('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.18/katex.min.js'),
      loadResource('https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js')
    ])

    // Wait for window.Quill to be available
    if (!window.Quill) {
      throw new Error('Quill failed to load')
    }

    // Create Quill instance
    quillInstance.value = new window.Quill(editorRef.value, {
      modules: {
        toolbar: props.toolbar,
        formula: true,
        keyboard: {
          bindings: {
            // Add custom keyboard binding for backspace
            backspace: {
              key: 8,
              handler(range) {
                const format = this.quill.getFormat(range.index - 1, 1);
                if (format.formula) {
                  this.quill.deleteText(range.index - 1, 1);
                  return false;
                }
                return true;
              }
            }
          }
        }
      },
      placeholder: props.placeholder,
      theme: 'snow'
    })

    // Set initial content if provided
    if (props.modelValue) {
      setContent(props.modelValue, false)
    }

    // Listen for content changes
    quillInstance.value.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        const html = quillInstance.value.root.innerHTML
        const isEmpty = quillInstance.value.getText().trim().length === 0

        emit('update:modelValue', isEmpty ? '' : html)
        emit('change', {
          html: isEmpty ? '' : html,
          delta: quillInstance.value.getContents(),
          text: quillInstance.value.getText(),
          source
        })
      }
    })

    // Listen for selection changes (optional)
    quillInstance.value.on('selection-change', (range, oldRange, source) => {
      // You can emit selection change events if needed
    })

    isReady.value = true
    emit('ready', quillInstance.value)

  } catch (error) {
    console.error('Failed to initialize Quill editor:', error)
  }
}

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  if (isReady.value && quillInstance.value) {
    const currentContent = quillInstance.value.root.innerHTML
    if (newValue !== currentContent) {
      setContent(newValue, false)
    }
  }
})

// Methods
const getContent = () => {
  if (!quillInstance.value) return null

  const content = {
    html: quillInstance.value.root.innerHTML,
    delta: quillInstance.value.getContents(),
    text: quillInstance.value.getText()
  }

  console.log('Current content:', content)
  return content
}

const setContent = (content, emitChange = true) => {
  if (!quillInstance.value) return

  const oldEmitFlag = quillInstance.value.emitChangeEvents
  if (!emitChange) {
    quillInstance.value.emitChangeEvents = false
  }

  if (typeof content === 'string') {
    if (content.trim() === '') {
      quillInstance.value.setText('')
    } else {
      quillInstance.value.clipboard.dangerouslyPasteHTML(content)
    }
  } else {
    quillInstance.value.setContents(content)
  }

  quillInstance.value.emitChangeEvents = oldEmitFlag
}

const insertFormula = () => {
  if (!quillInstance.value) return

  const formula = prompt('Enter LaTeX formula:', '\\frac{a}{b}')
  if (formula && formula.trim()) {
    const range = quillInstance.value.getSelection(true)
    const index = range ? range.index : quillInstance.value.getLength()
    quillInstance.value.insertEmbed(index, 'formula', formula, 'user')
    quillInstance.value.setSelection(index + 1)
  }
}

const focus = () => {
  if (quillInstance.value) {
    quillInstance.value.focus()
  }
}

const blur = () => {
  if (quillInstance.value) {
    quillInstance.value.blur()
  }
}

const insertText = (text, index = null) => {
  if (!quillInstance.value) return

  const insertIndex = index !== null ? index : quillInstance.value.getLength()
  quillInstance.value.insertText(insertIndex, text, 'user')
}

const formatText = (index, length, format, value) => {
  if (quillInstance.value) {
    quillInstance.value.formatText(index, length, format, value, 'user')
  }
}

// Lifecycle
onMounted(() => {
  initQuill()
})

onUnmounted(() => {
  if (quillInstance.value) {
    quillInstance.value.off('text-change')
    quillInstance.value.off('selection-change')
    quillInstance.value = null
  }
  isReady.value = false
})

// Expose methods to parent component
defineExpose({
  getContent,
  setContent,
  insertFormula,
  insertText,
  formatText,
  focus,
  blur,
  isReady: () => isReady.value,
  quill: () => quillInstance.value
})
</script>

<style scoped>
.quill-formula-editor {
  width: 100%;
}

.editor-container {
  min-height: v-bind(height);
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Scoped styles for formula elements within this editor */
:deep(.ql-editor .ql-formula) {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  padding: 2px 4px;
  margin: 0 2px;
  display: inline-block;
  font-family: 'KaTeX_Main', 'Times New Roman', serif;
}

/* Custom Quill editor styles scoped to this component */
:deep(.ql-container) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

:deep(.ql-editor) {
  min-height: calc(v-bind(height) - 2px);
  padding: 12px 15px;
  line-height: 1.6;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: italic;
  color: #999;
}

/* Toolbar styling */
:deep(.ql-toolbar) {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 8px;
}

:deep(.ql-container) {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>