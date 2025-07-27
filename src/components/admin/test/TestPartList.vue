<template>
  <div class="bg-white dark:bg-gray-800 p-4 h-full flex flex-col">
    <!-- Only show tabs if there are parts -->
    <div class="mb-4">
      <div class="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
        <div 
          v-for="(part, index) in parts" 
          :key="part.id"
          class="relative mr-2"
        >
          <button
            @click="activePart = `part-${index}`"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center rounded-t-lg"
            :class="{
              'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500': activePart === `part-${index}`,
              'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activePart !== `part-${index}`
            }"
          >
            <span class="whitespace-nowrap">
              {{ part.title || part.name || `Part ${index + 1}` }}
            </span>
            
            <!-- Delete Button -->
            <button 
              @click.stop="removePart(index)"
              class="ml-2 p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-full transition-colors"
              :title="'Delete ' + (part.title || part.name || 'Part ' + (index + 1))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </button>
        </div>
      </div>
    </div>
    
    <div class="tab-content">
      <div 
        v-for="(part, index) in parts" 
        :key="part.id"
        v-show="activePart === `part-${index}`"
        class="pt-2"
      >
      </div>
    </div>
    
    <div class="flex-1 pr-1">
      <div v-if="parts.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 mb-4">No parts added yet.</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Add a part using the "Add Part" button in the test information panel.</p>
      </div>
      
      <!-- Add Question Buttons -->
      <div v-else class="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          @click="addNewQuestion"
          class="group flex-1 flex items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
        >
          <div class="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg mr-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div class="text-left">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">Add New Question</div>
            <div class="text-xs text-gray-400 mt-0.5">Create a custom question</div>
          </div>
        </button>
        
        <button
          @click="openQuestionBank"
          class="group flex-1 flex items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
        >
          <div class="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg mr-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div class="text-left">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200">Add from Bank</div>
            <div class="text-xs text-gray-400 mt-0.5">Select from existing questions</div>
          </div>
        </button>
      </div>
      <div v-else class="space-y-4">
        <template v-for="(item, index) in currentItems" :key="index">
          <!-- Question Set -->
          <div v-if="item._type === 'questionSet'" class="border-2 border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="bg-gray-50 dark:bg-gray-700/80 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ item.name || `Question Set ${index + 1}` }}
                <span class="text-sm text-gray-500 ml-2">
                  ({{ item.questions?.length || 0 }} questions)
                </span>
              </div>
              <button 
                @click.stop="removeQuestion(index, true)"
                class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                title="Remove question set"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800">
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3" v-html="item.description || 'No description provided.'"></p>
              <div class="space-y-3">
                <QuestionListItem
                  v-for="(question, qIndex) in item.questions || []"
                  :key="qIndex"
                  :question="question"
                  :question-number="question.order"
                  :is-selected="false"
                  :show-remove="false"
                  class="border-l-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800/70"
                />
              </div>
            </div>
          </div>
          
          <!-- Single Question -->
          <QuestionListItem
            v-else
            :question="item"
            :question-number="item.order"
            :is-selected="selectedQuestion === index"
            :show-remove="true"
            @select="selectQuestion(index)"
            @remove="removeQuestion(index)"
          />
        </template>
        
        <div 
          v-if="currentItems.length === 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
        >
          No items added yet. Click the "Add Question" or "Add from Bank" button to get started.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch, nextTick } from 'vue';
import { FwbTab, FwbTabs } from 'flowbite-vue';
import QuestionListItem from './QuestionListItem.vue';
import QuestionBankModal from './QuestionBankModal.vue';

// Custom directive to focus the input when editing
const vFocus = {
  mounted: (el) => el.focus()
};

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ([]) // Array of parts, each part contains questions
  }
});

const emit = defineEmits([
  'update:modelValue', 
  'select-question', 
  'remove-part', 
  'remove-question',
  'add-question',
  'add-questions',
  'active-part-change' // Add new event for active part changes
]);

// Get dark mode state from ThemeProvider
const { isDarkMode } = inject('theme', { 
  isDarkMode: ref(false) 
});

const activePart = ref('');
const selectedQuestion = ref(null);
const editingPartIndexes = ref(new Set());
const editingPartNames = ref({});
const showQuestionBankModal = ref(false);

// Initialize part names
const initializePartNames = () => {
  parts.value.forEach((_, index) => {
    if (!parts.value[index].name) {
      parts.value[index].name = `Part ${index + 1}`;
    }
  });
};

// Start editing a part name
const startEditing = (index) => {
  editingPartIndexes.value.add(index);
  editingPartNames.value[index] = parts.value[index].name || `Part ${index + 1}`;
};

// Save the edited part name
const savePartName = (index) => {
  const newParts = [...parts.value];
  if (editingPartNames.value[index]?.trim()) {
    newParts[index].name = editingPartNames.value[index].trim();
  } else {
    newParts[index].name = `Part ${index + 1}`;
  }
  editingPartIndexes.value.delete(index);
  emit('update:modelValue', newParts);
};

// Cancel editing
const cancelEditing = (index) => {
  editingPartIndexes.value.delete(index);
};

