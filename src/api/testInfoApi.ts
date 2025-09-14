import apiClient from './axios';

const API_PATH = '/test-info';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TestPartInfoVM {
  id: string;
  title: string;
  order: number;
  questionCount: number;
  questionCategories: string[];
}

export interface TestAttemptInfoVM {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  takeDate: string;
  timeSpent: number; // in seconds
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ABANDONED';
}

export interface FlattenedQuestionVM {
  order: number;
  part: string;
  answer: string;
}

export interface TestAnswerVM {
  testId: string;
  testName: string;
  flattenedQuestions: FlattenedQuestionVM[];
}

export interface PracticeTestInfoVM {
  skills: string[];
  testName: string;
  duration: string;
  sections: number;
  questions: number;
  comments: number;
  practicedUsers: number;
  note: string;
  testParts: TestPartInfoVM[];
}

export const getTestInfo = async (
  testId: string
): Promise<ApiResponse<PracticeTestInfoVM>> => {
  return await apiClient.get(`${API_PATH}/${testId}`);
};

export const getAllTests = async (): Promise<ApiResponse<string>> => {
  return await apiClient.get(API_PATH);
};

export const getTestAttempts = async (
  testId: string,
  userId?: string,
  timezone?: string
): Promise<ApiResponse<TestAttemptInfoVM[]>> => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (timezone) params.append('tz', timezone);
  
  return await apiClient.get(`${API_PATH}/${testId}/attempts${params.toString() ? `?${params.toString()}` : ''}`);
};

/**
 * Get solutions for a specific test
 * @param testId The ID of the test to get solutions for
 * @returns Promise containing the test solutions
 */
export const getTestSolutions = async (
  testId: string
): Promise<ApiResponse<TestAnswerVM>> => {
  return await apiClient.get(`${API_PATH}/${testId}/solutions`);
};
