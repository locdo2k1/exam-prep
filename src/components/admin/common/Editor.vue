<template>
  <div class="quill-editor-container dark:bg-gray-800 dark:border-gray-700">
    <QuillEditor ref="quillEditor" v-model:content="content" :options="editorOptions" :placeholder="placeholder"
      contentType="html" theme="snow" @update:content="handleContentUpdate" @ready="handleEditorReady" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'
window.katex = katex
import ImageResize from 'quill-image-resize-vue'
// Only register if not already registered
if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize.default || ImageResize)
}

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
  height: {
    type: String,
    default: '300px'
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'ready'])

// Refs
const quillEditor = ref(null)
const content = ref(props.modelValue)

// Editor options
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['image', 'formula'],
      ['clean']
    ],
    formula: {
      // KaTeX options
      katex: katex
    },
    // keyboard bindings removed to allow default enter behavior
    imageResize: {}
  },
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  theme: 'snow'
}

// Handle content updates
const handleContentUpdate = (newContent) => {
  emit('update:modelValue', newContent)
  emit('change', {
    html: newContent,
    text: quillEditor.value?.getText() || '',
    quill: quillEditor.value?.getQuill()
  })
}

// Handle editor ready event
const handleEditorReady = (quill) => {
  // Set initial content when editor is ready
  if (content.value) {
    quill.clipboard.dangerouslyPasteHTML(content.value);
  }
  emit('ready', quill)
}

// Get Quill instance
const getQuill = () => {
  return quillEditor.value?.getQuill()
}

// Get content
const getContent = () => {
  return {
    html: content.value,
    text: quillEditor.value?.getText() || '',
    quill: quillEditor.value?.getQuill()
  }
}

// Insert text at current cursor position
const insertText = (text) => {
  const quill = getQuill()
  if (quill) {
    const range = quill.getSelection(true)
    quill.insertText(range.index, text)
    quill.setSelection(range.index + text.length)
  }
}

// Insert formula at current cursor position
const insertFormula = (formula) => {
  const quill = getQuill()
  if (quill) {
    const range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'formula', formula, 'user')
    quill.setSelection(range.index + 1)
  }
}

// Focus the editor
const focus = () => {
  quillEditor.value?.focus()
}

// Blur the editor
const blur = () => {
  quillEditor.value?.blur()
}

// Set editor content
const setContent = (newContent, emitEvent = true) => {
  const contentToSet = newContent || '';
  
  // Only update if the content is different
  if (contentToSet !== content.value) {
    content.value = contentToSet;
    
    // If the editor is ready, set its content directly
    if (quillEditor.value) {
      const quill = quillEditor.value.getQuill();
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(contentToSet);
      }
    }
    
    if (emitEvent) {
      emit('update:modelValue', contentToSet);
      emit('change', {
        html: contentToSet,
        text: quillEditor.value?.getText() || '',
        quill: quillEditor.value?.getQuill()
      });
    }
  }
}

// Format text at the current selection or specified range
const formatText = (format, value) => {
  const quill = getQuill()
  if (quill) {
    const range = quill.getSelection(true)
    if (range) {
      quill.formatText(range.index, range.length, format, value, 'user')
    }
  }
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    setContent(newValue, false)
  }
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
.quill-editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Needed for proper flex layout */
}

:deep(.ql-container) {
  border: none !important;
  min-height: 100px;
  height: 100% !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 1.5;
  overflow: auto;
}

:deep(.ql-editor) {
  min-height: 100px;
  flex: 1;
  height: 100% !important;
  overflow-y: auto;
  padding: 12px 0;
  width: 100%;
}

:deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e2e8f0 !important;
  padding: 8px 0 !important;
  margin-bottom: 0 !important;
}

/* Ensure the editor never exceeds its parent width and prevent horizontal scrolling */
.quill-editor-container,
:deep(.ql-container),
:deep(.ql-container.ql-snow),
:deep(.ql-editor) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* Make embedded images responsive */
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
}

/* Prevent long code blocks from causing horizontal page scroll */
:deep(pre.ql-syntax) {
  white-space: pre-wrap !important; /* wrap long lines */
  word-break: break-word;
  overflow-x: auto; /* if still long, scroll within code block */
}

/* Ensure editor itself can have internal horizontal scroll without affecting the page */
:deep(.ql-editor) {
  max-width: 100%;
  overflow-x: auto;
}

.dark .quill-editor-container {
  background-color: #1f2937;
  border-color: #4b5563;
}

/* Light theme */
:deep(.ql-toolbar) {
  background-color: #f8fafc;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.5rem;
}

:deep(.ql-container) {
  border: none;
  background-color: #ffffff;
  transition: background-color 0.2s ease, color 0.2s ease;
  flex: 1;
}

.dark :deep(.ql-container) {
  background-color: #1f2937;
  color: #f3f4f6;
}

:deep(.ql-editor) {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #1a202c;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dark :deep(.ql-editor) {
  color: #f3f4f6;
  background-color: #1f2937;
}

:deep(.ql-editor.ql-blank::before) {
  color: #a0aec0;
}

:deep(.ql-snow .ql-stroke) {
  stroke: #4a5568;
}

:deep(.ql-snow .ql-fill),
:deep(.ql-snow .ql-stroke.ql-fill) {
  fill: #4a5568;
}

:deep(.ql-snow .ql-picker) {
  color: #1a202c;
}

:deep(.ql-snow .ql-picker-options) {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.ql-snow .ql-picker-item) {
  color: #1a202c;
}

:deep(.ql-snow .ql-picker-item:hover) {
  background-color: #f7fafc;
}

:deep(.ql-snow .ql-picker-item:hover) .ql-picker-options {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.ql-snow .ql-picker-item) .ql-picker-options .ql-picker-item {
  color: #1a202c;
}

.dark :deep(.ql-snow .ql-picker-item) .ql-picker-options .ql-picker-item {
  color: #f7fafc;
}

:deep(.ql-snow .ql-picker-item) .ql-picker-options .ql-picker-item:hover {
  background-color: #f3f4f6;
}

.dark :deep(.ql-snow .ql-picker-item) .ql-picker-options .ql-picker-item:hover {
  background-color: #4b5563;
}

:deep(.ql-formula) {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  margin: 0 0.125rem;
  display: inline-block;
}

.dark :deep(.ql-formula) {
  background-color: #4b5563;
  color: #f9fafb;
}

:deep(.ql-formula.ql-active) {
  background-color: #e5e7eb;
}

.dark :deep(.ql-formula.ql-active) {
  background-color: #6b7280;
}

:deep(.ql-tooltip) {
  z-index: 50;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
}

.dark :deep(.ql-tooltip) {
  background-color: #1f2937;
  border-color: #4b5563;
}

:deep(.ql-tooltip) input[type="text"] {
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #ffffff;
  color: #1f2937;
}

.dark :deep(.ql-tooltip) input[type="text"] {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

:deep(.ql-tooltip) a.ql-preview {
  color: #2563eb;
}

.dark :deep(.ql-tooltip) a.ql-preview {
  color: #60a5fa;
}

:deep(.ql-tooltip) a.ql-action::after {
  color: #2563eb;
  margin-left: 0.5rem;
}

.dark :deep(.ql-tooltip) a.ql-action::after {
  color: #60a5fa;
}

:deep(.ql-tooltip) a.ql-remove::before {
  color: #dc2626;
  margin-left: 0.5rem;
}

.dark :deep(.ql-tooltip) a.ql-remove::before {
  color: #f87171;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.dark .btn-primary {
  background-color: #1d4ed8;
}

.dark .btn-primary:hover {
  background-color: #1e40af;
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