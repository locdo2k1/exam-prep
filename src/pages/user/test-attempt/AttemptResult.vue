<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-roboto mt-6">
    <!-- Info Banner -->
    <InfoBanner :show-guide="showGuide" @toggle-guide="toggleGuide" />

    <!-- Results Header -->
    <ResultsHeader :title="state.testInfo?.testName || 'Kết quả luyện tập'"
      :part-names="state.testInfo?.partNames || []" />

    <!-- Action Buttons -->
    <ActionButtons :primary-button="{
      text: 'Xem đáp án',
      href: '#result-answers'
    }" :secondary-button="{
      text: 'Quay về trang đề thi'
    }" @secondary-click="handleBackToTest" />

    <!-- Results Overview -->
    <StatsOverview :stats="statsFromStore" />

    <!-- Detailed Analysis -->
    <AnalysisTabs v-model:active-tab="activeTab" :tabs="analysisTabsConfig" :current-data="currentAnalysisData"
      :loading="loading" :error="error" @open-question="openQuestionModal" />

    <!-- Answer Section -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-lg font-semibold text-gray-900">Đáp án</h4>
      <div class="flex space-x-2">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Xem chi tiết đáp án
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Làm lại các câu sai
        </button>
      </div>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <span class="text-red-700 text-sm font-italic">
        Chú ý: Khi làm lại các câu sai, điểm trung bình của bạn sẽ KHÔNG BỊ ẢNH HƯỞNG.
      </span>
    </div>

    <div class="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-start space-x-3">
      <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div class="text-green-800 text-sm">
        <strong>Tips:</strong> Khi xem chi tiết đáp án, bạn có thể tạo và lưu highlight từ vựng, keywords và tạo note đề
        học và tra cứu khi có nhu cầu ôn lại đề thi này trong tương lai.
      </div>
    </div>
    <AnswerSection
      v-for="section in answerSections"
      :key="section.title"
      :part-title="section.title"
      :answers="section.answers"
      @action-click="handleActionClick"
      @question-click="openQuestionModal"
    /> 

    <!-- Question Modal -->
    <QuestionModal :show="showModal" :question="selectedQuestion || undefined" @close="closeModal">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAttemptResultStore } from '@/stores/modules/attemptResult.store';
import InfoBanner from '@/components/user/test/InfoBanner.vue';
import ResultsHeader from '@/components/user/test/ResultsHeader.vue';
import ActionButtons from '@/components/user/test/ActionButtons.vue';
import StatsOverview from '@/components/user/test/StatsOverview.vue';
import AnalysisTabs from '@/components/user/test/AnalysisTabs.vue';
import AnswerSection from '@/components/user/test/AnswerSection.vue';
import QuestionModal from '@/components/user/test/QuestionModal.vue';
import type { QuestionResultVM, AnswerResultVM, PartResultVM } from '@/api/attemptResultApi';
import { mapQuestionForModal, type ModalQuestion } from '@/utils/questionMappers';

const showGuide = ref(false);
const activeTab = ref('overview');
const showModal = ref(false);
const selectedQuestion = ref<ModalQuestion | null>(null);

const stats = ref({
  completed: { current: 1, total: 30 },
  accuracy: 50.0,
  correct: 1,
  incorrect: 1,
  skipped: 28,
  timeSpent: "0:01:08"
})

// Tab configuration
const analysisTabsConfig = computed(() => {
  const partTabs = state.analysis?.parts?.map(part => ({
    id: part.partName,
    label: part.partName
  })) || [];

  return [
    ...partTabs,
    { id: 'overview', label: 'Tổng quát' },
  ];
});

// Current analysis data from store
const currentAnalysisData = computed(() => {
  if (!state.analysis) return { parts: [], overall: [] };
  console.log('state.analysis', state.analysis);

  return state.analysis;
});

// Answer item shape expected by AnswerSection
type AnswerItem = { number: number; correct: string; status: 'correct' | 'wrong' | 'unanswered'; userAnswer?: string };

