import apiClient from '@/api/axios';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Test Category View Model
 */
export interface TestCategoryVM {
  id: string;
  name: string;
  code: string;
  description?: string;
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
 * Get all test categories
 * @returns Promise with the list of test categories
 */
export const getAllTestCategories = async (): Promise<ApiResponse<TestCategoryVM[]>> => {
  try {
    const response: AxiosResponse<ApiResponse<TestCategoryVM[]>> = await apiClient.get('/test-categories');
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<TestCategoryVM[]>>;
    throw axiosError.response?.data || new Error('Failed to fetch test categories');
  }
};

/**
 * Get a test category by ID
 * @param id The ID of the test category to retrieve
 * @returns Promise with the test category data
 */
export const getTestCategoryById = async (id: string): Promise<ApiResponse<TestCategoryVM>> => {
  try {
    const response: AxiosResponse<ApiResponse<TestCategoryVM>> = await apiClient.get(`/api/test-categories/${id}`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<TestCategoryVM>>;
    throw axiosError.response?.data || new Error(`Failed to fetch test category with ID: ${id}`);
  }
};

/**
 * Create a new test category
 * @param categoryData The test category data to create
 * @returns Promise with the created test category
 */
export const createTestCategory = async (categoryData: Omit<TestCategoryVM, 'id'>): Promise<ApiResponse<TestCategoryVM>> => {
  try {
    const response: AxiosResponse<ApiResponse<TestCategoryVM>> = await apiClient.post('/api/test-categories', categoryData);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<TestCategoryVM>>;
    throw axiosError.response?.data || new Error('Failed to create test category');
  }
};

/**
 * Update an existing test category
 * @param id The ID of the test category to update
 * @param categoryData The updated test category data
 * @returns Promise with the updated test category
 */
export const updateTestCategory = async (id: string, categoryData: Partial<TestCategoryVM>): Promise<ApiResponse<TestCategoryVM>> => {
  try {
    const response: AxiosResponse<ApiResponse<TestCategoryVM>> = await apiClient.put(`/api/test-categories/${id}`, categoryData);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<TestCategoryVM>>;
    throw axiosError.response?.data || new Error(`Failed to update test category with ID: ${id}`);
  }
};

/**
 * Delete a test category by ID
 * @param id The ID of the test category to delete
 * @returns Promise with the delete response
 */
export const deleteTestCategory = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/api/test-categories/${id}`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<void>>;
    throw axiosError.response?.data || new Error(`Failed to delete test category with ID: ${id}`);
  }
};

/**
 * Check if a test category code already exists
 * @param code The code to check
 * @returns Promise with boolean indicating if the code exists
 */
export const checkCodeExists = async (code: string): Promise<ApiResponse<boolean>> => {
  try {
    const response: AxiosResponse<ApiResponse<boolean>> = await apiClient.get(`/api/test-categories/exists/code/${code}`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<boolean>>;
    throw axiosError.response?.data || new Error('Failed to check code existence');
  }
};

/**
 * Check if a test category name already exists
 * @param name The name to check
 * @returns Promise with boolean indicating if the name exists
 */
export const checkNameExists = async (name: string): Promise<ApiResponse<boolean>> => {
  try {
    const response: AxiosResponse<ApiResponse<boolean>> = await apiClient.get(`/api/test-categories/exists/name/${name}`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<boolean>>;
    throw axiosError.response?.data || new Error('Failed to check name existence');
  }
};

// Export all API functions as default
export default {
  getAllTestCategories,
  getTestCategoryById,
  createTestCategory,
  updateTestCategory,
  deleteTestCategory,
  checkCodeExists,
  checkNameExists
};
