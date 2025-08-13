<template>
  <div class="p-4 text-center">
    <h1 class="text-xl font-semibold">{{ testTitle }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useExamTestStore } from '@/stores/examTestStore';

export default defineComponent({
  name: 'TestHeader',
  
  setup() {
    const examStore = useExamTestStore();

    const testTitle = computed(() => examStore.state.testData?.testName);
    const timeLeft = computed(() => {
      // You can implement your time calculation logic here
      return examStore.state.testData ? '01:30:00' : '';
    });
    const isTestActive = ref(true); // Default to true since we don't have this in the store yet

    const toggleTest = () => {
      // Toggle test active state logic here
      // You might want to update this in the store
      // examStore.toggleTestActive();
    };

    return {
      testTitle,
      timeLeft,
      isTestActive,
      toggleTest
    };
  }
});
</script>