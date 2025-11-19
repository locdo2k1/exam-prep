<template>
    <div class="min-h-screen bg-gray-50">
        <main class="max-w-7xl mx-auto px-4 py-8">

            <!-- Categories -->
            <div class="mb-7">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">Thư viện đề thi</h1>
                <div class="mb-4">
                    <div v-if="isLoading" class="flex flex-wrap gap-2">
                        <div v-for="i in 5" :key="i" class="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div v-else-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>
                    <div v-else class="flex flex-wrap gap-2">
                        <button v-for="category in categories" :key="category.code"
                            @click="activeCategory = category.code" :class="[
                                'px-4 py-2 rounded-lg transition whitespace-nowrap',
                                activeCategory === category.code
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                            {{ category.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="mb-6 flex gap-3">
                <div class="flex-1 relative">
                    <input type="text" v-model="searchQuery"
                        placeholder="Nhập từ khóa bạn muốn tìm kiếm: tên sách, dạng câu hỏi ..."
                        class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <svg class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <button @click="handleSearch"
                    class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Tìm kiếm
                </button>
            </div>

            <!-- Exam Cards Grid -->
            <div v-if="isLoadingTests" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow p-5">
                    <div class="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div class="space-y-2 mb-4">
                        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
            <div v-else-if="testError" class="text-center py-8">
                <p class="text-red-500 mb-4">{{ testError }}</p>
                <button @click="fetchTests" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Thử lại
                </button>
            </div>
            <div v-else-if="tests.length === 0" class="text-center py-8">
                <p class="text-gray-500">Không tìm thấy đề thi nào</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div v-for="test in tests" :key="test.id"
                    class="bg-white rounded-lg shadow hover:shadow-lg p-5 flex flex-col">

                    <div class="flex-grow">
                        <h3 class="font-semibold text-gray-900 mb-4 text-base leading-tight">
                            {{ test.testName }}
                        </h3>

                        <div class="space-y-2 mb-4">
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{{ test.duration }}</span>
                                <span class="mx-1">|</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                                <span>{{ test.practicedUsers.toLocaleString() }}</span>
                            </div>

                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                    </path>
                                </svg>
                                <span>{{ test.comments }}</span>
                            </div>

                            <p class="text-sm text-gray-600">{{ test.sections }} phần thi | {{ test.questions }} câu hỏi
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-4">
                            <span v-for="(skill, i) in test.skills" :key="i"
                                class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {{ skill }}
                            </span>
                        </div>
                    </div>

                    <button @click="viewDetails(test)"
                        class="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium mt-auto">
                        Chi tiết
                    </button>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="!isLoadingTests && tests.length > 0" class="flex justify-center items-center gap-4 mb-8">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" :class="[
                    'px-4 py-2 rounded-lg font-medium',
                    currentPage === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                ]">
                    Trang trước
                </button>
                <span class="text-gray-700">
                    Trang {{ currentPage + 1 }} / {{ totalPages }}
                </span>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" :class="[
                    'px-4 py-2 rounded-lg font-medium',
                    currentPage >= totalPages - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                ]">
                    Trang sau
                </button>
            </div>

            <!-- Promotional Banners -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-8 text-white">
                    <div class="text-4xl font-bold mb-2">IELTS</div>
                    <div class="text-xl font-semibold mb-1">COMBO INTENSIVE COURSES</div>
                    <div class="text-lg">Listening - Reading - Writing - Speaking</div>
                </div>

                <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
                    <div class="text-2xl font-bold mb-2">Tra từ điển, tạo flashcards</div>
                    <div class="text-2xl font-bold mb-4">mọi lúc mọi nơi</div>
                    <div class="text-3xl font-bold">STUDY4 EXTENSION</div>
                </div>
            </div>

            <!-- Social Section -->
            <div class="mt-8 text-center">
                <h2 class="text-2xl font-bold text-gray-900">Tham gia nhóm facebook</h2>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getAllTestCategories, getTestList } from '@/api/admin/test-category/testCategoryApi';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Category state
const searchQuery = ref('');
const activeCategory = ref('all');
const isLoading = ref(true);
const error = ref(null);
const categories = ref([
    { id: 'all', code: 'all', name: 'Tất cả' } // Default 'All' category
]);

// Test list state
const tests = ref([]);
const isLoadingTests = ref(false);
const testError = ref(null);
const currentPage = ref(0);
const pageSize = ref(12);
const totalPages = ref(0);
const totalElements = ref(0);

// Fetch categories from API
const fetchCategories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await getAllTestCategories();
        if (response.success && response.data) {
            // Add the fetched categories after the 'All' category
            categories.value = [
                categories.value[0], // Keep the 'All' category
                ...response.data
            ];
        }
    } catch (err) {
        console.error('Error fetching categories:', err);
        error.value = 'Không thể tải danh mục. Vui lòng thử lại sau.';
        toast.error('Có lỗi xảy ra khi tải danh mục');
    } finally {
        isLoading.value = false;
    }
};

// Fetch tests from API
const fetchTests = async () => {
    isLoadingTests.value = true;
    testError.value = null;
    try {
        // Get the selected category ID (null for 'all')
        const categoryId = activeCategory.value === 'all'
            ? undefined
            : categories.value.find(cat => cat.code === activeCategory.value)?.id;

        const response = await getTestList(
            categoryId,
            searchQuery.value.trim() || undefined,
            {
                page: currentPage.value,
                size: pageSize.value,
                sort: [{ property: 'insertedAt', direction: 'desc' }]
            }
        );

        if (response.success && response.data) {
            console.log(response);
            tests.value = response.data.content;
            totalPages.value = response.data.totalPages;
            totalElements.value = response.data.totalElements;
        }
    } catch (err) {
        console.error('Error fetching tests:', err);
        testError.value = 'Không thể tải danh sách đề thi. Vui lòng thử lại sau.';
        toast.error('Có lỗi xảy ra khi tải đề thi');
    } finally {
        isLoadingTests.value = false;
    }
};

// Watch for category changes
watch(activeCategory, () => {
    currentPage.value = 0; // Reset to first page
    fetchTests();
});

// Handle search
const handleSearch = () => {
    currentPage.value = 0; // Reset to first page
    fetchTests();
};

// Handle page change
const changePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages.value) {
        currentPage.value = newPage;
        fetchTests();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Import the router
import { useRouter } from 'vue-router';

// Initialize router
const router = useRouter();

// View test details
const viewDetails = (test) => {
    console.log('View details for:', test.testName);
    // Navigate to test details page
    router.push({
        name: 'test-details',
        params: { id: test.id }
    });
};

// Load data when component is mounted
onMounted(() => {
    fetchCategories();
    fetchTests();
});
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>