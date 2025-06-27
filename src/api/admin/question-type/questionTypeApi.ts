import apiClient from "@/api/axios";

interface QuestionType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Standard API response format from our axios interceptor
 */
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status?: number;
  errors?: Record<string, string[]>;
}

const BASE_URL = "/question-types";

export const questionTypeApi = {
  /**
   * Get all question types with pagination and search
   */
  getAll: async (params: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    search?: string;
  }): Promise<ApiResponse<PageResponse<QuestionType>>> => {
    const response = await apiClient.get<PageResponse<QuestionType>>(BASE_URL, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        sort: params.sort ?? 'name',
        direction: params.direction ?? 'asc',
        search: params.search,
      },
    }) as unknown as ApiResponse<PageResponse<QuestionType>>;
    return response;
  },

  /**
   * Get a question type by ID
   */
  getById: async (id: string): Promise<ApiResponse<QuestionType>> => {
    const response = await apiClient.get<QuestionType>(`${BASE_URL}/${id}`) as unknown as ApiResponse<QuestionType>;
    return response;
  },

  /**
   * Create a new question type
   */
  create: async (type: Omit<QuestionType, "id">): Promise<ApiResponse<QuestionType>> => {
    const response = await apiClient.post<QuestionType>(BASE_URL, type) as unknown as ApiResponse<QuestionType>;
    return response;
  },

  /**
   * Update an existing question type
   */
  update: async (id: string, type: Omit<QuestionType, "id">): Promise<ApiResponse<QuestionType>> => {
    const response = await apiClient.put<QuestionType>(`${BASE_URL}/${id}`, type) as unknown as ApiResponse<QuestionType>;
    return response;
  },

  /**
   * Delete a question type by ID
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`) as unknown as ApiResponse<void>;
    return response;
  },
};
