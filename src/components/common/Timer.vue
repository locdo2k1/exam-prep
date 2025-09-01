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

    <div class="text-3xl font-bold mb-5 py-3 px-6 rounded-lg inline-block transition-colors duration-300" :class="{
      'text-red-600 bg-red-50': timeCritical,
      'text-blue-600 bg-blue-50': !timeCritical
    }">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'ExamTimer',

  props: {
    // Time limit in minutes
    timeLimit: {
      type: Number,
      required: true,
      default: 0
    },
    // Whether to show time in red when limit is low
    showWarning: {
      type: Boolean,
      default: true
    },
    // Time in minutes when to show warning (default: 5 minutes)
    warningThreshold: {
      type: Number,
      default: 5
    }
  },

  setup(props, { emit }) {
    const elapsedTime = ref(0);
    const startTime = ref<number | null>(null);
    let timer: number | null = null;

    // Format time as HH:MM:SS or MM:SS if less than an hour
    const formatTime = (seconds: number): string => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hrs > 0) {
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Start count-up timer
    const startCountUp = () => {
      if (timer) clearInterval(timer);
      startTime.value = Date.now();
      elapsedTime.value = 0;
      
      timer = window.setInterval(() => {
        if (startTime.value) {
          elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
          emit('time-update', elapsedTime.value);
        }
      }, 1000);
    };

    // Start countdown timer
    const startCountdown = () => {
      if (timer) clearInterval(timer);
      const totalTime = props.timeLimit * 60; // Convert minutes to seconds
      startTime.value = Date.now();
      elapsedTime.value = 0;

      // Emit initial remaining time immediately
      emit('time-update', totalTime);

      timer = window.setInterval(() => {
        if (startTime.value) {
          const timeElapsed = Math.floor((Date.now() - startTime.value) / 1000);
          const remainingTime = Math.max(0, totalTime - timeElapsed);
          
          // Always track actual time passed
          elapsedTime.value = timeElapsed;
          
          // Emit remaining time for display
          emit('time-update', remainingTime);
          
          if (remainingTime <= 0) {
            clearInterval(timer!);
            emit('time-up');
          }
        }
      }, 1000);
    };

    const stop = (): void => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
        startTime.value = null;
      }
    };

    const reset = (): void => {
      stop();
      elapsedTime.value = 0;
    };

    // Initialize timer based on props
    onMounted(() => {
      if (props.timeLimit > 0) {
        startCountdown();
      } else {
        startCountUp();
      }
    });

    // Clean up timer
    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    // Remaining seconds (for countdown); for count-up just equals elapsed
    const remainingSeconds = computed<number>(() => {
      if (props.timeLimit > 0) {
        return Math.max(0, props.timeLimit * 60 - elapsedTime.value);
      }
      return elapsedTime.value;
    });

    // Format the time for display: show remaining in countdown, elapsed in count-up
    const displayTime = computed<string>(() => {
      const secondsToShow = props.timeLimit > 0 ? remainingSeconds.value : elapsedTime.value;
      return formatTime(secondsToShow);
    });

    // Check if time is critical (only for countdown mode)
    const timeCritical = computed<boolean>(() => {
      return props.timeLimit > 0 &&
        props.showWarning &&
        (remainingSeconds.value / 60) <= props.warningThreshold;
    });

    return {
      formattedTime: displayTime,
      timeCritical,
      stop
    };
  }
});
</script>