const parts = computed(() => {
  // Ensure each part has the correct structure
  const normalizedParts = props.modelValue.map((part, index) => {
    if (Array.isArray(part)) {
      return { 
        id: `part-${index + 1}`,
        name: `Part ${index + 1}`,
        title: `Part ${index + 1}`,
        questions: part,
        listQuestionAndQuestionSet: []
      };
    }
    return {
      ...part,
      id: part.id || `part-${index + 1}`,
      title: part.title || part.name || `Part ${index + 1}`,
      name: part.name || `Part ${index + 1}`,
      questions: part.questions || [],
      listQuestionAndQuestionSet: part.listQuestionAndQuestionSet || []
    };
  });
  return normalizedParts;
});

// Watch for changes to parts and initialize activePart if needed
watch(parts, (newParts) => {
  
  // If no active part is set but we have parts, set the first one as active
  if (newParts.length > 0 && !activePart.value) {
    activePart.value = 'part-0';
  }
  
  // If the active part no longer exists (e.g., part was deleted)
  if (newParts.length > 0 && activePart.value) {
    const activeIndex = parseInt(activePart.value.replace('part-', ''));
    if (activeIndex >= newParts.length) {
      // If the active part was removed, set the last part as active
      activePart.value = `part-${newParts.length - 1}`;
    }
  }
  
  // Force update the active tab
  if (newParts.length > 0) {
    const currentIndex = activePart.value ? parseInt(activePart.value.replace('part-', '')) : 0;
    if (newParts[currentIndex]) {
    }
  }
}, { immediate: true, deep: true });

const currentItems = computed(() => {
  const partIndex = getCurrentPartIndex();
  if (partIndex < 0) return [];
  
  const part = parts.value[partIndex];
  // Use listQuestionAndQuestionSet if available, otherwise fall back to questions
  const items = part.listQuestionAndQuestionSet || part.questions || [];
  
  // Add a type property to each item for easier template rendering
  return items.map(item => ({
    ...item,
    _type: item.questions ? 'questionSet' : 'question'
  }));
});

const getCurrentPartIndex = () => {
  return parseInt(activePart.value.split('-')[1]) || 0;
};

watch(activePart, (newVal, oldVal) => {
  selectedQuestion.value = null;
  
  // Emit the active part index to parent
  const activeIndex = newVal ? parseInt(newVal.replace('part-', '')) : -1;
  emit('active-part-change', activeIndex);
  
  // If you need to access the part data, you can do it like this:
  const partIndex = parseInt(newVal.replace('part-', ''));
  if (!isNaN(partIndex) && parts.value[partIndex]) {
  }
});

const addPart = () => {
  const partNumber = parts.value.length + 1;
  const newPart = {
    id: Date.now().toString(),
    title: `Part ${partNumber}`,
    name: `Part ${partNumber}`,
    questions: []
  };
  const newParts = [...parts.value, newPart];
  emit('update:modelValue', newParts);
  activePart.value = `part-${newParts.length - 1}`;
  
  // Start editing the new part's name
  nextTick(() => {
    const newIndex = newParts.length - 1;
    startEditing(newIndex);
  });
};

const selectQuestion = (index) => {
  selectedQuestion.value = index;
  emit('select-question', { 
    partIndex: getCurrentPartIndex(), 
    questionIndex: index 
  });
};

const removeQuestion = (index) => {
  const partIndex = getCurrentPartIndex();
  if (partIndex === -1) return;
  
  const newParts = [...parts.value];
  const currentPart = newParts[partIndex];
  
  if (!currentPart?.listQuestionAndQuestionSet) return;
  
  // Remove the item from listQuestionAndQuestionSet
  currentPart.listQuestionAndQuestionSet.splice(index, 1);
  
  // Update the model value
  emit('update:modelValue', newParts);
  
  // Reset selected question if it was the one removed
  if (selectedQuestion.value === index) {
    selectedQuestion.value = null;
  }
  
  // Show success message
  emit('show-toast', {
    message: 'Item removed successfully',
    type: 'success'
  });
};

// Initialize part names when parts change
watch(parts, () => {
  initializePartNames();
  
  // Update active part if needed
  if (parts.value.length > 0 && !activePart.value) {
    activePart.value = 'part-0';
  } else if (parts.value.length === 0) {
    activePart.value = '';
  }
}, { immediate: true, deep: true });

const openQuestionBank = () => {
  showQuestionBankModal.value = true;
};

const addNewQuestion = () => {
  const partIndex = getCurrentPartIndex();
  emit('add-question', partIndex);
};

const handleAddQuestionsFromBank = (questions) => {
  const partIndex = getCurrentPartIndex();
  emit('add-questions', { partIndex, questions });
};

const removePart = (index) => {
  if (parts.value.length > 0) {
    const newParts = [...parts.value];
    newParts.splice(index, 1);
    emit('update:modelValue', newParts);
    
    // If the active part was removed, switch to the previous part
    const activeIndex = parseInt(activePart.value.split('-')[1]);
    if (activeIndex === index) {
      const newIndex = Math.max(0, index - 1);
      activePart.value = `part-${newIndex}`;
    } else if (activeIndex > index) {
      activePart.value = `part-${activeIndex - 1}`;
    }
  }
};
</script>
