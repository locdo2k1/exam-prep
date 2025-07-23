<template>
  <div class="bg-white dark:bg-gray-800 p-4 h-full flex flex-col">
    <!-- Question Bank Modal -->
    <QuestionBankModal
      :isOpen="showQuestionBankModal"
      :selected-questions="currentQuestions"
      @close="showQuestionBankModal = false"
      @select="handleAddQuestionsFromBank"
    />
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
      <template v-else>
        <QuestionListItem
          v-for="(question, qIndex) in currentQuestions"
          :key="qIndex"
          :question="question"
          :question-number="qIndex + 1"
          :is-selected="selectedQuestion === qIndex"
          @select="selectQuestion(qIndex)"
          @remove="removeQuestion(qIndex)"
        />
        
        <div 
          v-if="currentQuestions.length === 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
        >
          No questions added yet. Click the "Add Question" button to get started.
        </div>
      </template>
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
  console.log('modelValue:', props.modelValue);
  // Ensure each part has the correct structure
  const normalizedParts = props.modelValue.map((part, index) => {
    if (Array.isArray(part)) {
      return { 
        id: `part-${index + 1}`,
        name: `Part ${index + 1}`,
        title: `Part ${index + 1}`,
        questions: part 
      };
    }
    return {
      ...part,
      id: part.id || `part-${index + 1}`,
      title: part.title || part.name || `Part ${index + 1}`,
      name: part.name || `Part ${index + 1}`,
      questions: part.questions || []
    };
  });
  console.log('Normalized parts:', normalizedParts);
  return normalizedParts;
});

// Watch for changes to parts and initialize activePart if needed
watch(parts, (newParts) => {
  console.log('Parts updated:', newParts);
  console.log('Current activePart:', activePart.value);
  
  // If no active part is set but we have parts, set the first one as active
  if (newParts.length > 0 && !activePart.value) {
    activePart.value = 'part-0';
    console.log('Set initial active part:', activePart.value);
  }
  
  // If the active part no longer exists (e.g., part was deleted)
  if (newParts.length > 0 && activePart.value) {
    const activeIndex = parseInt(activePart.value.replace('part-', ''));
    if (activeIndex >= newParts.length) {
      // If the active part was removed, set the last part as active
      activePart.value = `part-${newParts.length - 1}`;
      console.log('Adjusted active part to:', activePart.value);
    }
  }
  
  // Force update the active tab
  if (newParts.length > 0) {
    const currentIndex = activePart.value ? parseInt(activePart.value.replace('part-', '')) : 0;
    if (newParts[currentIndex]) {
      console.log('Current part data:', newParts[currentIndex]);
    }
  }
}, { immediate: true, deep: true });

const currentQuestions = computed(() => {
  const partIndex = getCurrentPartIndex();
  const part = parts.value[partIndex];
  console.log(part);
  return (part && part.questions) || [];
});

const getCurrentPartIndex = () => {
  return parseInt(activePart.value.split('-')[1]) || 0;
};

watch(activePart, (newVal, oldVal) => {
  console.log('Tab changed to:', newVal);
  selectedQuestion.value = null;
  
  // Emit the active part index to parent
  const activeIndex = newVal ? parseInt(newVal.replace('part-', '')) : -1;
  emit('active-part-change', activeIndex);
  
  // If you need to access the part data, you can do it like this:
  const partIndex = parseInt(newVal.replace('part-', ''));
  if (!isNaN(partIndex) && parts.value[partIndex]) {
    console.log('Selected part:', parts.value[partIndex]);
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
  const newParts = [...parts.value];
  if (newParts[partIndex]?.questions) {
    newParts[partIndex].questions.splice(index, 1);
    emit('update:modelValue', newParts);
    
    // Reset selected question if it was the one removed
    if (selectedQuestion.value === index) {
      selectedQuestion.value = null;
    }
  }
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
