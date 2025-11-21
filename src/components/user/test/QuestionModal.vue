<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click="close">
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-3xl max-h-[90vh] overflow-y-auto w-full transform transition-all duration-300 scale-100"
      @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-900">Đáp án chi tiết #{{ question?.number }}</h3>
        </div>
        <button @click="close"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <slot>
          <div v-if="question" class="space-y-6">
            <!-- 2. Outer Content (Context/Passage) -->
            <div v-if="question.outerContent"
              class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
                </svg>
                <h4 class="font-semibold text-amber-900">Nội dung / Đoạn văn</h4>
              </div>
              <div class="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm prose-sm max-w-none"
                v-html="question.outerContent"></div>
            </div>

            <!-- 3. Question Context/Prompt -->
            <div v-if="question.context" class="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm6 5a1 1 0 11-2 0 1 1 0 012 0z"
                    clip-rule="evenodd"></path>
                </svg>
                <h4 class="font-semibold text-blue-900">Câu hỏi</h4>
              </div>
              <p class="text-gray-800 leading-relaxed whitespace-pre-wrap text-base" v-html="question.context"></p>
            </div>

            <!-- 4. Status Badge -->
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
              <span class="text-gray-600 font-medium text-sm">Trạng thái:</span>
              <span :class="getStatusBadgeClass(question.status)"
                class="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
                <span>{{ getStatusText(question.status) }}</span>
              </span>
            </div>

            <!-- 5. User Answer vs Correct Answer -->
            <!-- For Multiple Choice and Single Choice -->
            <div v-if="question.options && question.options.length > 0" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- User Answer -->
                <div class="bg-indigo-50 rounded-xl border-2 border-indigo-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <h5 class="font-semibold text-indigo-900 text-sm">Câu trả lời của bạn</h5>
                  </div>
                  <div class="space-y-2">
                    <!-- Multiple answers (for multiple choice) -->
                    <template v-if="getUserAnswers().length > 0">
                      <div v-for="(answerIndex, idx) in getUserAnswers()" :key="idx"
                        class="p-3 bg-white rounded-lg border border-indigo-200">
                        <div class="flex items-start gap-2">
                          <span :class="[
                            'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0',
                            isUserAnswerCorrect(answerIndex) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          ]" aria-hidden="true"></span>
                          <span class="text-gray-800 text-sm">{{ question.options[answerIndex]?.text }}</span>
                        </div>
                      </div>
                    </template>
                    <div v-else class="text-gray-600 text-sm italic">Chưa trả lời</div>
                  </div>
                </div>

                <!-- Correct Answer -->
                <div class="bg-green-50 rounded-xl border-2 border-green-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <h5 class="font-semibold text-green-900 text-sm">Đáp án đúng</h5>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(idx, i) in getCorrectOptionIndices()" :key="i"
                      class="p-3 bg-white rounded-lg border border-green-200">
                      <div class="flex items-start gap-2">
                        <span
                          class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-green-500 text-white flex-shrink-0"
                          aria-hidden="true"></span>
                        <span class="text-gray-800 text-sm">{{ question.options[idx]?.text }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full Options List -->
              <div class="space-y-2 pt-2">
                <h5 class="font-semibold text-gray-900 text-sm">Tất cả lựa chọn:</h5>
                <div class="space-y-2">
                  <div v-for="(option, index) in question.options" :key="index" :class="[
                    'p-3 rounded-lg border-2 transition-all',
                    isOptionCorrect(index)
                      ? 'bg-green-50 border-green-300'
                      : isUserAnswerWrong(index)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-gray-50 border-gray-200'
                  ]">
                    <div class="flex items-start gap-2">
                      <div :class="[
                        'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0',
                        isOptionCorrect(index)
                          ? 'bg-green-500 text-white'
                          : isUserAnswerWrong(index)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-400 text-white'
                      ]" aria-hidden="true"></div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm">{{ option.text }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- For Fill in the Blank -->
            <div v-else-if="question.type === 'FILL_IN_THE_BLANK' || !question.options" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- User Answer -->
                <div class="bg-indigo-50 rounded-xl border-2 border-indigo-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <h5 class="font-semibold text-indigo-900 text-sm">Câu trả lời của bạn</h5>
                  </div>
                  <div class="p-3 bg-white rounded-lg border border-indigo-200">
                    <p v-if="question.userAnswer" :class="[
                      'text-sm font-medium',
                      question.status === 'correct' ? 'text-green-600' : 'text-red-600'
                    ]">
                      {{ question.userAnswer }}
                    </p>
                    <p v-else class="text-gray-600 text-sm italic">Chưa trả lời</p>
                  </div>
                </div>

                <!-- Correct Answer -->
                <div class="bg-green-50 rounded-xl border-2 border-green-200 p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <h5 class="font-semibold text-green-900 text-sm">Đáp án đúng</h5>
                  </div>
                  <div class="p-3 bg-white rounded-lg border border-green-200">
                    <p class="text-green-600 text-sm font-medium">{{ question.correctAnswer || question.answer }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. Transcript Section (Collapsible) -->
            <div v-if="question.transcript" class="space-y-2">
              <button @click="showTranscript = !showTranscript"
                class="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 hover:shadow-md transition-all">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                  </svg>
                  <span class="font-semibold text-cyan-900">Bản ghi âm / Transcript</span>
                </div>
                <svg :class="['w-5 h-5 text-cyan-600 transition-transform', showTranscript ? 'rotate-180' : '']"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3">
                  </path>
                </svg>
              </button>
              <div v-if="showTranscript"
                class="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200 shadow-sm">
                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">{{ question.transcript }}</p>
              </div>
            </div>

            <!-- Explanation -->
            <div v-if="question.explanation"
              class="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-5 shadow-sm">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm6 5a1 1 0 11-2 0 1 1 0 012 0z"
                    clip-rule="evenodd"></path>
                </svg>
                <div class="flex-1">
                  <p class="font-semibold text-purple-900 mb-2 text-sm">Giải thích:</p>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{{ question.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  question: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);
const showTranscript = ref(false);

const close = () => {
  emit('close');
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'correct': 'Đúng',
    'wrong': 'Sai',
    'unanswered': 'Chưa trả lời'
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    'correct': 'bg-green-100 text-green-700',
    'wrong': 'bg-red-100 text-red-700',
    'unanswered': 'bg-gray-100 text-gray-700'
  };
  return classMap[status] || 'bg-gray-100 text-gray-700';
};

// Local option shape to avoid using `any` in mappings
type Opt = { id?: string; text?: string; selected?: boolean; isCorrect?: boolean };

// Get user's selected answer indices (supports both single and multiple choice)
const getUserAnswers = (): number[] => {
  if (!props.question) return [];

  const options: Opt[] = props.question.options || [];

  // Prefer selectedOptions (mapped shape) if present
  if (Array.isArray(props.question.selectedOptions) && props.question.selectedOptions.length) {
    return props.question.selectedOptions
      .map((sel: Opt) => options.findIndex((o: Opt) => (sel.id && o.id === sel.id) || o.text === sel.text))
      .filter((i: number) => i >= 0);
  }

  // For multiple choice: userAnswerIndices array (legacy)
  if (Array.isArray(props.question.userAnswerIndices)) {
    return props.question.userAnswerIndices.filter((idx: number) => idx !== null && idx !== undefined && idx >= 0);
  }

  // For single choice: userAnswerIndex (legacy)
  if (props.question.userAnswerIndex !== undefined && props.question.userAnswerIndex !== null) {
    return [props.question.userAnswerIndex];
  }

  return [];
};

// Return indices of correct options within question.options
const getCorrectOptionIndices = (): number[] => {
  if (!props.question || !props.question.options) return [];
  const options: Opt[] = props.question.options;

  // If correctOptions provided, map those to indices
  if (Array.isArray(props.question.correctOptions) && props.question.correctOptions.length) {
    return props.question.correctOptions
      .map((co: Opt) => options.findIndex((o: Opt) => (co.id && o.id === co.id) || o.text === co.text))
      .filter((i: number) => i >= 0);
  }

  // Fallback to option.isCorrect flag
  return options.map((o: Opt, i: number) => (o.isCorrect ? i : -1)).filter((i: number) => i >= 0);
};

const isOptionCorrect = (index: number): boolean => {
  if (!props.question || !props.question.options) return false;
  const options: Opt[] = props.question.options;
  if (options[index]?.isCorrect) return true;
  const correctIndices = getCorrectOptionIndices();
  return correctIndices.includes(index);
};

// Check if a specific user answer is correct
const isUserAnswerCorrect = (answerIndex: number): boolean => {
  return isOptionCorrect(answerIndex);
};

// Check if a user answer at this index is wrong (selected but not correct)
const isUserAnswerWrong = (optionIndex: number): boolean => {
  const userAnswers = getUserAnswers();
  const isUserSelected = userAnswers.includes(optionIndex);
  const correct = isOptionCorrect(optionIndex);
  return isUserSelected && !correct;
};
</script>
