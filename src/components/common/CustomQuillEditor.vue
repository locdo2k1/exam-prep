<template>
    <div class="quill-editor-container" :class="{ 'dark-mode': isDarkMode }">
      <QuillEditor 
        ref="quillEditor"
        v-model:content="content"
        :options="editorOptions"
        :content-type="'html'"
        @update:content="onContentChange"
        @ready="onEditorReady"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
  import { QuillEditor } from '@vueup/vue-quill';
  
  // Import and register any Quill modules you need
  import { Quill } from '@vueup/vue-quill';
  import ImageResize from 'quill-image-resize-vue';
  Quill.register('modules/imageResize', ImageResize.default || ImageResize);
  
  export default {
    name: 'CustomQuillEditor',
    components: {
      QuillEditor
    },
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: 'Type your content here...'
      },
      theme: {
        type: String,
      },
      toolbar: {
        type: [String, Array],
        default: () => [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ]
      },
      darkMode: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const content = ref(props.modelValue);
      const quillEditor = ref(null);
      const isDarkMode = ref(props.darkMode);
  
      // Watch for dark mode changes
      watch(() => props.darkMode, (newValue) => {
        isDarkMode.value = newValue;
        updateEditorTheme();
      });
  
      // Editor options
      const editorOptions = ref({
        theme: props.theme,
        placeholder: props.placeholder,
        modules: {
          toolbar: props.toolbar,
          imageResize: {
            displaySize: true,
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        }
      });
  
      // Handle content changes
      const onContentChange = (value) => {
        emit('update:modelValue', value);
      };
  
      // Handle editor ready
      const onEditorReady = () => {
        updateEditorTheme();
      };
  
      // Update editor theme based on dark mode
      const updateEditorTheme = () => {
        if (quillEditor.value) {
          const quill = quillEditor.value.getQuill();
          const toolbar = quill.getModule('toolbar');
          
          // Force re-render to apply new styles
          setTimeout(() => {
            quill.update('silent');
          }, 50);
        }
      };
  
      // Expose methods if needed
      const getQuill = () => {
        return quillEditor.value?.getQuill();
      };
  
      onMounted(() => {
        // Force update the component to ensure styles are applied
        setTimeout(() => {
          updateEditorTheme();
        }, 100);
      });
  
      // Cleanup if needed
      onBeforeUnmount(() => {
        // Any cleanup code if needed
      });
  
      return {
        content,
        quillEditor,
        editorOptions,
        isDarkMode,
        onContentChange,
        onEditorReady,
        getQuill
      };
    }
  };
  </script>
  
  <style scoped>
  .quill-editor-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  /* Ensure the editor takes full height */
  :deep(.ql-container) {
    flex: 1;
    min-height: 200px;
  }
  </style>
  
  <style>
  /* Force styles to apply with !important to ensure they override Quill's defaults */
  /* Override all borders from snow theme */
  .ql-toolbar.ql-snow, .ql-container.ql-snow{
    border: none !important;
  }

  .quill-editor-container :deep(.ql-container.ql-snow) {
    background-color: transparent !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    border-radius: 0 !important;
    min-height: 400px !important;
  }
  
  .quill-editor-container :deep(.ql-toolbar.ql-snow) {
    border: none !important;
    border-bottom: 1px solid rgb(229 231 235) !important;
    margin-bottom: 0 !important;
    background-color: white !important;
    border-radius: 0 !important;
    padding: 8px !important;
  }
  
  /* Override inner borders in the toolbar */
  .quill-editor-container :deep(.ql-toolbar.ql-snow .ql-formats) {
    margin-right: 12px !important;
  }
  
  .quill-editor-container :deep(.ql-toolbar.ql-snow .ql-formats:last-child) {
    margin-right: 0 !important;
  }
  
  .quill-editor-container :deep(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    border-radius: 4px !important;
    margin-top: 4px !important;
  }
  
  .quill-editor-container :deep(.ql-editor) {
    flex: 1 !important;
    background-color: white !important;
    color: rgb(17 24 39) !important;
    padding: 12px 15px !important;
    line-height: 1.6 !important;
  }
  
  .quill-editor-container :deep(.ql-editor.ql-blank::before) {
    color: rgb(156 163 175) !important;
    font-style: italic !important;
  }
  
  /* Toolbar button styles */
  .quill-editor-container :deep(.ql-snow .ql-stroke) {
    stroke: rgb(75 85 99) !important;
  }
  
  .quill-editor-container :deep(.ql-snow .ql-fill),
  .quill-editor-container :deep(.ql-snow .ql-stroke.ql-fill) {
    fill: rgb(75 85 99) !important;
  }
  
  .quill-editor-container :deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
    stroke: rgb(59 130 246) !important;
  }
  
  .quill-editor-container :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
    stroke: rgb(37 99 235) !important;
  }
  
  .quill-editor-container :deep(.ql-snow.ql-toolbar button:hover .ql-fill),
  .quill-editor-container :deep(.ql-snow.ql-toolbar button.ql-active .ql-fill) {
    fill: rgb(37 99 235) !important;
  }
  
  /* Picker styles */
  .quill-editor-container :deep(.ql-snow .ql-picker-label) {
    color: rgb(75 85 99) !important;
  }
  
  .quill-editor-container :deep(.ql-snow .ql-picker-options) {
    background-color: white !important;
    border: 1px solid rgb(229 231 235) !important;
    border-radius: 4px !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
  
  .quill-editor-container :deep(.ql-snow .ql-picker-item) {
    color: rgb(17 24 39) !important;
  }
  
  .quill-editor-container :deep(.ql-snow .ql-picker-item:hover) {
    background-color: rgb(243 244 246) !important;
  }
  
  /* Selection styles */
  .quill-editor-container :deep(.ql-editor) ::selection {
    background-color: rgba(59, 130, 246, 0.2) !important;
  }
  
  /* Dark mode styles */
  .dark.quill-editor-container :deep(.ql-toolbar.ql-snow) {
    background-color: rgb(31 41 55) !important;
    border-bottom-color: rgb(55 65 81) !important;
  }
  
  /* Dark mode overrides for inner borders */
  .dark.quill-editor-container :deep(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    border-color: rgb(55 65 81) !important;
    background-color: rgb(31 41 55) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-toolbar.ql-snow .ql-picker-item) {
    color: #e5e7eb !important;
  }
  
  .dark.quill-editor-container :deep(.ql-toolbar.ql-snow .ql-picker-item:hover) {
    background-color: rgb(55 65 81) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-editor) {
    background-color: rgb(17 24 39) !important;
    color: rgb(229 231 235) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-editor.ql-blank::before) {
    color: rgb(107 114 128) !important;
  }
  
  /* Dark mode toolbar icons */
  .dark.quill-editor-container :deep(.ql-snow .ql-stroke) {
    stroke: rgb(156 163 175) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow .ql-fill),
  .dark.quill-editor-container :deep(.ql-snow .ql-stroke.ql-fill) {
    fill: rgb(156 163 175) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
    stroke: rgb(96 165 250) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
    stroke: rgb(59 130 246) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow.ql-toolbar button:hover .ql-fill),
  .dark.quill-editor-container :deep(.ql-snow.ql-toolbar button.ql-active .ql-fill) {
    fill: rgb(59 130 246) !important;
  }
  
  /* Dark mode picker styles */
  .dark.quill-editor-container :deep(.ql-snow .ql-picker-label) {
    color: rgb(156 163 175) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow .ql-picker-options) {
    background-color: rgb(31 41 55) !important;
    border-color: rgb(55 65 81) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow .ql-picker-item) {
    color: rgb(229 231 235) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-snow .ql-picker-item:hover) {
    background-color: rgb(55 65 81) !important;
  }
  
  /* Dark mode selection */
  .dark.quill-editor-container :deep(.ql-editor) ::selection {
    background-color: rgba(96, 165, 250, 0.3) !important;
  }
  
  /* Dark mode scrollbar */
  .dark.quill-editor-container :deep(.ql-editor)::-webkit-scrollbar {
    width: 8px;
  }
  
  .dark.quill-editor-container :deep(.ql-editor)::-webkit-scrollbar-track {
    background: rgb(31 41 55);
  }
  
  .dark.quill-editor-container :deep(.ql-editor)::-webkit-scrollbar-thumb {
    background: rgb(75 85 99);
    border-radius: 4px;
  }
  
  .dark.quill-editor-container :deep(.ql-editor)::-webkit-scrollbar-thumb:hover {
    background: rgb(107 114 128);
  }
  
  /* Tooltip styles for dark mode */
  .dark.quill-editor-container :deep(.ql-tooltip) {
    background-color: rgb(31 41 55) !important;
    border: 1px solid rgb(55 65 81) !important;
    color: rgb(229 231 235) !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-tooltip input[type="text"]) {
    background-color: rgb(17 24 39) !important;
    border: 1px solid rgb(55 65 81) !important;
    color: rgb(229 231 235) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-tooltip a.ql-action::after) {
    color: rgb(96 165 250) !important;
  }
  
  .dark.quill-editor-container :deep(.ql-tooltip a.ql-remove::before) {
    color: rgb(248 113 113) !important;
  }
  </style>