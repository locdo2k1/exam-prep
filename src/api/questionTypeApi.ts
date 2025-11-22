import apiClient from "./axios";

export interface QuestionType {
  id: string;
  name: string;
  code: string;
}

export interface QuestionTypeRequest {
  name: string;
  code: string;
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

export const getAllQuestionTypes = async (
  page: number = 0,
  size: number = 10,
  sort: string = "name",
  direction: string = "asc",
  search?: string
): Promise<ApiResponse<PageResponse<QuestionType>>> => {
  const params: any = { page, size, sort, direction };
  if (search) {
    params.search = search;
  }
  return apiClient.get("/question-types", { params });
};

export const getQuestionTypeById = async (id: string): Promise<ApiResponse<QuestionType>> => {
  return apiClient.get(`/question-types/${id}`);
};

export const createQuestionType = async (questionType: QuestionTypeRequest): Promise<ApiResponse<QuestionType>> => {
  return apiClient.post("/question-types", questionType);
};

export const updateQuestionType = async (
  id: string,
  questionType: QuestionTypeRequest
): Promise<ApiResponse<QuestionType>> => {
  return apiClient.put(`/question-types/${id}`, questionType);
};

export const deleteQuestionType = async (id: string): Promise<ApiResponse<void>> => {
  return apiClient.delete(`/question-types/${id}`);
};
