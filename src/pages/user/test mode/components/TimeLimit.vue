<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <select 
      v-model="selectedLimit" 
      class="w-full p-2 border border-gray-300 rounded-md bg-white"
    >
      <option value="">Không giới hạn thời gian</option>
      <option v-for="option in timeOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

interface TimeOption {
  value: number;
  label: string;
}

interface Props {
  modelValue?: number | null;
  label?: string;
  timeOptions?: TimeOption[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: 'Giới hạn thời gian (Để trống để làm bài không giới hạn)',
  timeOptions: () => [
    { value: 5, label: '5 phút' },
    { value: 10, label: '10 phút' },
    { value: 15, label: '15 phút' },
    { value: 20, label: '20 phút' },
    { value: 25, label: '25 phút' },
    { value: 30, label: '30 phút' },
    { value: 40, label: '40 phút' },
    { value: 60, label: '60 phút' },
    { value: 90, label: '90 phút' },
    { value: 120, label: '120 phút' },
    { value: 150, label: '150 phút' },
    { value: 180, label: '180 phút' }
  ]
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const selectedLimit = ref<number | null>(props.modelValue || null);

// Watch for changes in selectedLimit and emit update event
watch(selectedLimit, (newValue) => {
  emit('update:modelValue', newValue);
});

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newValue) => {
  selectedLimit.value = newValue || null;
}, { immediate: true });
</script>
