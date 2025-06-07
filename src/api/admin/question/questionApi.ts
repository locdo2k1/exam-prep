// @src/api/admin/question/questionApi.ts

import apiClient from "@/api/axios";

interface Question {
  // Define the shape of the Question object
  id: string;
  prompt: string;
  type: string;
  category: string;
  // Add other properties as needed
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface CreateQuestionViewModel {
  prompt: string;
  questionTypeId: string;
  categoryId: string;
  options: Option[];
  blankAnswers: string[];
  audios: File[];
  score: number;
}

interface Option {
  // Define the shape of the Option object
  id: string;
  text: string;
  isCorrect: boolean;
}

const BASE_URL = "/questions";

export const questionApi = {
  /**
   * Get all questions with pagination and search
   */
  getAll: async (params: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    search?: string;
  }) => {
    return await apiClient.get<PageResponse<Question>>(BASE_URL, {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || "id",
        direction: params.direction || "asc",
        search: params.search,
      },
    });
  },

  /**
   * Get a question by ID
   */
  getById: async (id: string) => {
    return await apiClient.get<Question>(`${BASE_URL}/${id}`);
  },

  /**
   * Create a new question with form data
   */
  create: async (createQuestionViewModel: CreateQuestionViewModel) => {
    const { prompt, questionTypeId, categoryId, options, blankAnswers, audios, score } = createQuestionViewModel;

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("questionTypeId", questionTypeId);
    formData.append("categoryId", categoryId);
    formData.append("score", score.toString());

    // Add options as JSON string
    formData.append(
      "options",
      JSON.stringify(
        options.map((o) => {
          return {
            text: o.text,
            correct: o.isCorrect,
          };
        })
      )
    );

    // Add blank answers as JSON string
    formData.append("blankAnswers", JSON.stringify(blankAnswers));

    // Append each audio file with proper type checking
    audios.forEach((audio) => {
      if (audio instanceof File) {
        formData.append("audios", audio);
      } else {
        console.warn("Invalid audio file type detected");
      }
    });

    return await apiClient.post<Question>(BASE_URL, formData);
  },

  /**
   * Update an existing question
   */
  update: async (id: string, question: Question) => {
    return await apiClient.put<Question>(`${BASE_URL}/${id}`, question);
  },

  /**
   * Delete a question by ID
   */
  delete: async (id: string) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
