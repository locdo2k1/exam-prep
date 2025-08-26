<template>
  <div class="px-6 pt-2">
    <fwb-tabs v-model="activeTab" variant="pills" class="inline-flex p-1 rounded-lg">
      <fwb-tab 
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :title="tab.title"
        :active="activeTab === tab.name"
        class="py-2 px-4 rounded-md text-sm font-medium"
      />
    </fwb-tabs>
    
    <div class="mt-4">
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, defineEmits, watch } from 'vue';
import { FwbTabs, FwbTab } from 'flowbite-vue';

interface Tab {
  name: string;
  title: string;
}

interface Props {
  modelValue: string;
  tabs: Tab[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'test-info',
  tabs: () => [
    { name: 'test-info', title: 'Thông tin đề thi' },
    { name: 'answers', title: 'Đáp án/transcript' }
  ]
});

const emit = defineEmits(['update:modelValue']);

const activeTab = ref(props.modelValue);

// Watch for changes in activeTab and emit update event
watch(activeTab, (newValue: string) => {
  emit('update:modelValue', newValue);
});

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newValue: string) => {
  activeTab.value = newValue;
});
</script>
