<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-[100000]" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[80vh]">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Select Question Sets</h3>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Search and Filter -->
      <div class="p-4 border-b dark:border-gray-700">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 transition-colors duration-150 sm:text-sm"
            placeholder="Search question sets..."
            @input="handleSearch"
          >
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
        
        <div v-else-if="questionSets.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          No question sets found.
        </div>
        
        <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="questionSet in questionSets" :key="questionSet.id" class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="selectQuestionSet(questionSet)">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ questionSet.title }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex items-center space-x-2">
                <button
                  type="button"
                  class="p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                  @click.stop="previewQuestionSet(questionSet)"
                  title="Preview question set"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span class="sr-only">Preview</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click.stop="selectQuestionSet(questionSet)"
                >
                  Select
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Pagination -->
      <div v-if="!isLoading && questionSets.length > 0" class="bg-gray-50 dark:bg-gray-800/80 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="pagination.page === 0"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 0 }"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page >= pagination.totalPages - 1"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= pagination.totalPages - 1 }"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing page <span class="font-medium">{{ pagination.page + 1 }}</span> of
              <span class="font-medium">{{ pagination.totalPages || 1 }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- Previous Page Button -->
              <button
                @click="previousPage"
                :disabled="pagination.page === 0"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 0 }"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Page Numbers -->
              <template v-if="pagination.totalPages > 0">
                <!-- First Page -->
                <button
                  v-if="pagination.page > 2"
                  @click="goToPage(0)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  1
                </button>
                <span v-if="pagination.page > 3" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ...
                </span>

                <!-- Page Range -->
                <template v-for="page in visiblePages" :key="page">
                  <button
                    @click="goToPage(page - 1)"
                    :class="{
                      'z-10 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-600 text-indigo-600 dark:text-indigo-300': pagination.page === page - 1,
                      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600': pagination.page !== page - 1
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                </template>

                <span v-if="pagination.page < pagination.totalPages - 4" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ...
                </span>
                <!-- Last Page -->
                <button
                  v-if="pagination.page < pagination.totalPages - 3"
                  @click="goToPage(pagination.totalPages - 1)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {{ pagination.totalPages }}
                </button>
              </template>

              <!-- Next Page Button -->
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages - 1"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= pagination.totalPages - 1 }"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between items-center rounded-b-lg border-t border-gray-200 dark:border-gray-700/50">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <i class="fas fa-info-circle mr-1.5 text-indigo-500"></i>
          Review all questions before saving
        </div>
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSave"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-150"
          >
            Save Changes
          </button>
        </div>
      </div>
      
      <!-- Preview Modal -->
      <fwb-modal v-if="showPreviewModal" @close="showPreviewModal = false" size="5xl" class="dark:bg-gray-800 [&>div]:overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between w-full px-1">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              <i class="fas fa-list-check mr-2.5 text-indigo-500 dark:text-indigo-400"></i>
              Question Set Details
            </h3>
            <div class="flex items-center space-x-3">
              <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full shadow-sm" 
                :class="[previewQuestionSetData?.questions?.length ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-100 dark:ring-1 dark:ring-green-800' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-100 dark:ring-1 dark:ring-yellow-800/50']">
                <i class="fas fa-question-circle mr-1.5 text-xs"></i>
                {{ previewQuestionSetData?.questions?.length || 0 }} Questions
              </span>
              <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full shadow-sm dark:bg-blue-900/60 dark:text-blue-100 dark:ring-1 dark:ring-blue-800">
                <i class="fas fa-star mr-1.5 text-xs text-yellow-500"></i>
                {{ previewQuestionSetData?.totalScore || 0 }} Points
              </span>
            </div>
          </div>
        </template>
        
        <template #body>
          <div v-if="isPreviewLoading" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading question set details...</p>
          </div>
          
          <div v-else-if="previewQuestionSetData" class="space-y-6 max-h-[70vh] overflow-y-auto pr-2 -mr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
            <!-- Header Section -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <!-- Header with gradient background -->
              <div class="bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-600 dark:to-blue-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-bold text-white">
                    {{ previewQuestionSetData.title || 'Untitled Question Set' }}
                  </h2>
                  <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                      <i class="fas fa-layer-group mr-1.5"></i>
                      Question Set
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-6 space-y-4">
                <!-- Description -->
                <div v-if="previewQuestionSetData.description" class="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 bg-white p-4 rounded-lg shadow-sm" v-html="previewQuestionSetData.description">
                </div>
                
                <!-- Stats -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div class="flex items-center text-indigo-600 dark:text-indigo-400 mb-1">
                      <i class="fas fa-question-circle text-lg mr-2"></i>
                      <span class="text-sm font-medium">Questions</span>
                    </div>
                    <span class="text-lg font-bold text-gray-800 dark:text-white">{{ previewQuestionSetData.totalQuestions || 0 }}</span>
                  </div>
                  
                  <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div class="flex items-center text-yellow-500 dark:text-yellow-400 mb-1">
                      <i class="fas fa-star text-lg mr-2"></i>
                      <span class="text-sm font-medium">Total Points</span>
                    </div>
                    <span class="text-lg font-bold text-gray-800 dark:text-white">{{ previewQuestionSetData.totalScore || 0 }}</span>
                  </div>
                  
                  <div v-if="previewQuestionSetData.questionAudios?.length" class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div class="flex items-center text-purple-500 dark:text-purple-400 mb-1">
                      <i class="fas fa-music text-lg mr-2"></i>
                      <span class="text-sm font-medium">Audio Files</span>
                    </div>
                    <span class="text-lg font-bold text-gray-800 dark:text-white">{{ previewQuestionSetData.questionAudios.length }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Questions List -->
            <div v-if="previewQuestionSetData.questions?.length" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <i class="fas fa-list-ol mr-2 text-indigo-500"></i>
                Questions
              </h3>
              
              <div class="space-y-5">
                <div v-for="(question, index) in previewQuestionSetData.questions" :key="question.id" 
                     class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
                  <!-- Question Header -->
                  <div class="px-5 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                      <!-- Question Number -->
                      <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-medium mr-3">
                          {{ index + 1 }}
                        </div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Question {{ index + 1 }}
                        </h3>
                      </div>
                      
                      <!-- Question Meta -->
                      <div class="flex items-center space-x-3">
                        <span v-if="question.questionType?.name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ question.questionType.name }}
                        </span>
                        
                        <span v-if="question.score" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          <i class="fas fa-star text-amber-500 mr-1.5"></i>
                          {{ question.score }} points
                        </span>
                        
                        <span v-if="question.questionAudios?.length" class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          <i class="fas fa-headphones text-purple-500 mr-1.5"></i>
                          Audio
                        </span>
                      </div>
                    </div>

                  </div>
                  
                  <!-- Question Content -->
                  <div class="p-4">
                    <!-- Question Prompt -->
                    <div v-if="question.prompt" class="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 mb-4" v-html="question.prompt">
                    </div>
                    
                    <!-- Multiple Choice Options -->
                    <div v-if="question.questionType?.name === 'Multiple Choice' && question.options?.length" class="space-y-2 mt-3">
                      <div v-for="(option, oIndex) in question.options" :key="option.id" 
                           class="flex items-start p-3 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                           :class="{ 'bg-green-50 dark:bg-green-900/30': option.correct }">
                        <div class="flex items-center h-5 mt-0.5">
                          <span class="flex items-center justify-center h-5 w-5 rounded mr-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
                                :class="{ 'bg-indigo-100 border-indigo-500 text-indigo-800 dark:bg-indigo-900/50 dark:border-indigo-600 dark:text-indigo-200': option.correct }">
                            {{ String.fromCharCode(65 + oIndex) }}
                          </span>
                        </div>
                        <div class="text-sm text-gray-800 dark:text-gray-200" :class="{ 'text-green-700 dark:text-green-300 font-medium': option.correct }">
                          {{ option.text }}
                        </div>
                        <div v-if="option.correct" class="ml-2 text-green-500">
                          <i class="fas fa-check-circle"></i>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Fill in the Blank Answers -->
                    <div v-else-if="question.questionType?.name === 'Fill in the Blank' && question.questionAnswers?.length" class="mt-3">
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Acceptable Answers:
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="(answer, aIndex) in question.questionAnswers" :key="aIndex"
                              class="px-2.5 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                          "{{ answer }}"
                        </span>
                      </div>
                    </div>
                    
                    <!-- Audio Files -->
                    <div v-if="question.questionAudios?.length" class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <i class="fas fa-music mr-2 text-purple-500"></i>
                        <span>Audio Files:</span>
                      </div>
                      <div class="space-y-2">
                        <div v-for="(audio, aIndex) in question.questionAudios" :key="aIndex"
                             class="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                          <div class="flex items-center">
                            <i class="fas fa-file-audio text-purple-500 mr-2"></i>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
                              {{ audio.fileName }}
                            </span>
                          </div>
                          <button class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-600">
                            <i class="fas fa-play h-4 w-4"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <i class="fas fa-inbox text-gray-400 text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">No questions yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This question set doesn't contain any questions.</p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <FwbButton @click="showPreviewModal = false" color="alternative" class="mr-2">
              Close
            </FwbButton>
            <FwbButton v-if="previewQuestionSetData" @click="selectQuestionSet(previewQuestionSetData)" color="blue">
              Select This Set
            </FwbButton>
          </div>
        </template>
      </fwb-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { FwbModal, FwbButton } from 'flowbite-vue';
import { questionSetApi } from '@/api/admin/question-set/questionSet';
import type { QuestionSetSimpleVM, QuestionSetViewModel } from '@/api/admin/question-set/questionSet';
import { debounce } from 'lodash';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  selectedQuestionSets: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'select']);

