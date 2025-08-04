import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AxiosError } from 'axios';
import apiClient from '@/api/axios';

// Import types from the test API
import type { TestVM, TestPartDetailVM } from '@/api/admin/test/testApi';

// API Response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Extend the base TestVM interface with additional UI-specific properties
export interface Test extends Omit<TestVM, 'listPart'> {
  // Add any additional UI-specific properties here
  durationInMinutes: number;
  status: 'draft' | 'published' | 'completed' | 'in_progress';
  listPart: (TestPartDetailVM & { durationInMinutes: number })[];
}

export const useTestStore = defineStore('test', () => {
  const currentTest = ref<Test | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTest = async (testId: string): Promise<Test> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await apiClient.get<ApiResponse<TestVM>>(`/tests/${testId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch test details');
      }
      
      // Map the API response to our local Test interface
      const testData = response.data.data;
      const partsWithDuration = (testData.listPart || []).map(part => ({
        ...part,
        durationInMinutes: 30 // Default duration for each part
      }));
      
      const totalDuration = partsWithDuration.reduce((total, part) => {
        return total + part.durationInMinutes;
      }, 0);
      
      const test: Test = {
        ...testData,
        listPart: partsWithDuration,
        durationInMinutes: totalDuration,
        status: 'published' as const // Default status
      };
      
      currentTest.value = test;
      return test;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch test details';
      error.value = message;
      console.error('Error fetching test:', message);
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  };

  const startTest = async (testId: string): Promise<Test> => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.post<ApiResponse<TestVM>>(`/tests/${testId}/start`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to start test');
      }
      
      // Ensure we have the test data before updating
      if (!response.data.data) {
        throw new Error('No test data received');
      }
      
      // Map the API response to our local Test interface
      const testData = response.data.data;
      const partsWithDuration = (testData.listPart || []).map(part => ({
        ...part,
        durationInMinutes: 30 // Default duration for each part
      }));
      
      const totalDuration = partsWithDuration.reduce((total, part) => {
        return total + (part.durationInMinutes || 0);
      }, 0);
      
      // Update the current test with the started test data
      currentTest.value = {
        ...testData,
        listPart: partsWithDuration,
        durationInMinutes: totalDuration,
        status: 'in_progress' as const
      };
      
      return currentTest.value;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start test';
      error.value = message;
      console.error('Error starting test:', message);
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  };

  const submitTest = async (testId: string, answers: Record<string, any>) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await apiClient.post<ApiResponse<{
        score: number;
        totalScore: number;
        correctAnswers: number;
        totalQuestions: number;
      }>>(`/tests/${testId}/submit`, { answers });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit test');
      }
      
      // Update test status to completed
      if (currentTest.value) {
        currentTest.value.status = 'completed';
      }
      
      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit test';
      error.value = message;
      console.error('Error submitting test:', message);
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  };

  const resetTest = () => {
    currentTest.value = null;
    error.value = null;
  };

  return {
    // State
    currentTest,
    loading,
    error,
    
    // Actions
    fetchTest,
    startTest,
    submitTest,
    resetTest,
  };
});

export default useTestStore;