// Helper to map raw question model to AnswerSection's expected shape (OLD behavior)
const mapRawToAnswer = (q: QuestionResultVM): AnswerItem => {
  const selectedOptions = q.options?.filter(opt => opt.selected).map(opt => opt.text).join(', ') || '';
  const userAnswer = selectedOptions || q.userAnswer || undefined;
  return {
    number: q.order,
    correct: q.correctOptions?.map(opt => opt.text).join(', ') || q.correctAnswers?.join(', ') || '',
    userAnswer,
    status: !userAnswer ? 'unanswered' : q.isCorrect === true ? 'correct' : 'wrong'
  };
};

// Finder to resolve raw VM by order (used for opening modal)
const findRawQuestionByOrder = (order: number) => {
  const answersState: AnswerResultVM | undefined = state.answers;
  if (!answersState) return null;

  const parts: PartResultVM[] = answersState.parts ?? [];
  if (parts.length > 0) {
    for (const part of parts) {
      const question = part.questions?.find(q => q.order === order);
      if (question) return question;
    }
  }

  const overall: QuestionResultVM[] = answersState.overall ?? [];
  return overall.find(q => q.order === order);
};

// Build sections for answers: per-part if available, otherwise overall (uses OLD mapping)
const answerSections = computed((): { title: string; answers: AnswerItem[] }[] => {
  const answersState: AnswerResultVM | undefined = state.answers;
  if (!answersState) return [];

  const parts: PartResultVM[] = answersState.parts ?? [];
  if (parts.length > 0) {
    return parts.map((p) => ({
      title: p.partName || `Part ${p.order}`,
      answers: (p.questions ?? []).map(mapRawToAnswer)
    }));
  }

  const overall: QuestionResultVM[] = answersState.overall ?? [];
  return [{
    title: 'Overall',
    answers: overall.map(mapRawToAnswer)
  }];
});

const toggleGuide = () => {
  showGuide.value = !showGuide.value;
};

const handleBackToTest = () => {
  // Handle back to test logic here
  console.log('Back to test clicked');
};

const handleActionClick = (actionType: 'view-details' | 'retry-wrong') => {
  if (actionType === 'view-details') {
    // Handle view details action
    console.log('View details clicked');
  } else if (actionType === 'retry-wrong') {
    // Handle retry wrong answers action
    console.log('Retry wrong answers clicked');
  }
};

const openQuestionModal = (payload: QuestionResultVM | AnswerItem | ModalQuestion) => {
  if ('order' in (payload as any)) {
    // From AnalysisTabs: raw question VM
    selectedQuestion.value = mapQuestionForModal(payload as QuestionResultVM);
  } else if ('status' in (payload as any) && !('order' in (payload as any))) {
    // From AnswerSection: has number/status; lookup VM by number to get full details
    const order = (payload as AnswerItem).number;
    const raw = findRawQuestionByOrder(order);
    selectedQuestion.value = raw ? mapQuestionForModal(raw) : (payload as ModalQuestion);
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedQuestion.value = null;
};

const getStatusText = (status: 'correct' | 'wrong' | 'unanswered' | string) => {
  const statusMap: Record<string, string> = {
    correct: 'Đúng',
    wrong: 'Sai',
    unanswered: 'Chưa trả lời'
  };
  return statusMap[status] || status;
};

// Integrate Pinia store
const route = useRoute();
const attemptStore = useAttemptResultStore();
const { loading, error, state, fetchTestResultOverall, fetchTestInfo, fetchTestAttemptAnalysis, fetchTestAnswers } = attemptStore;

onMounted(async () => {
  // Try to read params or query for IDs
  const attemptId = route.params.attemptId as string || route.query.attemptId as string;
  if (attemptId) {
    await fetchTestResultOverall(attemptId);
    await fetchTestInfo(attemptId);
    await fetchTestAttemptAnalysis(attemptId);
    await fetchTestAnswers(attemptId);
  }
});

// Map store overall result to component StatsOverview prop shape with fallback
const statsFromStore = computed(() => {
  const o = state.overallResult;
  if (!o) return stats.value;

  console.log('statsFromStore', o);

  return {
    completed: { current: o.correctAnswers, total: o.totalQuestions },
    accuracy: o.accuracyPercentage,
    correct: o.correctAnswers,
    incorrect: o.incorrectAnswers,
    skipped: o.skippedQuestions,
    timeSpent: o.completionTime,
  };

  
});
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