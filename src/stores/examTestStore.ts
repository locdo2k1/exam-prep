import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getPracticeTestByParts,
  type PracticeTestVM,
  type ApiResponse
} from '@/api/practiceTestApi';

interface Response {
  questionId: string;
  selectedOptionIds: string[]; // Changed to array to support multiple selections
  answer: string | null;
}

interface PracticeTestState {
  testData: PracticeTestVM | null;
  loading: boolean;
  error: string | null;
  userResponses: Set<Response>;
  listReviewQuestionIds: Set<string>;
}

export const useExamTestStore = defineStore('examTest', () => {
  // State
  const state = ref<PracticeTestState>({
    testData: null,
    loading: false,
    error: null,
    userResponses: new Set<Response>(),
    listReviewQuestionIds: new Set<string>()
  });

  // Actions
  const addResponse = (response: Omit<Response, 'selectedOptionIds'> & { selectedOptionIds?: string[] }) => {
    const newResponse: Response = {
      ...response,
      selectedOptionIds: response.selectedOptionIds || []
    };
    state.value.userResponses.add(newResponse);
  };

  const updateResponse = (questionId: string, updates: Partial<Omit<Response, 'questionId'>>) => {
    const existingResponse = getResponse(questionId);
    if (existingResponse) {
      // Remove the old response
      state.value.userResponses.delete(existingResponse);
      // Add the updated response
      state.value.userResponses.add({
        ...existingResponse,
        ...updates,
        selectedOptionIds: updates.selectedOptionIds || existingResponse.selectedOptionIds || [],
        questionId // Ensure questionId can't be changed
      });
      return true;
    }
    return false;
  };

  // Helper function to add/remove an option from the selected options array
  const toggleOption = (questionId: string, optionId: string, isSelected: boolean) => {
    const existingResponse = getResponse(questionId);
    
    if (!existingResponse) {
      // If no response exists, create a new one with the selected option
      addResponse({
        questionId,
        selectedOptionIds: [optionId],
        answer: null
      });
      return;
    }

    let newSelectedOptions = [...(existingResponse.selectedOptionIds || [])];
    
    if (isSelected) {
      // Add the option if it's not already selected
      if (!newSelectedOptions.includes(optionId)) {
        newSelectedOptions.push(optionId);
      }
    } else {
      // Remove the option if it's selected
      newSelectedOptions = newSelectedOptions.filter(id => id !== optionId);
    }

    // Update the response with the new selected options
    updateResponse(questionId, {
      selectedOptionIds: newSelectedOptions
    });
  };

  // Helper function to check if an option is selected
  const isOptionSelected = (questionId: string, optionId: string): boolean => {
    const response = getResponse(questionId);
    return response?.selectedOptionIds?.includes(optionId) || false;
  };

  const removeResponse = (questionId: string) => {
    const responseToRemove = getResponse(questionId);
    if (responseToRemove) {
      state.value.userResponses.delete(responseToRemove);
      return true;
    }
    return false;
  };

  const getResponse = (questionId: string): Response | undefined => {
    return Array.from(state.value.userResponses).find(
      r => r.questionId === questionId
    );
  };

  const clearResponses = () => {
    state.value.userResponses.clear();
  };

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
  // Review questions management
  const addToReview = (questionId: string) => {
    state.value.listReviewQuestionIds.add(questionId);
  };

  const removeFromReview = (questionId: string) => {
    state.value.listReviewQuestionIds.delete(questionId);
  };

  const isInReview = (questionId: string): boolean => {
    return state.value.listReviewQuestionIds.has(questionId);
  };

  // Check if a question has been answered
  const isAnswered = (questionId: string): boolean => {
    const response = getResponse(questionId);
    if (!response) return false;
    
    // Check if there are selected options or an answer
    const hasSelectedOptions = response.selectedOptionIds && response.selectedOptionIds.length > 0;
    const hasAnswer = !!response.answer;
    
    return hasSelectedOptions || hasAnswer;
  };

  const clearReviewQuestions = () => {
    state.value.listReviewQuestionIds.clear();
  };

  const resetState = () => {
    state.value = {
      testData: null,
      loading: false,
      error: null,
      userResponses: new Set<Response>(),
      listReviewQuestionIds: new Set<string>()
    };
  };

  return {
    // State
    state,
    
    // Getters
    testData: () => state.value.testData,
    loading: () => state.value.loading,
    error: () => state.value.error,
    userResponses: () => state.value.userResponses,
    listReviewQuestionIds: () => state.value.listReviewQuestionIds,
    
    // Actions
    fetchPracticeTestByParts,
    addResponse,
    updateResponse,
    removeResponse,
    getResponse,
    clearResponses,
    resetState,
    toggleOption,
    isOptionSelected,
    addToReview,
    removeFromReview,
    isInReview,
    isAnswered,
    clearReviewQuestions
  };
});
