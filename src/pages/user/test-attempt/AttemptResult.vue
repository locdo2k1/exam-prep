<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-roboto mt-6">
    <!-- Info Banner -->
    <InfoBanner 
      :show-guide="showGuide" 
      @toggle-guide="toggleGuide" 
    />
    
    <!-- Results Header -->
    <ResultsHeader 
      title="Kết quả luyện tập: 2024 Practice Set TOEIC Test 9"
      part-name="Part 4"
    />
    
    <!-- Action Buttons -->
    <ActionButtons 
      :primary-button="{
        text: 'Xem đáp án',
        href: '#result-answers'
      }"
      :secondary-button="{
        text: 'Quay về trang đề thi'
      }"
      @secondary-click="handleBackToTest"
    />
    
    <!-- Results Overview -->
    <StatsOverview :stats="stats" />
  
    <!-- Detailed Analysis -->
    <AnalysisTabs 
      v-model:active-tab="activeTab"
      :tabs="[
        { id: 'part4', label: 'Part 4' },
        { id: 'overview', label: 'Tổng quát' }
      ]"
      :part4-data="part4Data"
      :overview-data="overviewData"
      @open-question="openQuestionModal"
    />
  
    <!-- Answer Section -->
    <AnswerSection 
      part-title="Part 4"
      :answers="answers"
      :actions="[
        { type: 'view-details', label: 'Xem chi tiết đáp án' },
        { type: 'retry-wrong', label: 'Làm lại các câu sai' }
      ]"
      @action-click="handleActionClick"
      @question-click="openQuestionModal"
    />
  
    <!-- Question Modal -->
    <QuestionModal 
      :show="showModal" 
      :question="selectedQuestion"
      @close="closeModal"
    >
      <div v-if="selectedQuestion">
        <p class="mb-4">Nội dung chi tiết câu hỏi sẽ được hiển thị tại đây...</p>
        <div class="space-y-2">
          <p><strong>Số câu:</strong> {{ selectedQuestion.number }}</p>
          <p><strong>Trạng thái:</strong> {{ getStatusText(selectedQuestion.status) }}</p>
          <p v-if="selectedQuestion.status !== 'unanswered'">
            <strong>Đáp án của bạn:</strong> {{ selectedQuestion.userAnswer || 'Không có' }}
          </p>
          <p><strong>Đáp án đúng:</strong> {{ selectedQuestion.correct }}</p>
        </div>
      </div>
    </QuestionModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InfoBanner from '@/components/user/test/InfoBanner.vue';
import ResultsHeader from '@/components/user/test/ResultsHeader.vue';
import ActionButtons from '@/components/user/test/ActionButtons.vue';
import StatsOverview from '@/components/user/test/StatsOverview.vue';
import AnalysisTabs from '@/components/user/test/AnalysisTabs.vue';
import AnswerSection from '@/components/user/test/AnswerSection.vue';
import QuestionModal from '@/components/user/test/QuestionModal.vue';

const showGuide = ref(false);
const activeTab = ref('overview');
const showModal = ref(false);
const selectedQuestion = ref(null);

const stats = ref({
  completed: { current: 1, total: 30 },
  accuracy: 50.0,
  correct: 1,
  incorrect: 1,
  skipped: 28,
  timeSpent: "0:01:08"
})

const part4Data = ref([
  {
    name: "[Part 4] Câu hỏi về chi tiết",
    correct: 1,
    wrong: 0,
    skipped: 15,
    accuracy: 100.00,
    questions: [
      { number: 72, status: 'unanswered' },
      { number: 77, status: 'unanswered' },
      { number: 78, status: 'unanswered' },
      { number: 79, status: 'unanswered' },
      { number: 80, status: 'unanswered' },
      { number: 81, status: 'unanswered' },
      { number: 83, status: 'unanswered' },
      { number: 85, status: 'unanswered' },
      { number: 87, status: 'unanswered' },
      { number: 88, status: 'unanswered' },
      { number: 90, status: 'unanswered' },
      { number: 94, status: 'unanswered' },
      { number: 95, status: 'correct' },
      { number: 97, status: 'unanswered' },
      { number: 98, status: 'unanswered' },
      { number: 100, status: 'unanswered' }
    ]
  },
  {
    name: "[Part 4] Dạng bài: Telephone message - Tin nhắn thoại",
    correct: 1,
    wrong: 1,
    skipped: 4,
    accuracy: 50.00,
    questions: [
      { number: 83, status: 'unanswered' },
      { number: 84, status: 'unanswered' },
      { number: 85, status: 'unanswered' },
      { number: 95, status: 'correct' },
      { number: 96, status: 'wrong' },
      { number: 97, status: 'unanswered' }
    ]
  },
  // Add more categories as needed...
])

const overviewData = ref([
  {
    name: "[Part 4] Câu hỏi kết hợp bảng biểu",
    correct: 0,
    wrong: 1,
    skipped: 1,
    accuracy: 0.00,
    questions: [
      { number: 96, status: 'wrong' },
      { number: 99, status: 'unanswered' }
    ]
  },
  {
    name: "[Part 4] Dạng bài: Telephone message - Tin nhắn thoại",
    correct: 1,
    wrong: 1,
    skipped: 4,
    accuracy: 50.00,
    questions: [
      { number: 83, status: 'unanswered' },
      { number: 84, status: 'unanswered' },
      { number: 85, status: 'unanswered' },
      { number: 95, status: 'correct' },
      { number: 96, status: 'wrong' },
      { number: 97, status: 'unanswered' }
    ]
  },
  // Add more overview categories...
])

const answers = ref([
  { number: 71, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 72, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 73, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 74, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 75, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 76, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 77, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 78, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 79, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 80, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 81, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 82, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 83, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 84, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 85, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 86, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 87, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 88, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 89, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 90, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 91, correct: 'A', userAnswer: null, status: 'unanswered' },
  { number: 92, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 93, correct: 'B', userAnswer: null, status: 'unanswered' },
  { number: 94, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 95, correct: 'C', userAnswer: 'C', status: 'correct' },
  { number: 96, correct: 'A', userAnswer: 'C', status: 'wrong' },
  { number: 97, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 98, correct: 'D', userAnswer: null, status: 'unanswered' },
  { number: 99, correct: 'C', userAnswer: null, status: 'unanswered' },
  { number: 100, correct: 'D', userAnswer: null, status: 'unanswered' }
])

const getCurrentTabData = computed(() => {
  return activeTab.value === 'part4' ? part4Data.value : overviewData.value
})

const toggleGuide = () => {
  showGuide.value = !showGuide.value;
};

const handleBackToTest = () => {
  // Handle back to test logic here
  console.log('Back to test clicked');
};

const handleActionClick = (actionType) => {
  if (actionType === 'view-details') {
    // Handle view details action
    console.log('View details clicked');
  } else if (actionType === 'retry-wrong') {
    // Handle retry wrong answers action
    console.log('Retry wrong answers clicked');
  }
};

const openQuestionModal = (question) => {
  selectedQuestion.value = question;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedQuestion.value = null;
};

const getStatusText = (status) => {
  const statusMap = {
    'correct': 'Đúng',
    'wrong': 'Sai',
    'unanswered': 'Chưa trả lời'
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,0,1;wght@300;400;500;700;900&display=swap');

.font-roboto {
  font-family: 'Roboto', sans-serif;
}

.line-through {
  text-decoration: line-through;
}
</style>