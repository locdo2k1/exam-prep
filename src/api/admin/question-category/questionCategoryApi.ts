import apiClient from "@/api/axios";

interface QuestionCategory {
  id: string;
  code: string;
  skill: string;
  name: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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
    return await apiClient.get<PageResponse<QuestionCategory>>(BASE_URL, {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || "name",
        direction: params.direction || "asc",
        search: params.search,
      },
    });
  },

  /**
   * Get a question category by ID
   */
  getById: async (id: string) => {
    return await apiClient.get<QuestionCategory>(`${BASE_URL}/${id}`);
  },

  /**
   * Create a new question category
   */
  create: async (category: Omit<QuestionCategory, "id">) => {
    return await apiClient.post<QuestionCategory>(BASE_URL, category);
  },

  /**
   * Update an existing question category
   */
  update: async (id: string, category: Omit<QuestionCategory, "id">) => {
    return await apiClient.put<QuestionCategory>(`${BASE_URL}/${id}`, category);
  },

  /**
   * Delete a question category by ID
   */
  delete: async (id: string) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
