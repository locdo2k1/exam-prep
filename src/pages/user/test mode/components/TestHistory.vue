<template>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Kết quả làm bài của bạn:</h3>
  
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Ngày làm</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Kết quả</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">Thời gian làm bài</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(attempt, index) in attempts" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 mb-2">{{ attempt.date }}</div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="(tag, tagIndex) in attempt.tags" 
                    :key="tagIndex"
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getTagClass(tag.type)
                    ]"
                  >
                    {{ tag.text }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-900">{{ attempt.result }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ attempt.duration }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  @click="$emit('view-details', attempt)"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, withDefaults } from 'vue';
  
  export interface AttemptTag {
    type: 'part' | 'recording' | 'practice' | 'full';
    text: string;
  }
  
  export interface TestAttempt {
    date: string;
    result: string;
    duration: string;
    tags: AttemptTag[];
  }
  
  interface Props {
    attempts?: TestAttempt[];
  }
  
  const props = withDefaults(defineProps<Props>(), {
    attempts: () => [
      {
        date: '17/08/2025',
        result: '0/6',
        duration: '3:25:49',
        tags: [
          { type: 'practice', text: 'Luyện tập' },
          { type: 'part', text: 'Part 1' }
        ]
      },
      {
        date: '29/06/2025',
        result: '1/100',
        duration: '0:01:51',
        tags: [
          { type: 'practice', text: 'Luyện tập' },
          { type: 'part', text: 'Part 5' },
          { type: 'part', text: 'Part 6' },
          { type: 'part', text: 'Part 7' }
        ]
      },
      {
        date: '02/06/2025',
        result: '0/6',
        duration: '0:00:21',
        tags: [
          { type: 'practice', text: 'Luyện tập' },
          { type: 'part', text: 'Part 1' }
        ]
      },
      {
        date: '02/06/2025',
        result: '3/200 (Điểm: 25)',
        duration: '0:00:28',
        tags: [
          { type: 'full', text: 'Full test' }
        ]
      }
    ]
  });
  
  const getTagClass = (type: string) => {
    switch (type) {
      case 'part':
        return 'bg-orange-100 text-orange-800';
      case 'practice':
        return 'bg-orange-100 text-orange-800';
      case 'full':
        return 'bg-green-100 text-green-800';
      case 'recording':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  defineEmits<{
    (e: 'view-details', attempt: TestAttempt): void;
  }>();
  </script>