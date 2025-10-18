<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-blue-600">
              <template v-if="user.isLoading">Loading...</template>
              <template v-else-if="user.error">{{ user.error }}</template>
              <template v-else>Xin chào, {{ user.name || 'Học viên' }}!</template>
            </h1>
            <p class="text-gray-600 mt-1">Kết quả luyện thi mới nhất</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-blue-600 font-medium">{{ new Date().toLocaleDateString('vi-VN') }}</span>
          </div>
        </div>
      </div>
      <!-- Recent Results Section -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Course Results -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">2022-2023 Ôn luyện toàn phần</h3>
            <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              Đang học
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <p>Năm học: Thứ - Sáng - CN thầy Tuấn</p>
            <p>Nghiệp: THPT màu Trang Anh</p>
            <p>Chính sách: - 95 chấm</p>
            <p class="text-orange-600 font-medium">Học lần tại: 13/09/2023</p>
            <p>Hôm lần học TOEIC: 03h30</p>
            <p>T10 học: 175$</p>
          </div>
          <button class="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            [Xem tài sao]
          </button>
        </div>

        <!-- TOEIC Test Results -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">New Economy TOEIC Test 3</h3>
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <p>Năm học: 04/09/2023</p>
            <p>Thời gian hoàn thành: 2:30:18</p>
            <p>Kết quả: 2/10</p>
            <p class="text-blue-600 font-medium mt-4">[Xem tài liệu]</p>
          </div>
        </div>
      </div>

      <!-- Study Banner -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-6 text-white relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-white/20 rounded-lg p-3">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Kiểm tra trình độ miễn phí</h3>
                <p class="opacity-90">Nhanh chóng • Chính xác • Hiệu quả</p>
              </div>
            </div>
            <button class="bg-white text-amber-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              START
            </button>
          </div>
          <div class="absolute top-0 right-0 opacity-10">
            <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Latest Tests Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Đề thi mới nhất</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TestCard 
            v-for="test in tests" 
            :key="test.id"
            :test="test"
            @start-test="startTest"
          />
        </div>
      </div>

      <!-- Online Training Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-4">
              <span class="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">EXAM PREP</span>
            </div>
            <h3 class="text-3xl font-bold mb-4">LUYỆN ĐỀ ONLINE<br>KHÔNG GIỚI HạN</h3>
            <ul class="space-y-2 text-sm opacity-90 mb-6">
              <li>• Hơn 95 phòng thi IELTS, TOEIC, HSK, TOPIK, THPT...</li>
              <li>• Chấm điểm tự động, báo cáo chi tiết từng câu đúng sai</li>
              <li>• Tự chọn phần thi hoặc làm ngẫu nhiên theo nhu cầu</li>
              <li>• Đầy đủng công cụ highlights, bookmark...</li>
              <li>• Report điểm từ chậng n chính xác với kết hội ban</li>
            </ul>
          </div>
          <div class="flex-shrink-0 ml-8">
            <div class="relative">
              <div class="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-bold text-lg">TÌM<br>HIỂU</span>
                </div>
              </div>
              <div class="absolute -top-4 -right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserBasicInfo } from '@/api/userApi'

// Test card component
const TestCard = {
  props: ['test'],
  emits: ['start-test'],
  template: `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div class="p-4">
        <h4 class="font-semibold text-gray-800 mb-2 text-sm leading-tight">{{ test.title }}</h4>
        <div class="space-y-1 text-xs text-gray-600 mb-4">
          <p>{{ test.questions }} câu hỏi | {{ test.duration }}</p>
          <p class="text-blue-600">{{ test.category }}</p>
          <p>{{ test.level }}</p>
        </div>
        <button 
          @click="$emit('start-test', test)"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Chí tích
        </button>
      </div>
    </div>
  `
}

// Sample test data
const tests = ref([
  {
    id: 1,
    title: 'IELTS Practice Set 3 Listening test 1',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 2,
    title: 'IELTS Practice Set 3 Listening test 2',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 3,
    title: 'IELTS Practice Set 3 Listening test 3',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 4,
    title: 'IELTS Practice Set 3 Listening test 4',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 5,
    title: 'IELTS Practice Set 3 Listening test 5',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 6,
    title: 'IELTS Practice Set 3 Listening test 6',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 7,
    title: 'IELTS Practice Set 3 Listening test 7',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  },
  {
    id: 8,
    title: 'IELTS Practice Set 3 Listening test 8',
    questions: '4 phần thi',
    duration: '40 câu hỏi',
    category: 'IELTS Academic',
    level: 'Listening'
  }
])

// Methods
const startTest = (test) => {
  console.log('Starting test:', test.title)
  // Handle test start logic here
}

// Reactive data
const user = reactive({
  name: '',
  email: '',
  currentCourse: '2022-2023 Ôn luyện toàn phần',
  isLoading: true,
  error: null
})

// Fetch user data when component mounts
onMounted(async () => {
  try {
    const response = await getUserBasicInfo()
    if (response.success) {
      user.name = response.data.username
      user.email = response.data.email
    } else {
      user.error = response.message || 'Failed to load user data'
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    user.error = 'An error occurred while loading user data'
  } finally {
    user.isLoading = false
  }
})
</script>

<style scoped>
/* Additional custom styles if needed */
.hover-lift:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>