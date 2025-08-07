<template>
    <div class="min-h-screen bg-[#F5F5F5] p-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header Tags -->
            <div class="mb-4">
                <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">#IELTS
                    Academic</span>
                <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">#Listening</span>
            </div>

            <!-- Main Test Card -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <!-- Test Title with Check Icon -->
                <div class="p-6">
                    <h1 class="text-2xl font-bold text-gray-900 flex items-center">
                        {{ test?.title || 'IELTS Simulation Listening test 1' }}
                        <svg class="w-6 h-6 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                    </h1>
                </div>

                <!-- Test Details Tabs -->
                <div class="px-6 pt-2">
                    <fwb-tabs v-model="activeTab" variant="pills" class="inline-flex p-1 rounded-lg">
                        <fwb-tab name="test-info" title="Thông tin đề thi" :active="activeTab === 'test-info'" class="py-2 px-4 rounded-md text-sm font-medium" />
                        <fwb-tab name="answers" title="Đáp án/transcript" :active="activeTab === 'answers'" class="py-2 px-4 rounded-md text-sm font-medium" />
                    </fwb-tabs>
                    
                    <!-- Tab Panels -->
                    <div class="mt-4">
                        <div v-if="activeTab === 'test-info'" class="p-6">
                            <!-- Test Stats -->
                            <div class="flex items-center space-x-6 mb-4">
                                <div class="flex items-center text-sm text-gray-600">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Thời gian làm bài: 40 phút | 4 phần thi | 40 câu hỏi | 3 | 67 bình luận
                                </div>
                            </div>

                            <div class="flex items-center text-sm text-gray-600 mb-6">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                114679 người đã luyện tập đề thi này
                            </div>

                            <!-- Note -->
                            <div class="bg-red-50 border border-red-200 rounded p-3 mb-6">
                                <p class="text-sm text-red-600">
                                    <strong>Chú ý:</strong> đề được quy đổi sang scaled score (và dy trên thang điểm
                                    9.0 cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL TEST
                                </p>
                            </div>

                            <!-- Test History -->
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold mb-4">Kết quả làm bài của bạn:</h3>

                                <div class="overflow-x-auto">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="text-left text-sm text-gray-600 border-b">
                                                <th class="pb-2">Ngày làm</th>
                                                <th class="pb-2">Kết quả</th>
                                                <th class="pb-2">Thời gian làm bài</th>
                                                <th class="pb-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-sm">
                                            <tr class="border-b">
                                                <td class="py-3">
                                                    <div>02/08/2025</div>
                                                    <div class="flex space-x-1 mt-1">
                                                        <span
                                                            class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">PART
                                                            1</span>
                                                    </div>
                                                </td>
                                                <td class="py-3 text-blue-600 font-medium">0/40</td>
                                                <td class="py-3">0:00:07</td>
                                                <td class="py-3">
                                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Xem
                                                        chi tiết</button>
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="py-3">
                                                    <div>02/08/2025</div>
                                                    <div class="flex space-x-1 mt-1">
                                                        <span
                                                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Luyện
                                                            tập 1</span>
                                                        <span
                                                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Recording
                                                            1</span>
                                                        <span
                                                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Recording
                                                            2</span>
                                                    </div>
                                                </td>
                                                <td class="py-3 text-blue-600 font-medium">1/20</td>
                                                <td class="py-3">0:00:15</td>
                                                <td class="py-3">
                                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Xem
                                                        chi tiết</button>
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="py-3">
                                                    <div>02/08/2025</div>
                                                    <div class="flex space-x-1 mt-1">
                                                        <span
                                                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Luyện
                                                            tập 1</span>
                                                        <span
                                                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Recording
                                                            1</span>
                                                    </div>
                                                </td>
                                                <td class="py-3 text-blue-600 font-medium">0/10</td>
                                                <td class="py-3">0:00:46</td>
                                                <td class="py-3">
                                                    <button class="text-blue-600 hover:text-blue-800 text-sm">Xem
                                                        chi tiết</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Practice Options Tabs -->
                            <div class="mb-6">
                                <div class="flex space-x-6 border-b border-gray-200">
                                    <button
                                        class="pb-2 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">Luyện
                                        tập</button>
                                    <button class="pb-2 border-b-2 border-transparent text-gray-500 text-sm">Làm
                                        full test</button>
                                    <button class="pb-2 border-b-2 border-transparent text-gray-500 text-sm">Thảo
                                        luận</button>
                                </div>
                            </div>

                            <!-- Pro Tip -->
                            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div class="flex items-start">
                                    <svg class="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <div>
                                        <p class="text-sm text-green-800">
                                            <strong>💡 Pro tips:</strong> Hình thức luyện tập từng phần và chọn chức
                                            thời gian phù hợp sẽ giúp bạn tập trung vào giải quyết các câu hỏi bài
                                            thay vì phải chịu áp lực hoàn thành bài thi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Recording Selection -->
                            <div class="mb-6">
                                <h3 class="font-medium mb-4">Chọn phần thi bạn muốn làm</h3>

                                <div class="space-y-3">
                                    <label class="flex items-start space-x-3">
                                        <input type="checkbox" class="mt-1" />
                                        <div>
                                            <div class="font-medium">Recording 1 (10 câu hỏi)</div>
                                            <div class="text-sm text-gray-600">
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">#Listening|
                                                    Note-Form Completion</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-3">
                                        <input type="checkbox" class="mt-1" />
                                        <div>
                                            <div class="font-medium">Recording 2 (10 câu hỏi)</div>
                                            <div class="text-sm text-gray-600">
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">#Listening|
                                                    Table Completion</span>
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">#Listening|
                                                    Multiple Choice</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-3">
                                        <input type="checkbox" class="mt-1" />
                                        <div>
                                            <div class="font-medium">Recording 3 (10 câu hỏi)</div>
                                            <div class="text-sm text-gray-600">
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">#Listening|
                                                    Note-Form Completion</span>
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">#Listening|
                                                    Table Completion</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-3">
                                        <input type="checkbox" class="mt-1" />
                                        <div>
                                            <div class="font-medium">Recording 4 (10 câu hỏi)</div>
                                            <div class="text-sm text-gray-600">
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">#Listening|
                                                    Summary/Flow-chart Completion</span>
                                                <span
                                                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">#Listening|
                                                    Matching</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Time Limit Dropdown -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Giới hạn thời gian (Để trống để làm bài không giới hạn)
                                </label>
                                <select class="w-full p-2 border border-gray-300 rounded-md bg-white">
                                    <option>-- Chọn thời gian --</option>
                                    <option>10 phút</option>
                                    <option>20 phút</option>
                                    <option>30 phút</option>
                                    <option>40 phút</option>
                                </select>
                            </div>

                            <!-- Start Button -->
                            <button @click="startTest"
                                class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                :disabled="loading">
                                <span v-if="!loading">LUYỆN TẬP</span>
                                <span v-else class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Loading...
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    <div v-if="activeTab === 'answers'" class="p-6">
                        <p>Nội dung đáp án và transcript sẽ được hiển thị tại đây.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { FwbTabs, FwbTab } from 'flowbite-vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestStore } from '@/stores/test';

const route = useRoute();
const router = useRouter();
const testStore = useTestStore();

const selectedRecordings = ref<string[]>([]);
const timeLimit = ref<string>('');

const test = computed(() => testStore.currentTest);
const loading = computed(() => testStore.loading);
const activeTab = ref('test-info');

const startTest = () => {
    // Navigate to test taking page
    router.push(`/test/${route.params.id}/take`);
};

// Fetch test data on component mount
onMounted(async () => {
    const testId = route.params.id as string;
    if (testId) {
        try {
            // await testStore.fetchTest(testId);
        } catch (error) {
            console.error('Failed to fetch test:', error);
        }
    }
});
</script>