const isLoading = ref(false);
const isPreviewLoading = ref(false);
const searchQuery = ref('');
const questionSets = ref<QuestionSetSimpleVM[]>([]);
const previewQuestionSetData = ref<QuestionSetViewModel | null>(null);
const showPreviewModal = ref(false);
const pagination = ref({
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0
});

// Fetch question sets
const fetchQuestionSets = async () => {
  try {
    isLoading.value = true;
    const { content, totalPages, totalElements, number } = await questionSetApi.getSimpleQuestionSets(
      pagination.value.page,
      pagination.value.size,
      'title',
      'asc',
      searchQuery.value || undefined
    );
    
    questionSets.value = content;
    pagination.value = {
      ...pagination.value,
      totalPages,
      totalElements,
      page: number
    };
  } catch (error) {
    console.error('Failed to fetch question sets:', error);
  } finally {
    isLoading.value = false;
  }
};

// Handle search with debounce
const handleSearch = debounce(() => {
  pagination.value.page = 0; // Reset to first page when searching
  fetchQuestionSets();
}, 300);

// Computed property for visible page numbers
const visiblePages = computed(() => {
  const current = pagination.value.page + 1; // Convert to 1-based for display
  const total = pagination.value.totalPages;
  const range = [];
  
  // Always show current page and one page before/after
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  
  // Add pages in range
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
});

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 0 && page < pagination.value.totalPages && page !== pagination.value.page) {
    pagination.value.page = page;
    fetchQuestionSets();
    // Scroll to top of the list
    const modalContent = document.querySelector('.custom-scrollbar');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages - 1) {
    goToPage(pagination.value.page + 1);
  }
};

