import apiClient from "./axios";

export interface QuestionCategoryVM {
  id: string;
  code: string;
  name: string;
  skill: string;
}

export interface QuestionCategoryRequest {
  code: string;
  name: string;
  skill: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getAllQuestionCategories = async (
  page: number = 0,
  size: number = 10,
  sort: string = "name",
  direction: string = "asc",
  search?: string
): Promise<ApiResponse<PageResponse<QuestionCategoryVM>>> => {
  const params: any = { page, size, sort, direction };
  if (search) {
    params.search = search;
  }
  return apiClient.get("/question-categories", { params });
};

export const getQuestionCategoryById = async (id: string): Promise<ApiResponse<QuestionCategoryVM>> => {
  return apiClient.get(`/question-categories/${id}`);
};

export const createQuestionCategory = async (
  category: QuestionCategoryRequest
): Promise<ApiResponse<QuestionCategoryVM>> => {
  return apiClient.post("/question-categories", category);
};

export const updateQuestionCategory = async (
  id: string,
  category: QuestionCategoryRequest
): Promise<ApiResponse<QuestionCategoryVM>> => {
  return apiClient.put(`/question-categories/${id}`, category);
};

export const deleteQuestionCategory = async (id: string): Promise<ApiResponse<void>> => {
  return apiClient.delete(`/question-categories/${id}`);
};
