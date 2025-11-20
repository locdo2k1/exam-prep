<template>
    <div class="min-h-screen bg-[#F5F5F5] p-4">
        <div class="max-w-4xl mx-auto">
            <!-- Main Test Card -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <div class="p-6">
                    <slot name="tags">
                        <template v-if="testInfo?.skills?.length">
                            <span v-for="(skill, index) in testInfo.skills" :key="index"
                                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                                {{ skill }}
                            </span>
                        </template>
                        <template v-else>
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">#IELTS
                                Academic</span>
                            <span
                                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">#Listening</span>
                        </template>
                    </slot>
                </div>
                <!-- Test Title -->
                <div class="p-6 pt-0">
                    <h1 class="text-2xl font-bold text-gray-900 flex items-center">
                        {{ testInfo?.testName || 'IELTS Simulation Listening test 1' }}
                        <svg class="w-6 h-6 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                    </h1>
                </div>

                <!-- Main Tabs -->
                <TestTabs v-model="activeTab" :tabs="tabs">
                    <!-- Test Info Tab -->
                    <template #test-info>
                        <TestInfo :time-limit="testInfo?.duration" :parts-count="testInfo?.sections"
                            :question-count="testInfo?.questions" :difficulty="3"
                            :participants="testInfo?.practicedUsers">
                            <InfoNote />

                            <TestHistory :attempts="testHistory" @view-details="viewAttemptDetails" />

                            <PracticeOptions v-model="practiceMode" :options="practiceOptions">
                                <template #practice="{ option }">
                                    <div class="space-y-4">
                                        <ProTip />
                                        <RecordingSelection v-model="selectedRecordings" :recordings="testParts" />
                                        <TimeLimit v-model="timeLimit" />
                                        <!-- Start Test Button -->
                                        <button @click="startPracticeTest"
                                            class="px-6 py-2 font-bold text-white uppercase bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            LUYỆN TẬP
                                        </button>

                                    </div>
                                </template>

                                <template #full-test="{ option }">
                                    <div class="space-y-4">
                                        <div class="flex items-start p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border border-yellow-200"
                                            role="alert">
                                            <svg class="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.75-3.25a.75.75 0 111.5 0v3.5a.75.75 0 01-1.5 0v-3.5zM10 13a1 1 0 100 2 1 1 0 000-2z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span class="leading-relaxed">
                                                Sẵn sàng để bắt đầu làm full test? Để đạt được kết quả tốt nhất, bạn cần
                                                dành ra 120 phút cho bài test này.
                                            </span>
                                        </div>

                                        <button @click="startFullTest"
                                            class="px-5 py-2 font-bold text-white bg-blue-700 rounded-md shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            BẮT ĐẦU THI
                                        </button>

                                    </div>
                                </template>

                                <template #discuss="{ option }">
                                    <div class="space-y-4">
                                        <p class="text-gray-600">Tham gia thảo luận về bài kiểm tra này.</p>
                                        <button
                                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            @click="startDiscussion">
                                            Vào phòng thảo luận
                                        </button>
                                    </div>
                                </template>
                            </PracticeOptions>
                        </TestInfo>
                    </template>

                    <!-- Answers Tab -->
                    <template #answers>
                        <div class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div class="flex items-center justify-between mb-6">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Xem Đáp án & Transcript</h3>
                                    <p class="text-gray-600 text-sm">Khám phá chi tiết đáp án, transcript và giải thích
                                        cho từng câu hỏi</p>
                                </div>
                            </div>

                            <button @click="viewSolution"
                                class="w-full px-8 py-4 font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center">
                                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Xem Đáp án & Transcript Ngay
                            </button>

                            <p class="text-xs text-gray-500 mt-4 text-center">💡 Tip: Hãy lưu lại các từ vựng khó để học
                                và ôn tập sau này!</p>
                        </div>
                    </template>
                </TestTabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TestTabs from './components/TestTabs.vue';
import TestInfo from './components/TestInfo.vue';
import TestHistory, { type TestAttempt } from './components/TestHistory.vue';
import PracticeOptions from './components/PracticeOptions.vue';
import RecordingSelection from './components/RecordingSelection.vue';
import TimeLimit from './components/TimeLimit.vue';
import InfoNote from './components/InfoNote.vue';
import ProTip from './components/ProTip.vue';
import { getTestInfo, getTestAttempts, type PracticeTestInfoVM } from '../../../api/testInfoApi';

interface Tag {
    type: string;
    text: string;
}

type PracticeMode = 'practice' | 'full-test' | 'discuss';

