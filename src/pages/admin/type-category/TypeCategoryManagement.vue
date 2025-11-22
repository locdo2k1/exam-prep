<template>
   <div class="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <!-- Header Section -->
      <div class="mb-8">
         <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 leading-normal"
            style="line-height: 1.5;">
            Types & Categories Management
         </h1>
         <p class="text-sm text-gray-500 dark:text-gray-400">Manage question types and categories</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
         <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8">
               <button @click="activeTab = 'types'" :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'types'
                     ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
               ]">
                  Question Types
               </button>
               <button @click="activeTab = 'categories'" :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'categories'
                     ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
               ]">
                  Question Categories
               </button>
            </nav>
         </div>
      </div>

      <!-- Question Types Tab -->
      <div v-if="activeTab === 'types'">
         <QuestionTypeList />
      </div>

      <!-- Question Categories Tab -->
      <div v-if="activeTab === 'categories'">
         <QuestionCategoryList />
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionTypeList from './QuestionTypeList.vue';
import QuestionCategoryList from './QuestionCategoryList.vue';

const activeTab = ref<'types' | 'categories'>('types');
</script>
