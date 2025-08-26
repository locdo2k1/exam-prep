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
  return await apiClient.get(`${API_PATH}`);
};
