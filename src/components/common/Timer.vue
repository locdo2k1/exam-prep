<template>
  <div class="text-center">
    <div class="flex items-center justify-center space-x-2 mb-3">
      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div class="text-sm font-medium text-gray-600">Thời gian làm bài</div>
    </div>

    <div class="text-3xl font-bold text-blue-600 mb-5 bg-blue-50 py-3 px-6 rounded-lg inline-block">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'Timer',

  props: {
    // Whether the timer should start automatically when mounted
    autoStart: {
      type: Boolean,
      default: true
    },
    // Initial time in seconds (useful for resuming)
    initialTime: {
      type: Number,
      default: 0
    }
  },

  emits: ['tick'],

  setup(props, { emit }) {
    const elapsedTime = ref<number>(props.initialTime);
    let timer: number | null = null;

    const formatTime = (seconds: number): string => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const formattedTime = computed<string>(() => formatTime(elapsedTime.value));

    // Start the timer
    const start = (): void => {
      if (timer === null) {
        timer = window.setInterval(() => {
          elapsedTime.value++;
          emit('tick', elapsedTime.value);
        }, 1000);
      }
    };

    const stop = (): void => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const reset = (): void => {
      stop();
      elapsedTime.value = 0;
    };



    onMounted(() => {
      if (props.autoStart) {
        start();
      }
    });

    onUnmounted(() => {
      stop();
    });

    return {
      elapsedTime,
      formattedTime,
      start,
      stop,
      reset,
      getCurrentTime: () => elapsedTime.value // Add this method
    };
  }
});
</script>