const previousPage = () => {
  if (pagination.value.page > 0) {
    goToPage(pagination.value.page - 1);
  }
};

// Calculate total score from questions array
const calculateTotalScore = (questions: any[] | undefined): number => {
  if (!questions || !Array.isArray(questions)) return 0;
  return questions.reduce((sum, question) => sum + (question.score || 0), 0);
};

// Handle question set preview
const previewQuestionSet = async (questionSet: QuestionSetSimpleVM) => {
  try {
    isPreviewLoading.value = true;
    const response = await questionSetApi.getById(questionSet.id);
    
    // Ensure we're using the data from the response
    const data = response.data || response;
    
    // Ensure questions array exists and is properly initialized
    if (!data.questions) {
      data.questions = [];
    }
    
    // Calculate total questions and score if not provided
    if (data.questions) {
      data.totalQuestions = data.questions.length;
      data.totalScore = calculateTotalScore(data.questions);
    } else {
      data.totalQuestions = 0;
      data.totalScore = 0;
    }
    
    previewQuestionSetData.value = data;
    showPreviewModal.value = true;
  } catch (error) {
    console.error('Failed to fetch question set details:', error);
    // Initialize with minimal required properties if there's an error
    previewQuestionSetData.value = {
      id: questionSet.id,
      title: questionSet.title,
      description: '',
      order: 0,
      questions: [],
      totalQuestions: 0,
      totalScore: 0,
      questionAudios: []
    } as QuestionSetViewModel;
    showPreviewModal.value = true;
  } finally {
    isPreviewLoading.value = false;
  }
};

// Handle question set selection
const selectQuestionSet = (questionSet: QuestionSetSimpleVM | QuestionSetViewModel) => {
  emit('select', questionSet);
  emit('close');
};

// Reset all input and filter states when modal is closed
const closeModal = () => {
  // Reset search query
  searchQuery.value = '';
  
  // Reset pagination to first page
  pagination.value = {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  };
  
  // Emit close event
  emit('close');
};

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    fetchQuestionSets();
  } else {
    searchQuery.value = ''; // Clear search when closing
  }
});

// Initial fetch
onMounted(() => {
  if (props.isOpen) {
    fetchQuestionSets();
  }
});
</script>

<style scoped>
/* Custom scrollbar styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 5px;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background-color: #374151;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 5px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

/* For Firefox */
.custom-scrollbar {
  scrollbar-width: 10px;
  scrollbar-color: rgba(209, 213, 219, 0.5) rgba(243, 244, 246, 0.5);
}

.dark .custom-scrollbar {
  scrollbar-color: rgba(75, 85, 99, 0.5) rgba(55, 65, 81, 0.5);
}
</style>
