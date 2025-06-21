// @src/api/admin/question/questionApi.ts

import apiClient from "@/api/axios";

interface FileInfoViewModel {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface OptionViewModel {
  id: string;
  text: string;
  correct: boolean;
}

interface QuestionTypeViewModel {
  id: string;
  name: string;
  description: string;
}

interface QuestionCategoryViewModel {
  id: string;
  code: string;
  skill: string;
  name: string;
}

export interface QuestionViewModel {
  id: string;
  prompt: string;
  questionCategory: QuestionCategoryViewModel;
  questionType: QuestionTypeViewModel;
  score: number;
  questionAnswers: string[];
  options: OptionViewModel[];
  questionAudios: FileInfoViewModel[];
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
  blankAnswers: Array<{ answer: string }>;
  audios: File[];
  score: number;
}

interface UpdateQuestionViewModel {
  prompt: string;
  questionTypeId: string;
  categoryId: string;
  options: Option[];
  blanks: Array<{ answer: string }>;
  audios: File[];
  score: number;
  deletedFileIds?: string[];
}

interface Option {
  // Define the shape of the Option object
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionFilter {
  questionTypeId?: string;
  categoryId?: string;
  minScore?: number;
  maxScore?: number;
  clipNumber?: number;
  prompt?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

interface ApiResponse<T> {
  data: T;
}

const BASE_URL = "/questions";

export const questionApi = {
  /**
   * Get all questions with pagination and filtering
   */
  getAll: async (filter: QuestionFilter = {}) => {
    const params = new URLSearchParams();
    
    // Add filter parameters if they exist
    if (filter.questionTypeId) params.append('questionTypeId', filter.questionTypeId);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);
    if (filter.minScore !== undefined) params.append('minScore', filter.minScore.toString());
    if (filter.maxScore !== undefined) params.append('maxScore', filter.maxScore.toString());
    if (filter.clipNumber !== undefined) params.append('clipNumber', filter.clipNumber.toString());
    if (filter.prompt) params.append('prompt', filter.prompt);
    
    // Add pagination
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());
    
    // Add sorting
    if (filter.sort) {
      const sortParam = filter.direction === 'desc' ? `${filter.sort},desc` : filter.sort;
      params.append('sort', sortParam);
    }

    const response = await apiClient.get<ApiResponse<PageResponse<QuestionViewModel>>>(
      `${BASE_URL}?${params.toString()}`
    );
    return response;
  },

  /**
   * Get a question by ID
   */
  getById: async (id: string) => {
    return await apiClient.get<QuestionViewModel>(`${BASE_URL}/${id}`);
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
    formData.append(
      "blankAnswers",
      JSON.stringify(
        blankAnswers.map((ba) => {
          return ba.answer
        })
      )
    );

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
  update: async (id: string, updateQuestionViewModel: UpdateQuestionViewModel) => {
    const { prompt, questionTypeId, categoryId, options, blanks, audios, score, deletedFileIds = [] } = updateQuestionViewModel;

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
    formData.append(
      "blankAnswers",
      JSON.stringify(
        blanks.map((ba) => {
          return ba
        })
      )
    );

    // Append each audio file with proper type checking
    audios.forEach((audio) => {
      if (audio instanceof File) {
        formData.append("audios", audio);
      } else {
        console.warn("Invalid audio file type detected");
      }
    });

    // Add deleted audio IDs if any
    if (deletedFileIds && deletedFileIds.length > 0) {
      formData.append("deletedAudiosIds", JSON.stringify(deletedFileIds));
    }

    return await apiClient.put<Question>(`${BASE_URL}/${id}`, formData);
  },

  /**
   * Delete a question by ID
   */
  delete: async (id: string) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