const route = useRoute();
const router = useRouter();

// State
const activeTab = ref<string>('test-info');
const tabs = ref([
    { name: 'test-info', title: 'Thông tin đề thi' },
    { name: 'answers', title: 'Đáp án/transcript' }
]);
const testInfo = ref<PracticeTestInfoVM | null>(null);
const practiceMode = ref<PracticeMode>('practice');
const selectedRecordings = ref<string[]>([]);
const timeLimit = ref<number | null>(null);

// Map test parts to recording format
const testParts = computed(() => {
    if (!testInfo.value?.testParts) return [];
    return testInfo.value.testParts.map(part => ({
        id: part.id,
        name: part.title,
        questionCount: part.questionCount,
        tags: part.questionCategories || []
    }));
});

// Practice options
const practiceOptions = [
    {
        value: 'practice',
        label: 'Luyện tập',
        description: 'Luyện tập từng phần của bài kiểm tra',
        icon: 'practice'
    },
    {
        value: 'full-test',
        label: 'Làm full test',
        description: 'Làm toàn bộ bài kiểm tra trong một lần',
        icon: 'test'
    },
    {
        value: 'discuss',
        label: 'Thảo luận',
        description: 'Thảo luận về bài kiểm tra',
        icon: 'discussion'
    }
];

// Test history from API
const testHistory = ref<TestAttempt[]>([]);

const formatDuration = (totalSeconds: number): string => {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

// Methods
const startPracticeTest = () => {
    // Validate time limit if provided
    if (timeLimit.value !== null) {
        const timeLimitNum = Number(timeLimit.value);
        if (isNaN(timeLimitNum) || timeLimitNum <= 0) {
            console.warn('Thời gian làm bài phải là một số dương');
            return;
        }
    }

    const query = {
        part: selectedRecordings.value,
        ...(timeLimit.value && { time_limit: timeLimit.value.toString() })
    };

    router.push({
        name: 'practice-test',
        params: { id: route.params.id },
        query: query
    });
};

const startTest = (): void => {
    console.log('Starting test...');
    console.log('Practice mode:', practiceMode.value);
    console.log('Selected recordings:', selectedRecordings.value);
    console.log('Time limit:', timeLimit.value);

    // Navigate to test taking page
    // router.push(`/test/${route.params.id}/take`);
};

const viewAttemptDetails = (attempt: TestAttempt): void => {
    if (!attempt?.id) return;
    router.push({
        name: 'attempt-result',
        params: { attemptId: attempt.id }
    });
};

const startFullTest = () => {
    const testId = route.params.id;
    if (testId) {
        router.push({
            name: 'take-test',
            params: { id: testId }
        });
    }
};

const startDiscussion = () => {
    console.log('Starting discussion');
    // Add your discussion start logic here
};

const viewSolution = () => {
    const testId = route.params.id as string;
    if (testId) {
        router.push({
            name: 'solution-details',
            params: { testId }
        });
    }
};

// Fetch test data
onMounted(async () => {
    const testId = route.params.id as string;
    if (!testId) return;
    try {
        const res = await getTestInfo(testId);
        if (res.success) {
            testInfo.value = res.data;
        } else {
            console.error('Failed to load test info:', res.message);
        }
        // Fetch attempts
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const attemptsRes = await getTestAttempts(testId, undefined, tz);
        if (attemptsRes.success && Array.isArray(attemptsRes.data)) {
            const attempts = attemptsRes.data as any[];
            testHistory.value = attempts.map((a) => {
                const date = a.takeDateLocal || (a.takeDate ? new Date(a.takeDate).toLocaleDateString('vi-VN') : '');
                const durationSec = Number.isFinite(a.timeSpent) ? a.timeSpent : (Number.isFinite(a.durationSeconds) ? a.durationSeconds : 0);
                const modeTag = a.isPractice ? { type: 'practice', text: 'Luyện tập' } : { type: 'full', text: 'Full test' };
                const partTags = Array.isArray(a.parts)
                    ? a.parts.map((p: string) => ({ type: 'part', text: p }))
                    : [];
                return {
                    id: a.id,
                    date,
                    result: `${a.correctAnswers}/${a.totalQuestions}`,
                    duration: formatDuration(durationSec),
                    tags: [modeTag, ...partTags]
                } as TestAttempt;
            });
        } else if (!attemptsRes.success) {
            console.error('Failed to load test attempts:', attemptsRes.message);
        }
    } catch (err: any) {
        console.error('Error fetching test info:', err?.message || err);
    }
});
</script>