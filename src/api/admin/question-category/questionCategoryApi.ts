import apiClient from '@/api/axios';

export interface QuestionCategory {
  id: string;
  code: string;
  skill: string;
  name: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Our API response type that matches the axios interceptor
type ApiResponse<T = any> = {
  data: T;
  message?: string;
  success: boolean;
  status?: number;
  errors?: Record<string, string[]>;
};

const BASE_URL = "/question-categories";

export const questionCategoryApi = {
  /**
   * Get all question categories with pagination and search
   */
  getAll: async (params: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    search?: string;
  }) => {
    const response = await apiClient.get<PageResponse<QuestionCategory>>(BASE_URL, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        sort: params.sort ?? 'name',
        direction: params.direction ?? 'asc',
        search: params.search,
      },
    }) as unknown as ApiResponse<PageResponse<QuestionCategory>>;
    return response;
  },

  /**
   * Get a question category by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get<QuestionCategory>(`${BASE_URL}/${id}`) as unknown as ApiResponse<QuestionCategory>;
    return response;
  },

  /**
   * Create a new question category
   */
  create: async (category: Omit<QuestionCategory, "id">) => {
    const response = await apiClient.post<QuestionCategory>(BASE_URL, category) as unknown as ApiResponse<QuestionCategory>;
    return response;
  },

  /**
   * Update an existing question category
   */
  update: async (
    id: string,
    category: Omit<QuestionCategory, "id">
  ) => {
    const response = await apiClient.put<QuestionCategory>(`${BASE_URL}/${id}`, category) as unknown as ApiResponse<QuestionCategory>;
    return response;
  },

  /**
   * Delete a question category by ID
   */
  delete: async (id: string) => {
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`) as unknown as ApiResponse<void>;
    return response;
  },
};
