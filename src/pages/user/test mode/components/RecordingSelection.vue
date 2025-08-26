<template>
  <div class="mb-6">
    <h3 class="font-medium mb-4">Chọn phần thi bạn muốn làm</h3>

    <div class="space-y-3">
      <label 
        v-for="recording in recordings" 
        :key="recording.id"
        class="flex items-start space-x-3"
      >
        <input 
          type="checkbox" 
          :value="recording.id"
          v-model="selectedRecordings"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0"
        />
        <div>
          <div class="font-medium">{{ recording.name }} ({{ recording.questionCount }} câu hỏi)</div>
          <div class="text-sm text-gray-600 mt-1">
            <span 
              v-for="(tag, index) in recording.tags" 
              :key="index"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1 inline-block"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

interface RecordingTag {
  id: string;
  name: string;
}

interface Recording {
  id: string;
  name: string;
  questionCount: number;
  tags: string[];
}

interface Props {
  modelValue: string[];
  recordings?: Recording[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  recordings: () => [
    {
      id: 'rec1',
      name: 'Recording 1',
      questionCount: 10,
      tags: ['Listening| Note-Form Completion']
    },
    {
      id: 'rec2',
      name: 'Recording 2',
      questionCount: 10,
      tags: ['Listening| Table Completion', 'Listening| Multiple Choice']
    },
    {
      id: 'rec3',
      name: 'Recording 3',
      questionCount: 10,
      tags: ['Listening| Map Labelling', 'Listening| Sentence Completion']
    },
    {
      id: 'rec4',
      name: 'Recording 4',
      questionCount: 10,
      tags: ['Listening| Matching', 'Listening| Short Answer']
    }
  ]
});

const emit = defineEmits(['update:modelValue']);

const selectedRecordings = ref<string[]>(props.modelValue);

// Watch for changes in selectedRecordings and emit update event
watch(selectedRecordings, (newValue) => {
  emit('update:modelValue', newValue);
});

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newValue) => {
  selectedRecordings.value = newValue;
}, { immediate: true });
</script>
