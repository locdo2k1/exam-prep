<template>
  <div class="mb-8">
    <h4 class="text-lg font-semibold text-gray-900 mb-4">Phân tích chi tiết</h4>
    
    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="$emit('update:activeTab', tab.id)" 
          :class="[
            'py-2 px-4 border-b-2 font-medium text-sm',
            activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
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
            <tr v-for="(category, index) in getCurrentTabData" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.correct }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.wrong }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.skipped }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.accuracy }}%</td>
              <td class="px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="question in category.questions"
                    :key="question.number"
                    @click="$emit('open-question', question)"
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      question.status === 'correct' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : question.status === 'wrong'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    ]"
                  >
                    {{ question.number }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => {
      return tabs.every(tab => 'id' in tab && 'label' in tab);
    }
  },
  part4Data: {
    type: Array,
    required: true
  },
  overviewData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:activeTab', 'open-question']);

const getCurrentTabData = computed(() => {
  return props.activeTab === 'part4' ? props.part4Data : props.overviewData;
});
</script>
