<template>
  <div class="space-y-3">
    <!-- Multiple Choice Options -->
    <div v-if="questionType === QUESTION_TYPES.MULTIPLE_CHOICE">
      <label 
        v-for="(option, optIndex) in options" 
        :key="optIndex"
        class="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
      >
        <input 
          type="checkbox"
          :checked="isSelected(option.id)"
          @change="handleOptionChange(option.id, $event)"
          class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        >
        <div class="flex-1">
          <span class="text-gray-700">{{ option.text }}</span>
        </div>
      </label>
    </div>

    <!-- Single Choice (Radio) Options -->
    <div v-else-if="questionType === QUESTION_TYPES.SINGLE_CHOICE">
      <label 
        v-for="(option, optIndex) in options" 
        :key="optIndex"
        class="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
      >
        <input 
          type="radio"
          :checked="isSelected(option.id)"
          @change="handleOptionChange(option.id, $event)"
          class="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
        >
        <div class="flex-1">
          <span class="text-gray-700">{{ option.text }}</span>
        </div>
      </label>
    </div>

    <!-- Fill in the Blank -->
    <div v-else-if="questionType === QUESTION_TYPES.FILL_IN_THE_BLANK" class="mt-2">
      <input
        type="text"
        :value="selectedOptionIds[0] || ''"
        @input="handleTextInput($event)"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        :placeholder="'Type your answer here...'"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PracticeOptionVM } from '@/api/practiceTestApi';
import { QUESTION_TYPES } from '@/constants/question.constants';

export default defineComponent({
  name: 'QuestionOptions',
  
  props: {
    options: {
      type: Array as PropType<PracticeOptionVM[]>,
      default: () => []
    },
    selectedOptionIds: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    questionType: {
      type: String,
      required: true,
      validator: (value: string) => Object.values(QUESTION_TYPES).includes(value)
    }
  },
  
  emits: ['update:selectedOptionIds'],
  
  setup(props, { emit }) {
    const isSelected = (optionId: string) => {
      return props.selectedOptionIds.includes(optionId);
    };

    const handleOptionChange = (optionId: string, event: Event) => {
      const target = event.target as HTMLInputElement;
      let newSelectedOptions: string[] = [];
      
      if (props.questionType === QUESTION_TYPES.MULTIPLE_CHOICE) {
        // For multiple choice, toggle the option
        if (target.checked) {
          newSelectedOptions = [...props.selectedOptionIds, optionId];
        } else {
          newSelectedOptions = props.selectedOptionIds.filter(id => id !== optionId);
        }
      } else if (props.questionType === QUESTION_TYPES.SINGLE_CHOICE) {
        // For single choice, only one option can be selected
        newSelectedOptions = target.checked ? [optionId] : [];
      }
      
      emit('update:selectedOptionIds', newSelectedOptions);
    };

    const handleTextInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:selectedOptionIds', [target.value]);
    };

    return {
      isSelected,
      handleOptionChange,
      handleTextInput,
      QUESTION_TYPES
    };
  }
});
</script>
