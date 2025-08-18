import { defineStore } from "pinia";
import { ref } from "vue";
import { getTestResultOverall, getTestInfo, getTestAttemptAnalysis, getTestAnswers } from "@/api/attemptResultApi";
import type { TestResultOverallVM, TestInfoVM, AnalysisQuestionsVM, AnswerResultVM } from "@/api/attemptResultApi";

export interface AttemptResultState {
  overallResult?: TestResultOverallVM;
  testInfo?: TestInfoVM;
  analysis?: AnalysisQuestionsVM;
  answers?: AnswerResultVM;
}

export const useAttemptResultStore = defineStore("attemptResult", () => {
  // Central state holder
  const state = ref<AttemptResultState>({});

  // UI state
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchTestResultOverall(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestResultOverall(attemptId);
      if (response.success) {
        state.value.overallResult = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch test results";
    } finally {
      loading.value = false;
    }
  }

  async function fetchTestInfo(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestInfo(attemptId);
      if (response.success) {
        state.value.testInfo = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch test info";
    } finally {
      loading.value = false;
    }
  }

  async function fetchTestAttemptAnalysis(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestAttemptAnalysis(attemptId);
      if (response.success) {
        state.value.analysis = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch test analysis";
    } finally {
      loading.value = false;
    }
  }

  async function fetchTestAnswers(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTestAnswers(attemptId);
      if (response.success) {
        state.value.answers = response.data;
        console.log("state.value.answers", state.value.answers);
        
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch test answers";
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    state.value = {};
    loading.value = false;
    error.value = null;
  }

  return {
    // state
    state,
    loading,
    error,

    // actions
    fetchTestResultOverall,
    fetchTestInfo,
    fetchTestAttemptAnalysis,
    fetchTestAnswers,
    reset,
  };
});
