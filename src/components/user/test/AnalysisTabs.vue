<template>
  <div class="mb-8">
    <h4 class="text-lg font-semibold text-gray-900 mb-4">Phân tích chi tiết</h4>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex">
        <button v-for="tab in tabs" :key="tab.id" @click="$emit('update:activeTab', tab.id)" :class="[
          'py-2 px-4 border-b-2 font-medium text-sm',
          activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Phân loại câu hỏi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số câu đúng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số câu sai
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số câu bỏ qua
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Độ chính xác
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                Danh sách câu hỏi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
            <tr v-else-if="error" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-red-500">
                {{ error }}
              </td>
            </tr>
            <template v-else>
              <tr v-for="(category, index) in getCurrentTabData" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.categoryName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.correctNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.incorrectNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.skipNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.accuracy }}%</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button v-for="question in category.questions" :key="question.order"
                      @click="$emit('open-question', mapQuestionForDisplay(question))" :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        question.isCorrect === true
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : question.isCorrect === false
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      ]">
                      {{ question.order }}
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mapQuestionForDisplay } from '@/utils/questionMappers';

interface Question {
  order: number;
  context: string;
  explanation: string | null;
  transcript: string | null;
  isCorrect: boolean | null;
  correctOptions: Array<{
    id: string;
    text: string;
    correct: boolean;
    selected: boolean;
  }>;
  correctAnswers: string[];
  userAnswer: string | null;
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
    selected: boolean;
  }>;
  questionCategories: string[];
}

interface Category {
  categoryName: string;
  correctNumber: number;
  incorrectNumber: number;
  skipNumber: number;
  accuracy: number;
  questions: Question[];
}

interface Part {
  order: number;
  partName: string;
  categories: Category[];
}

interface OverallAnalysis {
  partName: string;
  correctNumber: number;
  incorrectNumber: number;
  skipNumber: number;
  accuracy: number;
}

interface Props {
  activeTab: string;
  tabs: Array<{
    id: string;
    label: string;
  }>;
  currentData: {
    parts: Part[];
    overall: OverallAnalysis[];
  };
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
});

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void;
  (e: 'open-question', question: {
    number: number;
    status: 'correct' | 'wrong' | 'unanswered';
    userAnswer: string | null;
    correct: string;
  }): void;
}>();

const getCurrentTabData = computed(() => {
  // Filter out parts with no categories or empty categories array
  const validParts = props.currentData?.parts?.filter(
    part => part?.categories?.length > 0
  ) || [];

  const activePart = validParts.find(
    part => part.partName.toLowerCase().includes(props.activeTab.toLowerCase())
  );

  if (props.activeTab === 'overview') {
    // Only include parts that have categories
    const allCategories = validParts.flatMap(part => part.categories || []);
    return allCategories.length > 0 ? allCategories : (props.currentData?.overall || []);
  }

  return activePart?.categories || [];
});

// mapping now imported from utils/questionMappers
</script>
