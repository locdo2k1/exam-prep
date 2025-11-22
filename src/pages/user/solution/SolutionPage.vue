<template>
  <div v-if="isLoading" class="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading test solutions...</p>
    </div>
  </div>
  <div v-else-if="error" class="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
    <div class="text-center text-red-600">
      <p>{{ error }}</p>
      <button @click="fetchTestSolutions" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Retry
      </button>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      <!-- Main Content -->
      <div class="flex-1">
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
              Đáp án/transcript: {{ testName || 'Loading test...' }}
            </h1>
            <button @click="handleExit"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
              Thoát
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex gap-2 mb-6 overflow-x-auto pb-2" v-if="hasParts">
            <button v-for="part in parts" :key="part" @click="activePart = part"
              class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap" :class="activePart === part
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'">
              {{ part }}
            </button>
          </div>
        </div>

        <!-- Questions List -->
        <div v-if="hasQuestions" class="space-y-4">
          <div v-for="q in displayQuestions" :key="q.order" class="bg-white rounded-xl shadow-sm p-6"
            :data-question="q.order">
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 font-semibold rounded-lg">
                {{ q.order }}
              </div>
              <div class="flex-1">
                <p class="text-gray-700 font-medium">
                  Đáp án đúng: <span class="text-green-600">{{ q.answer }}</span>
                </p>

                <!-- Outer Content (Question Set Description) -->
                <button v-if="q.outerContent" @click="toggleOuterContent(q.order)"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1">
                  {{ q.showOuterContent ? 'Ẩn' : 'Hiện' }} Mô tả
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': q.showOuterContent }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div v-if="q.showOuterContent && q.outerContent"
                  class="mt-2 pl-4 py-2 border-l-2 border-purple-200 text-gray-600 text-sm bg-purple-50 rounded">
                  {{ q.outerContent }}
                </div>

                <button @click="toggleTranscript(q.order)"
                  class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                  {{ q.showTranscript ? 'Ẩn' : 'Hiện' }} Transcript
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': q.showTranscript }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Transcript -->
                <div v-if="q.showTranscript" class="mt-3 pl-4 py-2 border-l-2 border-blue-200 text-gray-600 text-sm">
                  {{ q.transcript }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-xl shadow-sm p-6 text-gray-600">
          Hiện chưa có câu hỏi để hiển thị.
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:w-64 flex-shrink-0" v-if="hasQuestions">
        <div class="bg-white rounded-xl shadow-sm p-4 sticky top-4">
          <h3 class="font-semibold text-gray-800 mb-4">Danh sách câu hỏi</h3>
          <div v-if="hasParts" class="space-y-4">
            <template v-for="part in parts" :key="part">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">{{ part }}</h4>
                <div class="flex flex-wrap gap-1.5">
                  <button v-for="q in questionsByPart(part)" :key="q.order" @click="scrollToQuestion(q)"
                    class="h-[30px] w-[30px] flex items-center justify-center rounded text-xs font-medium transition-colors"
                    :class="{
                      'bg-green-100 text-green-700': true,
                      'hover:bg-green-50': true
                    }">
                    {{ q.order }}
                  </button>
                </div>
              </div>
            </template>
          </div>
          <div v-else>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="q in questions" :key="q.order" @click="scrollToQuestion(q)"
                class="h-[30px] w-[30px] flex items-center justify-center rounded text-xs font-medium transition-colors"
                :class="{
                  'bg-green-100 text-green-700': true,
                  'hover:bg-green-50': true
                }">
                {{ q.order }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { getTestSolutions } from "@/api/testInfoApi";

interface Question {
  order: number;
  part: string;
  answer: string;
  transcript: string;
  outerContent?: string;
  showTranscript: boolean;
  showOuterContent: boolean;
  isCorrect: boolean;
  userAnswer: string;
}

const props = defineProps<{
  testId: string;
}>();

const router = useRouter();
const isLoading = ref(true);
const error = ref<string | null>(null);

const activePart = ref<string | null>(null);

const questions = ref<Question[]>([]);
const testName = ref<string>('');

interface RawQuestionData {
  order: number;
  part: string;
  answer: string;
  transcript?: string;
  outerContent?: string;
  correct?: boolean;
  userAnswer?: string;
  showTranscript?: boolean;
}

const fetchTestSolutions = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await getTestSolutions(props.testId);

    if (response.success && response.data) {
      testName.value = response.data.testName || 'Test';
      questions.value = response.data.flattenedQuestions.map((q: RawQuestionData) => ({
        order: q.order,
        part: q.part,
        answer: q.answer,
        transcript: q.transcript || "No transcript available",
        outerContent: q.outerContent,
        showTranscript: q.showTranscript || false,
        showOuterContent: false,
        isCorrect: q.correct || false,
        userAnswer: q.userAnswer || ""
      }));
    }
  } catch (err) {
    console.error("Failed to fetch test solutions:", err);
    error.value = "Failed to load test solutions. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// Fetch solutions when component is mounted
onMounted(() => {
  if (props.testId) {
    fetchTestSolutions();
  }
});

// Watch for changes in testId
watch(() => props.testId, (newTestId) => {
  if (newTestId) {
    fetchTestSolutions();
  }
});

const parts = computed(() => {
  const set = new Set(questions.value.map((q) => q.part));
  return Array.from(set).filter((p): p is string => !!p);
});

const hasParts = computed(() => parts.value.length > 0);
const hasQuestions = computed(() => questions.value.length > 0);

const displayQuestions = computed(() => {
  if (!activePart.value) return questions.value;
  return questions.value.filter(q => q.part === activePart.value);
});

const handleExit = () => {
  router.back();
};

const toggleTranscript = (order: number) => {
  const question = questions.value.find((q) => q.order === order);
  if (question) {
    question.showTranscript = !question.showTranscript;
  }
};

const toggleOuterContent = (order: number) => {
  const question = questions.value.find((q) => q.order === order);
  if (question) {
    question.showOuterContent = !question.showOuterContent;
  }
};

const questionsByPart = (part: string) => {
  return questions.value.filter((q) => q.part === part);
};

const scrollToQuestion = (question: Question) => {
  activePart.value = question.part;
  nextTick(() => {
    const element = document.querySelector(`[data-question="${question.order}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

watch(
  parts,
  (newParts) => {
    if (activePart.value === null || !newParts.includes(activePart.value)) {
      activePart.value = newParts[0] ?? null;
    }
  },
  { immediate: true }
);

// This computed property is not needed as we already have displayQuestions
// that serves the same purpose
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
