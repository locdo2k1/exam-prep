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

    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 class="text-2xl font-bold text-white">Đáp án chi tiết</h4>
            <p class="text-blue-100 text-sm mt-0.5">Xem lại câu trả lời và giải thích chi tiết</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button @click="handleRetryWrongAnswers"
            class="bg-white hover:bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm lại câu sai</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Info Banners -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex items-start space-x-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <div class="text-amber-800 text-sm">
          <strong class="font-semibold">Lưu ý:</strong> Khi làm lại các câu sai, điểm trung bình của bạn sẽ không bị ảnh
          hưởng.
        </div>
      </div>

      <div class="bg-emerald-50 border-l-4 border-emerald-400 rounded-lg p-4 flex items-start space-x-3">
        <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div class="text-emerald-800 text-sm">
          <strong class="font-semibold">Mẹo:</strong> Nhấn vào từng câu để xem giải thích chi tiết và tạo ghi chú học
          tập.
        </div>
      </div>
    </div>
    <!-- Anchor for 'Xem đáp án' button -->
    <div id="result-answers" class="h-0"></div>
    <AnswerSection v-for="section in answerSections" :key="section.title" :part-title="section.title"
      :answers="section.answers" @action-click="handleActionClick" @question-click="openQuestionModal" />

    <!-- Question Modal -->
    <QuestionModal :show="showModal" :question="selectedQuestion || undefined" @close="closeModal">
      <!-- <div v-if="selectedQuestion">
        
        <div class="mb-4" v-html="selectedQuestion.context"></div>
        <div class="space-y-2">
          <p><strong>Trạng thái:</strong> {{ getStatusText(selectedQuestion.status) }}</p>
          <p v-if="selectedQuestion.status !== 'unanswered'">
            <strong>Đáp án của bạn:</strong> {{ selectedQuestion.userAnswer || 'Không có' }}
          </p>
          <p><strong>Đáp án đúng:</strong> {{ selectedQuestion.correct }}</p>
        </div>
      </div> -->
    </QuestionModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TestInfoVM } from '@/api/attemptResultApi';
import { useAttemptResultStore } from '@/stores/modules/attemptResult.store';
import { storeToRefs } from 'pinia';
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
  const partTabs = state.value.analysis?.parts?.map(part => ({
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
  if (!state.value.analysis) return { parts: [], overall: [] };
  console.log('state.analysis', state.value.analysis);

  return state.value.analysis;
});

// Answer item shape expected by AnswerSection
type AnswerItem = { number: number; correct: string; status: 'correct' | 'wrong' | 'unanswered'; userAnswer?: string | null; transcript?: string; outerContent?: string; explanation?: string; questionAudios?: any[] };

// Helper to map raw question model to AnswerSection's expected shape (OLD behavior)
const mapRawToAnswer = (q: QuestionResultVM): AnswerItem => {
  const selectedOptions = q.options?.filter(opt => opt.selected).map(opt => opt.text).join(', ') || '';
  const userAnswer = selectedOptions || q.userAnswer || null;
  return {
    number: q.order,
    correct: q.correctOptions?.map(opt => opt.text).join(', ') || q.correctAnswers?.join(', ') || '',
    userAnswer,
    transcript: q.transcript,
    outerContent: q.outerContent,
    explanation: q.explanation,
    questionAudios: q.questionAudios || [],
    status: !userAnswer ? 'unanswered' : q.isCorrect === true ? 'correct' : 'wrong'
  };
};

// Finder to resolve raw VM by order (used for opening modal)
const findRawQuestionByOrder = (order: number) => {
  const answersState: AnswerResultVM | undefined = state.value.answers;
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
  const answersState: AnswerResultVM | undefined = state.value.answers;
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

const router = useRouter();

const handleBackToTest = () => {
  const testId = attemptStore.state.testInfo?.testId;
  if (testId) {
    router.push({
      name: 'test-details',
      params: { id: testId }
    });
  } else {
    console.warn('No test ID available for navigation');
  }
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

const handleRetryWrongAnswers = () => {
  const testId = attemptStore.state.testInfo?.testId;
  const partIds = state.value.overallResult?.parts?.map(p => p.id).filter(Boolean);
  if (testId) {
    const query: Record<string, any> = {
      ref_id: route.params.attemptId
    };

    if (partIds && partIds.length > 0) {
      query.part = partIds;
    }

    router.push({
      name: 'practice-test',
      params: { id: testId },
      query
    });
  } else {
    console.warn('No test ID available for navigation');
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
// Keep refs reactive when destructuring
const { loading, error, state } = storeToRefs(attemptStore);
// Actions stay on the store instance
const { fetchTestResultOverall, fetchTestInfo, fetchTestAttemptAnalysis, fetchTestAnswers, reset } = attemptStore;

onMounted(async () => {
  // Try to read params or query for IDs
  const attemptId = route.params.attemptId as string || route.query.attemptId as string;
  if (attemptId) {
    console.log('[AttemptResult] onMounted attemptId =', attemptId);
    // Clear previous attempt data to avoid stale display
    reset();
    await Promise.all([
      fetchTestResultOverall(attemptId),
      fetchTestInfo(attemptId),
      fetchTestAttemptAnalysis(attemptId),
      fetchTestAnswers(attemptId)
    ]);
  }
});

// React when attemptId changes (same component instance reused)
watch(
  () => route.params.attemptId as string | undefined,
  async (newAttemptId) => {
    if (newAttemptId) {
      console.log('[AttemptResult] watcher newAttemptId =', newAttemptId);
      // Clear previous attempt data before loading new
      reset();
      await Promise.all([
        fetchTestResultOverall(newAttemptId),
        fetchTestInfo(newAttemptId),
        fetchTestAttemptAnalysis(newAttemptId),
        fetchTestAnswers(newAttemptId)
      ]);
    }
  }
);

// Map store overall result to component StatsOverview prop shape with fallback
const statsFromStore = computed(() => {
  const o = state.value.overallResult;
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