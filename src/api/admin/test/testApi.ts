import apiClient from "@/api/axios";
import { Page } from "@/types/common";
import type { AxiosResponse, AxiosError } from "axios";

// Base interfaces
interface BaseEntityVM {
  id: string;
}

// Question related interfaces
export interface QuestionCategoryVM extends BaseEntityVM {
  name: string;
}

export interface QuestionTypeVM extends BaseEntityVM {
  name: string;
  code: string;
}

export interface FileInfoVM extends BaseEntityVM {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface OptionVM extends BaseEntityVM {
  content: string;
  isCorrect: boolean;
  order: number;
}

// Test related interfaces
export interface TestVMSimple extends BaseEntityVM {
  name: string;
  category: string;
  listSkill: TestSkillVM[];
}
export interface TestQuestionVM extends BaseEntityVM {
  partId: string;
  prompt: string;
  questionCategory: QuestionCategoryVM;
  questionType: QuestionTypeVM;
  score: number;
  questionAnswers: string[];
  options: OptionVM[];
  questionAudios: FileInfoVM[];
  order: number;
}

export interface TestQuestionSetVM extends BaseEntityVM {
  partId: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  questions: TestQuestionVM[];
  totalQuestions: number;
  totalScore: number;
}

export interface TestQuestionItemVM {
  question?: TestQuestionVM;
  questionSet?: TestQuestionSetVM;
  order: number;
}

export interface TestPartVM {
  id: string;
  title: string;
  description: string;
  order: number;
  questionSets: TestQuestionSetVM[];
  questions: TestQuestionVM[];
}

export interface TestPartDetailVM {
  id: string;
  title: string;
  description: string;
  order: number;
  questionSets: TestQuestionSetVM[];
  questions: TestQuestionVM[];
  totalQuestions: number;
  totalScore: number;
}

export interface TestSkillVM extends BaseEntityVM {
  name: string;
  code: string;
}

export interface TestCategoryVM extends BaseEntityVM {
  name: string;
  code?: string;
  description?: string;
}

export interface TestQuestionOrderVM {
  questionId: string;
  order: number;
}

export interface TestQuestionSetOrderVM {
  questionSetId: string;
  order: number;
}

export interface TestCreateVM {
  title: string;
  listPart: TestPartVM[];
  listQuestionSet: TestQuestionSetOrderVM[];
  listQuestion: TestQuestionOrderVM[];
  skillIds: string[];
  testCategoryId: string;
  files?: File[];
}

export interface TestVM {
  id: string;
  title: string;
  listPart: TestPartDetailVM[];
  listQuestionItem: TestQuestionItemVM[];
  listSkill: TestSkillVM[];
  testCategory: TestCategoryVM;
  isActive: boolean;
}

/**
 * API Response Type
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Create a new test
 * @param testData The test data to create
 * @param files Optional array of files to upload
 * @returns Promise with the created test
 */
export const createTest = async (testData: TestCreateVM, files?: File[]): Promise<ApiResponse<TestVM>> => {
  const formData = new FormData();

  // Remove files from testData before sending as JSON
  const { files: _, ...testDataWithoutFiles } = testData;

  // Add test data as JSON (without files)
  formData.append("testData", JSON.stringify(testDataWithoutFiles));

  // Add files if any
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  try {
    return await apiClient.post("/tests", formData);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Get a test by ID
 * @param id The ID of the test to retrieve
 * @returns Promise with the test data
 */
export const getTestById = async (id: string): Promise<ApiResponse<TestVM>> => {
  try {
    return await apiClient.get(`/tests/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Delete a test by ID
 * @param id The ID of the test to delete
 * @returns Promise with the delete response
 */
export const deleteTest = async (id: string): Promise<ApiResponse<void>> => {
  try {
    return await apiClient.delete(`/tests/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Update an existing test
 * @param id The ID of the test to update
 * @param testData The test data to update
 * @param files Optional array of files to upload
 * @returns Promise with the updated test
 */
export interface TestEditVM extends TestCreateVM {
  id: string;
}

export const updateTest = async (id: string, testData: TestEditVM, files?: File[]): Promise<ApiResponse<TestVM>> => {
  const formData = new FormData();

  // Remove files from testData before sending as JSON
  const { files: _, ...testDataWithoutFiles } = testData;

  formData.append("testData", JSON.stringify(testDataWithoutFiles));
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }
  try {
    return await apiClient.put(`/tests/${id}`, formData);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

// Get all tests (simple)
export const getAllTestsSimple = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}): Promise<ApiResponse<Page<TestVMSimple>>> => {
  try {
    return await apiClient.get("/tests/simple", { params });
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

// Export all API functions as default
export default {
  createTest,
  getTestById,
  updateTest,
  deleteTest,
  getAllTestsSimple,
};
