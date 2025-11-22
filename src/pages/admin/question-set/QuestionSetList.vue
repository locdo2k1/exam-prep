<template>
    <div class="relative w-full px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Question Sets</h1>
            <router-link to="/admin/question-sets/create"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-150">
                <PlusIcon class="h-3 w-3 mr-1" />
                <span>Add</span>
            </router-link>

        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <DataTable :data="questionSets" :columns="columns" :actions="actions" :loading="loading"
                :total-items="totalItems" :current-page="currentPage" :items-per-page="itemsPerPage" :searchable="true"
                :server-side-pagination="true" search-placeholder="Search question sets..."
                @update:current-page="handlePageChange" @sort="handleSort" @search="handleSearch" />
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="cancelDelete"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-hidden">
                    <div class="p-6">
                        <div class="flex items-center">
                            <div
                                class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 class="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                                Delete Question Set
                            </h3>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 dark:text-gray-300">
                                Are you sure you want to delete this question set? This action cannot be undone.
                            </p>
                        </div>
                        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button type="button"
                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                                :disabled="deleting" @click="confirmDelete">
                                <span v-if="deleting" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Deleting...
                                </span>
                                <span v-else>Delete</span>
                            </button>
                            <button type="button"
                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                :disabled="deleting" @click="cancelDelete">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Question Set Preview Modal -->
        <div v-if="isModalOpen && previewData" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            @click.self="closeModal">
            <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" @click="closeModal"></div>
            <div
                class="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl dark:bg-gray-800 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                <!-- Header with Gradient -->
                <div
                    class="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900">
                    <div class="px-6 py-4">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 pr-8">
                                <div class="flex items-center space-x-2 mb-1.5">
                                    <div
                                        class="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 class="text-2xl font-bold text-white">
                                        {{ previewData.title || 'Question Set Preview' }}
                                    </h3>
                                </div>
                                <div class="flex items-center space-x-4 text-blue-100">
                                    <span class="inline-flex items-center text-sm">
                                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {{ previewData.questions?.length || 0 }} Questions
                                    </span>
                                    <span class="inline-flex items-center text-sm">
                                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Total Points: {{previewData.questions?.reduce((sum, q) => sum + (q.score || 0),
                                        0) || 0 }}
                                    </span>
                                </div>
                            </div>
                            <button @click="closeModal"
                                class="flex-shrink-0 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Question Set Description -->
                    <div v-if="previewData.description" class="px-6 pb-4">
                        <div
                            class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl max-h-24 overflow-y-auto custom-scrollbar-light">
                            <div class="flex items-start space-x-2.5 p-3.5">
                                <svg class="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div class="flex-1 prose dark:prose-invert prose-sm max-w-none text-white/95 text-sm"
                                    v-html="previewData.description"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Questions List with Enhanced Styling -->
                <div class="overflow-y-auto max-h-[65vh] bg-gray-50 dark:bg-gray-900/50">
                    <div v-if="!previewData.questions?.length"
                        class="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                        <svg class="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-lg font-medium">No questions in this set</p>
                    </div>

                    <div v-else class="p-4 space-y-3">
                        <div v-for="(question, qIndex) in previewData.questions" :key="question.id"
                            class="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
                            <!-- Question Header with Enhanced Design -->
                            <div
                                class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/70 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2">
                                        <div
                                            class="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-lg font-bold text-xs">
                                            {{ qIndex + 1 }}
                                        </div>
                                        <span class="font-semibold text-gray-900 dark:text-white text-base">Question {{
                                            qIndex + 1 }}</span>
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm"
                                            :class="question.questionCategory?.skill === 'Listening'
                                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                                : 'bg-green-500 text-white dark:bg-green-600'">
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path v-if="question.questionCategory?.skill === 'Listening'"
                                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                <path v-else stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            {{ question.questionCategory?.skill || 'General' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span
                                            class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-xs font-semibold">
                                            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            {{ question.score || 0 }} {{ question.score !== 1 ? 'points' : 'point' }}
                                        </span>
                                    </div>
                                </div>
                                <div v-if="question.questionCategory"
                                    class="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {{ question.questionCategory.name }}
                                </div>
                            </div>

                            <!-- Question Content with Better Spacing -->
                            <div class="p-4">
                                <div v-if="question.description"
                                    class="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg">
                                    <div class="prose dark:prose-invert prose-sm max-w-none text-amber-900 dark:text-amber-100"
                                        v-html="question.description"></div>
                                </div>

                                <div v-if="question.prompt"
                                    class="mb-3 prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
                                    v-html="question.prompt"></div>

                                <!-- Enhanced Audio Player -->
                                <div v-if="question.questionAudios?.length"
                                    class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                        <span class="text-xs font-semibold text-blue-800 dark:text-blue-200">Audio
                                            Track</span>
                                    </div>
                                    <audio controls class="w-full h-9">
                                        <source :src="question.questionAudios[0].url" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>

                                <!-- Enhanced Options Display -->
                                <div v-if="question.options?.length" class="space-y-2">
                                    <h5
                                        class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Answer Options
                                    </h5>
                                    <div v-for="(option, oIndex) in question.options" :key="option.id"
                                        class="group/option relative flex items-start p-2.5 rounded-lg border transition-all duration-200"
                                        :class="{
                                            'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/30 shadow-sm': option.correct,
                                            'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700/50': !option.correct
                                        }">
                                        <div class="flex items-center justify-center w-6 h-6 rounded-full mr-2.5 flex-shrink-0 font-semibold text-xs"
                                            :class="option.correct
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'">
                                            {{ String.fromCharCode(65 + oIndex) }}
                                        </div>
                                        <span class="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed text-sm">{{
                                            option.text }}</span>
                                        <span v-if="option.correct"
                                            class="ml-3 flex items-center px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-semibold shadow-sm">
                                            <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                            Correct
                                        </span>
                                    </div>
                                </div>

                                <!-- Enhanced Question Answers Display -->
                                <div v-else-if="question.questionAnswers?.length" class="space-y-2">
                                    <div
                                        class="p-3 rounded-lg border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20">
                                        <h5
                                            class="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center text-sm">
                                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Correct Answer
                                        </h5>
                                        <div class="space-y-2">
                                            <div v-for="(answer, aIndex) in question.questionAnswers" :key="aIndex"
                                                class="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                                                <div class="prose dark:prose-invert prose-sm max-w-none text-sm"
                                                    v-html="answer.text"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Footer -->
                <div class="bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg">
                    <div class="px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div
                                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span v-if="previewData?.questions?.length">
                                    {{ previewData.questions.length }} {{ previewData.questions.length !== 1 ?
                                    'Questions' : 'Question' }}
                                </span>
                                <span v-else>No Questions</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2.5">
                            <button @click="closeModal" type="button"
                                class="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-500 transition-all duration-200">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close
                            </button>
                            <button v-if="previewData?.id"
                                @click="$router.push({ name: 'admin-question-sets-edit', params: { id: previewData.id } })"
                                type="button"
                                class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Question Set
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { PlusIcon } from '@heroicons/vue/24/outline';
import DataTable from '@/components/DataTable.vue';

import { questionSetApi } from '@/api/admin/question-set/questionSet';

export default {
    name: 'QuestionSetList',
    components: {
        DataTable,
        PlusIcon
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        // State
        const questionSets = ref([]);
        const loading = ref(false);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const totalItems = ref(0);
        const sortBy = ref('order');
        const sortDirection = ref('asc');
        const searchQuery = ref('');
        const showDeleteModal = ref(false);
        const deleting = ref(false);
        const itemToDelete = ref(null);
        const isModalOpen = ref(false);
        const previewData = ref(null);

        // Modal methods
        const openModal = async (item) => {
            try {
                loading.value = true;
                // Set basic data first
                previewData.value = item;
                isModalOpen.value = true;

                console.log(item);

            } catch (error) {
                toast.error('Failed to load question details');
            } finally {
                loading.value = false;
            }
        };

        const closeModal = () => {
            isModalOpen.value = false;
            previewData.value = null;
        };

        // Table columns
        const columns = [
            {
                key: 'title',
                label: 'Title',
                sortable: true,
            },
            {
                key: 'description',
                label: 'Description',
                sortable: false,
                hideOnMobile: true,
                render: (value) => value || '—',
            },
            {
                key: 'order',
                label: 'Order',
                sortable: true,
                align: 'center',
                width: '100px',
            },
            {
                key: 'totalQuestions',
                label: 'Total Questions',
                sortable: true,
                align: 'center',
                width: '120px',
            },
            {
                key: 'questions',
                label: 'Questions',
                sortable: false,
                align: 'center',
                width: '200px',
                render: (value, row) => {
                    if (!row.questions?.length) return '—';
                    return row.questions
                        .slice(0, 3)
                        .map(q => `• ${q.prompt || ''}`)
                        .join('<br>');
                }
            },
            {
                key: 'totalScore',
                label: 'Total Score',
                sortable: true,
                align: 'center',
                width: '120px',
            },
        ];

        // Icons for actions as strings
        const previewIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        `;

        const editIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        `;

        const duplicateIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        `;

        const archiveIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <rect width="20" height="5" x="2" y="4" rx="2" />
            <path d="M4 9v9.5C4 19.9 5.1 21 6.5 21h11c1.4 0 2.5-1.1 2.5-2.5V9" />
            <path d="M10 13h4" />
          </svg>
        `;

        const deleteIcon = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-4 h-4" stroke-width="1.5">
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        `;

        // Table actions
        const actions = [
            {
                label: 'Preview',
                icon: previewIcon,
                handler: (item) => {
                    openModal(item);
                },
                class: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/30',
            },
            {
                label: 'Edit',
                icon: editIcon,
                handler: (item) => {
                    router.push({ name: 'admin-question-bank-question-sets-edit', params: { id: item.id } });
                },
                class: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',
            },
            {
                label: 'Delete',
                icon: deleteIcon,
                handler: (item) => {
                    itemToDelete.value = item;
                    showDeleteModal.value = true;
                },
                class: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30',
            },
        ];

        // Fetch question sets with pagination and sorting
        const fetchQuestionSets = async () => {
            try {
                loading.value = true;

                // Prepare the filter object with pagination and sorting
                const filter = {
                    search: searchQuery.value || undefined, // Using search to search in both title and description
                    page: currentPage.value - 1, // Backend is 0-based
                    size: itemsPerPage.value,
                    sort: sortBy.value,
                    direction: sortDirection.value,
                };

                const response = await questionSetApi.getAll(filter);

                if (response) {
                    // Update the question sets list
                    questionSets.value = response.content || [];
                    totalItems.value = response.totalElements || 0;

                    // Calculate total pages from the API response
                    const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);

                    // If current page is out of bounds, adjust and refetch
                    if (currentPage.value > totalPages && totalPages > 0) {
                        currentPage.value = totalPages;
                        return fetchQuestionSets(); // Refetch with corrected page
                    }

                } else {
                    questionSets.value = [];
                    totalItems.value = 0;
                    currentPage.value = 1;
                }
            } catch (error) {
                toast.error('Failed to load question sets');
            } finally {
                loading.value = false;
            }
        };

        // Handle page change
        const handlePageChange = (page) => {
            if (currentPage.value !== page) {
                currentPage.value = page;
                fetchQuestionSets();
            }
        };

        // Handle sort
        const handleSort = ({ sortBy: key, sortDirection: direction }) => {
            sortBy.value = key;
            sortDirection.value = direction;
            currentPage.value = 1; // Reset to first page when sorting
            fetchQuestionSets();
        };

        // Handle search
        const handleSearch = (query) => {
            searchQuery.value = query;
            currentPage.value = 1; // Reset to first page when searching
            fetchQuestionSets();
        };

        // Handle delete confirmation
        const confirmDelete = async () => {
            if (!itemToDelete.value) return;

            try {
                deleting.value = true;
                await questionSetApi.delete(itemToDelete.value.id);
                toast.success('Question set deleted successfully');
                fetchQuestionSets();
            } catch (error) {
                toast.error('Failed to delete question set');
            } finally {
                deleting.value = false;
                showDeleteModal.value = false;
                itemToDelete.value = null;
            }
        };

        // Cancel delete
        const cancelDelete = () => {
            showDeleteModal.value = false;
            itemToDelete.value = null;
        };

        // Initial fetch
        onMounted(() => {
            fetchQuestionSets();
        });


        return {
            // State
            questionSets,
            loading,
            currentPage,
            itemsPerPage,
            totalItems,
            showDeleteModal,
            deleting,
            itemToDelete,
            isModalOpen,
            previewData,

            // Table config
            columns,
            actions,

            // Modal methods
            openModal,
            closeModal,

            // Methods
            handlePageChange,
            handleSort,
            handleSearch,
            confirmDelete,
            cancelDelete,
        };
    },
};
</script>

<style scoped>
/* Custom scrollbar styles */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

/* Webkit browsers (Chrome, Safari, etc.) */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 4px;
    border: 2px solid #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
}

/* Dark mode styles */
.dark .custom-scrollbar {
    scrollbar-color: #4a5568 #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-color: #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #718096;
}

/* Light scrollbar for gradient background */
.custom-scrollbar-light {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1);
}

.custom-scrollbar-light::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar-light::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.custom-scrollbar-light::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

.custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.7);
}
</style>
