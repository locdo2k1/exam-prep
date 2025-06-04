<template>
   <div class="relative z-20 bg-transparent" v-click-outside="closeDropdown">
      <!-- Search input with debounce -->
      <input type="text" v-model="searchQuery" :placeholder="placeholder" @input="debouncedSearch" @focus="handleFocus"
         class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />

      <!-- Loading indicator -->
      <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
         <div
            class="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin dark:border-brand-400">
         </div>
      </div>

      <!-- Dropdown list -->
      <div v-if="isOpen"
         class="absolute w-full mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
         <div class="max-h-60 overflow-y-auto custom-scrollbar">
            <!-- Options list -->
            <div v-for="option in options" :key="option[valueKey]" @click="selectOption(option)"
               class="px-4 py-2.5 cursor-pointer transition-colors duration-150 flex items-center justify-between group"
               :class="{
                  'bg-gray-50 dark:bg-gray-800/50 text-blue-600 dark:text-brand-400': modelValue === option[valueKey],
                  'hover:bg-gray-50 dark:hover:bg-gray-800/30': modelValue !== option[valueKey]
               }">
               <span :class="{ 'text-gray-800 dark:text-white/90': modelValue !== option[valueKey] }">
                  {{ option[labelKey] }}
               </span>
               <svg v-if="modelValue === option[valueKey]" class="w-5 h-5 text-blue-600 dark:text-brand-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
               </svg>
            </div>

            <!-- Load more button -->
            <div v-if="hasMore" @click.stop="$emit('load-more')"
               class="px-4 py-2 text-sm text-blue-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer text-center">
               {{ loadMoreText }}
            </div>

            <!-- Empty state -->
            <div v-if="options.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
               {{ loading ? loadingText : noOptionsText }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
   modelValue: {
      type: [String, Number],
      default: ''
   },
   options: {
      type: Array,
      default: () => []
   },
   valueKey: {
      type: String,
      default: 'value'
   },
   labelKey: {
      type: String,
      default: 'label'
   },
   loading: {
      type: Boolean,
      default: false
   },
   hasMore: {
      type: Boolean,
      default: false
   },
   placeholder: {
      type: String,
      default: 'Search...'
   },
   loadingText: {
      type: String,
      default: 'Searching...'
   },
   noOptionsText: {
      type: String,
      default: 'No options found'
   },
   loadMoreText: {
      type: String,
      default: 'Load more...'
   }
});

const emit = defineEmits(['update:modelValue', 'search', 'load-more', 'focus']);

const isOpen = ref(false);
const searchQuery = ref('');

const debounce = (fn, delay) => {
   let timeoutId = null;
   return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
   };
};

const debouncedSearch = debounce(() => {
   emit('search', searchQuery.value);
}, 300);

const handleFocus = () => {
   isOpen.value = true;
   emit('focus');
};

const selectOption = (option) => {
   emit('update:modelValue', option[props.valueKey]);
   searchQuery.value = option[props.labelKey];
   isOpen.value = false;
};

const closeDropdown = () => {
   isOpen.value = false;
};

// Click outside directive
const vClickOutside = {
   mounted(el, binding) {
      el._clickOutside = (event) => {
         if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
         }
      };
      document.addEventListener('click', el._clickOutside);
   },
   unmounted(el) {
      document.removeEventListener('click', el._clickOutside);
   }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
   width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
   background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(156, 163, 175, 0.3);
   border-radius: 3px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
   background-color: rgba(156, 163, 175, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
   background-color: rgba(156, 163, 175, 0.5);
}
</style>