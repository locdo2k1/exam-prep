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
  correct?: boolean; // Track if the answer is correct
}

interface PracticeTestState {
  testData: PracticeTestVM | null;
  loading: boolean;
  error: string | null;
  userResponses: Set<Response>;
  listReviewQuestionIds: Set<string>;
  timeLimit: number; // in minutes
  timeLeft: number; // in seconds
  timerInterval: number | null;
  isTimeUp: boolean;
}

export const useExamTestStore = defineStore('examTest', () => {
  // State
  const state = ref<PracticeTestState>({
    testData: null,
    loading: false,
    error: null,
    userResponses: new Set<Response>(),
    listReviewQuestionIds: new Set<string>(),
    timeLimit: 0, // Default to 0, should be set when starting the test
    timeLeft: 0, // Will be calculated based on timeLimit
    timerInterval: null,
    isTimeUp: false
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

  const fetchPracticeTestByParts = async (testId: string, partIds?: string[], refId?: string) => {
    state.value.loading = true;
    state.value.error = null;
    
    try {
      const response: ApiResponse<PracticeTestVM> = await getPracticeTestByParts(testId, partIds, refId);
      
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

  // Set time limit (in minutes)
  const setTimeLimit = (minutes: number) => {
    state.value.timeLimit = minutes;
    state.value.timeLeft = minutes * 60;
    state.value.isTimeUp = false;
  };

  // Start the timer
  const startTimer = () => {
    // Clear any existing timer
    if (state.value.timerInterval) {
      clearInterval(state.value.timerInterval);
    }

    // Start new timer
    state.value.timerInterval = window.setInterval(() => {
      if (state.value.timeLeft > 0) {
        state.value.timeLeft--;
      } else {
        stopTimer();
        state.value.isTimeUp = true;
      }
    }, 1000) as unknown as number;
  };

  // Stop the timer
  const stopTimer = () => {
    if (state.value.timerInterval) {
      clearInterval(state.value.timerInterval);
      state.value.timerInterval = null;
    }
  };

  // Reset the timer to initial state
  const resetTimer = () => {
    stopTimer();
    state.value.timeLeft = state.value.timeLimit * 60;
    state.value.isTimeUp = false;
  };

  const resetState = () => {
    state.value = {
      testData: null,
      loading: false,
      error: null,
      userResponses: new Set<Response>(),
      listReviewQuestionIds: new Set<string>(),
      timeLimit: 0,
      timeLeft: 0,
      timerInterval: null,
      isTimeUp: false
    };
  };

  return {
    // State
    state,
    
    // Getters
    testData: () => state.value.testData,
    allAnswers: () => {
      const answers: Record<number, any> = {};
      state.value.userResponses.forEach(response => {
        // Assuming questionId is a number or can be converted to one
        const questionNumber = parseInt(response.questionId, 10);
        if (!isNaN(questionNumber)) {
          answers[questionNumber] = response;
        }
      });
      return answers;
    },
    loading: () => state.value.loading,
    error: () => state.value.error,
    userResponses: () => state.value.userResponses,
    listReviewQuestionIds: () => state.value.listReviewQuestionIds,
    timeLeft: () => state.value.timeLeft,
    isTimeUp: () => state.value.isTimeUp,
    
    // Actions
    setTimeLimit,
    startTimer,
    stopTimer,
    resetTimer,
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
