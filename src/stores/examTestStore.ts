import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getPracticeTestByParts,
  type PracticeTestVM,
  type ApiResponse
} from '@/api/practiceTestApi';

interface PracticeTestState {
  testData: PracticeTestVM | null;
  loading: boolean;
  error: string | null;
}

export const useExamTestStore = defineStore('examTest', () => {
  // State
  const state = ref<PracticeTestState>({
    testData: null,
    loading: false,
    error: null
  });

  // Actions
  const fetchPracticeTestByParts = async (testId: string, partIds?: string[]) => {
    state.value.loading = true;
    state.value.error = null;
    
    try {
      const response: ApiResponse<PracticeTestVM> = await getPracticeTestByParts(testId, partIds);
      
      if (response.success) {
        state.value.testData = response.data;
      } else {
        state.value.error = response.message || 'Failed to load practice test data';
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      state.value.error = errorMessage;
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  // Reset store state
  const resetState = () => {
    state.value = {
      testData: null,
      loading: false,
      error: null
    };
  };

  return {
    // State
    state,
    
    // Getters
    testData: () => state.value.testData,
    loading: () => state.value.loading,
    error: () => state.value.error,
    
    // Actions
    fetchPracticeTestByParts,
    resetState
  };
});
