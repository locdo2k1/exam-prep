<template>
  <div class="w-full max-w-6xl mx-auto p-3 bg-white">
    <div class="flex items-center gap-4">
      <!-- Play/Pause Button -->
      <button
        @click="togglePlay"
        class="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 rounded transition-colors"
      >
        <svg
          v-if="isPlaying"
          class="w-6 h-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
        <svg
          v-else
          class="w-6 h-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <!-- Progress Bar -->
      <div class="flex-1 flex items-center gap-3">
        <div
          @click="handleSeek"
          class="flex-1 h-1 bg-gray-300 rounded-full cursor-pointer relative group"
        >
          <div
            class="h-full bg-gray-400 rounded-full relative"
            :style="{ width: `${progress}%` }"
          >
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
          </div>
        </div>
      </div>

      <!-- Time Display -->
      <div class="text-sm text-gray-600 font-medium min-w-[45px]">
        {{ formatTime(duration - currentTime) }}
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="handleVolumeChange"
          class="w-24 h-1 rounded-lg appearance-none cursor-pointer"
          :style="{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #d1d5db ${volume}%, #d1d5db 100%)`
          }"
        />
      </div>

      <!-- Speed Settings -->
      <div class="relative">
        <button
          @click="showSpeedMenu = !showSpeedMenu"
          class="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded transition-colors"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <!-- Speed Menu -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showSpeedMenu"
            class="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-10"
          >
            <div class="px-4 py-2 text-sm font-medium text-gray-500 flex items-center gap-2">
              <span>◄</span>
              <span>Speed</span>
            </div>
            <button
              v-for="speed in speeds"
              :key="speed"
              @click="handleSpeedChange(speed)"
              class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              :class="playbackSpeed === speed ? 'text-blue-500' : 'text-gray-700'"
            >
              <span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span
                  v-if="playbackSpeed === speed"
                  class="w-2 h-2 rounded-full bg-blue-500"
                ></span>
              </span>
              <span>{{ speed }}×</span>
              <span v-if="speed === 1" class="ml-auto text-gray-500">Normal</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="isPlaying = false"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Refs must be defined before they're used in onMounted or watch
const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(100);
const showSpeedMenu = ref(false);
const playbackSpeed = ref(1);

const props = defineProps({
  audioUrl: {
    type: String,
    required: true,
    default: ''
  }
});

const speeds = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

const progress = computed(() => {
  return duration.value ? (currentTime.value / duration.value) * 100 : 0;
});

const togglePlay = async () => {
  if (!audioRef.value) return;
  
  try {
    if (isPlaying.value) {
      await audioRef.value.pause();
      isPlaying.value = false;
    } else {
      // Check if we have a valid source
      if (!props.audioUrl) {
        console.log(props);
        
        console.error('No audio source available');
        return;
      }
      
      // If the audio hasn't loaded yet, load it first
      if (audioRef.value.readyState === 0) { // 0 = HAVE_NOTHING
        await audioRef.value.load();
      }
      
      // Check again after loading
      if (audioRef.value.readyState === 0) {
        console.error('Audio source could not be loaded');
        return;
      }
      
      await audioRef.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error('Error toggling audio playback:', error);
    isPlaying.value = false;
  }
};

const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
};

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
};

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = x / rect.width;
  const newTime = percentage * duration.value;
  
  if (audioRef.value) {
    audioRef.value.currentTime = newTime;
    currentTime.value = newTime;
  }
};

const handleVolumeChange = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100;
  }
};

const handleSpeedChange = (speed) => {
  playbackSpeed.value = speed;
  if (audioRef.value) {
    audioRef.value.playbackRate = speed;
  }
  showSpeedMenu.value = false;
};

const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
/* Custom styling for range input */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>