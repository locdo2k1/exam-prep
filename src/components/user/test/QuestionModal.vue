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
            <!-- 1. Audio Players -->
            <div v-if="hasAudio" class="space-y-3">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z">
                  </path>
                </svg>
                <h4 class="font-semibold text-indigo-900">Audio</h4>
              </div>
              <div v-for="(audio, index) in question.questionAudios" :key="index"
                class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-4">
                <AudioPlayer :audio-url="audio.fileUrl" />
              </div>
            </div>

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
            <div v-if="!isFillInBlank && question.options && question.options.length > 0" class="space-y-4">
              <!-- Question Type Badge -->
              <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 w-fit">
                <svg v-if="isMultipleChoice" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                  <circle cx="12" cy="12" r="5" />
                </svg>
                <span class="text-blue-800 text-sm font-semibold">
                  {{ isMultipleChoice ? 'Chọn nhiều đáp án' : 'Chọn một đáp án' }}
                </span>
              </div>

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
                    <div class="flex items-start gap-3">
                      <!-- Visual indicator based on question type -->
                      <div class="flex items-center justify-center flex-shrink-0 mt-0.5">
                        <!-- Multiple Choice - Checkbox style -->
                        <div v-if="isMultipleChoice" :class="[
                          'w-5 h-5 border-2 rounded flex items-center justify-center',
                          isOptionCorrect(index)
                            ? 'bg-green-500 border-green-500'
                            : isUserAnswerWrong(index)
                              ? 'bg-red-500 border-red-500'
                              : 'bg-white border-gray-400'
                        ]">
                          <svg v-if="isOptionCorrect(index) || isUserAnswerWrong(index)" class="w-3 h-3 text-white"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7">
                            </path>
                          </svg>
                        </div>
                        <!-- Single Choice - Radio button style -->
                        <div v-else :class="[
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          isOptionCorrect(index)
                            ? 'border-green-500'
                            : isUserAnswerWrong(index)
                              ? 'border-red-500'
                              : 'border-gray-400'
                        ]">
                          <div v-if="isOptionCorrect(index) || isUserAnswerWrong(index)" :class="[
                            'w-3 h-3 rounded-full',
                            isOptionCorrect(index) ? 'bg-green-500' : 'bg-red-500'
                          ]"></div>
                        </div>
                      </div>

                      <!-- Option Text with Status -->
                      <div class="flex-1">
                        <div class="flex items-start justify-between gap-2">
                          <p class="text-gray-800 text-sm flex-1">{{ option.text }}</p>
                          <!-- Status Icons -->
                          <div class="flex-shrink-0">
                            <svg v-if="isOptionCorrect(index)" class="w-5 h-5 text-green-600" fill="currentColor"
                              viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"></path>
                            </svg>
                            <svg v-else-if="isUserAnswerWrong(index)" class="w-5 h-5 text-red-600" fill="currentColor"
                              viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- For Fill in the Blank -->
            <div v-else-if="isFillInBlank" class="space-y-4">
              <!-- Question Type Badge -->
              <div class="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200 w-fit">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                <span class="text-purple-800 text-sm font-semibold">Điền vào chỗ trống</span>
              </div>

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
                  <div class="space-y-2">
                    <!-- Display multiple correct answers if available -->
                    <template v-if="question.correctAnswers && question.correctAnswers.length > 0">
                      <div v-for="(answer, idx) in question.correctAnswers" :key="idx"
                        class="p-3 bg-white rounded-lg border border-green-200">
                        <p class="text-green-600 text-sm font-medium">{{ answer }}</p>
                      </div>
                    </template>
                    <!-- Fallback to single correct answer fields -->
                    <div v-else-if="question.correctAnswer || question.correct"
                      class="p-3 bg-white rounded-lg border border-green-200">
                      <p class="text-green-600 text-sm font-medium">{{ question.correctAnswer || question.correct }}</p>
                    </div>
                    <!-- No answer available -->
                    <div v-else class="p-3 bg-white rounded-lg border border-green-200">
                      <p class="text-gray-500 text-sm italic">Không có đáp án</p>
                    </div>
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
                  <span class="font-semibold text-cyan-900">Transcript</span>
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
import { defineProps, defineEmits, ref, computed } from 'vue';
import AudioPlayer from './AudioPlayer.vue';
import { QUESTION_TYPES } from '@/constants/question.constants';

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

// Check if question has audio files
const hasAudio = computed(() => {
  return props.question?.questionAudios && props.question.questionAudios.length > 0;
});

// Determine question type
const questionType = computed(() => {
  if (props.question?.questionType) {
    return props.question.questionType;
  }
  // Infer type from data structure
  if (props.question?.options && props.question.options.length > 0) {
    const hasMultipleCorrect = props.question.correctOptions?.length > 1;
    return hasMultipleCorrect ? QUESTION_TYPES.MULTIPLE_CHOICE : QUESTION_TYPES.SINGLE_CHOICE;
  }
  return QUESTION_TYPES.FILL_IN_THE_BLANK;
});

const isFillInBlank = computed(() => questionType.value === QUESTION_TYPES.FILL_IN_THE_BLANK);
const isSingleChoice = computed(() => questionType.value === QUESTION_TYPES.SINGLE_CHOICE);
const isMultipleChoice = computed(() => questionType.value === QUESTION_TYPES.MULTIPLE_CHOICE);

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
