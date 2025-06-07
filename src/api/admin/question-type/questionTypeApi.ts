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
  }) => {
    return await apiClient.get<PageResponse<QuestionType>>(BASE_URL, {
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
   * Get a question type by ID
   */
  getById: async (id: string) => {
    return await apiClient.get<QuestionType>(`${BASE_URL}/${id}`);
  },

  /**
   * Create a new question type
   */
  create: async (type: Omit<QuestionType, "id">) => {
    return await apiClient.post<QuestionType>(BASE_URL, type);
  },

  /**
   * Update an existing question type
   */
  update: async (id: string, type: Omit<QuestionType, "id">) => {
    return await apiClient.put<QuestionType>(`${BASE_URL}/${id}`, type);
  },

  /**
   * Delete a question type by ID
   */
  delete: async (id: string) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
