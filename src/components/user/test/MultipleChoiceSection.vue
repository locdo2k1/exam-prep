<template>
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">Choose the correct letter, A, B or C.</h2>
      
      <div class="space-y-6">
        <div 
          v-for="question in questions" 
          :key="question.id"
          :id="`question-${question.id}`"
          class="border rounded-lg p-4"
        >
          <div class="flex items-start gap-3 mb-3">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {{ question.id }}
            </span>
            <p class="font-medium">{{ question.text }}</p>
          </div>
          
          <div class="ml-8 space-y-2">
            <label 
              v-for="option in question.options" 
              :key="option.key"
              class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                :name="`question-${question.id}`"
                :value="option.key"
                :checked="answers[question.id] === option.key"
                @change="$emit('answer-change', question.id, option.key)"
                class="text-blue-600"
              />
              <span class="font-medium">{{ option.key }}.</span>
              <span>{{ option.text }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MultipleChoiceSection',
    props: {
      questions: Array,
      answers: Object
    },
    emits: ['answer-change']
  }
  </script>