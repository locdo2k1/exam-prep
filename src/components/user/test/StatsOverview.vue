<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      <!-- Left Stats Column -->
      <div class="lg:col-span-3">
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <div class="text-sm text-gray-600">Kết quả làm bài</div>
              <div class="font-semibold text-gray-900">{{ stats.completed.current }}/{{ stats.completed.total }}</div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <div>
              <div class="text-sm text-gray-600">Độ chính xác (#đúng/#tổng)</div>
              <div class="font-semibold text-gray-900">{{ stats.accuracy }}%</div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div class="text-sm text-gray-600">Thời gian hoàn thành</div>
              <div class="font-semibold text-gray-900">{{ stats.timeSpent }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Stats Columns -->
      <div class="lg:col-span-9">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Correct Answers -->
          <div class="text-center">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="text-green-600 text-sm font-medium mb-1">Trả lời đúng</div>
            <div class="text-3xl font-bold text-green-600 mb-1">{{ stats.correct }}</div>
            <div class="text-sm text-gray-600">câu hỏi</div>
          </div>

          <!-- Incorrect Answers -->
          <div class="text-center">
            <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="text-red-600 text-sm font-medium mb-1">Trả lời sai</div>
            <div class="text-3xl font-bold text-red-600 mb-1">{{ stats.incorrect }}</div>
            <div class="text-sm text-gray-600">câu hỏi</div>
          </div>

          <!-- Skipped -->
          <div class="text-center">
            <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </div>
            <div class="text-gray-600 text-sm font-medium mb-1">Bỏ qua</div>
            <div class="text-3xl font-bold text-gray-600 mb-1">{{ stats.skipped }}</div>
            <div class="text-sm text-gray-600">câu hỏi</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        'completed' in value &&
        'accuracy' in value &&
        'correct' in value &&
        'incorrect' in value &&
        'skipped' in value &&
        'timeSpent' in value
      );
    }
  }
});
</script>
