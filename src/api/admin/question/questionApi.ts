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

const BASE_URL = "/questions";

export const questionApi = {
  /**
   * Get all questions with pagination and filtering
   */
  /**
   * Get all questions with pagination and filtering
   */
  getAll: async (filter: QuestionFilter = {}): Promise<ApiResponse<PageResponse<QuestionViewModel>>> => {
    const params = new URLSearchParams();
    
    // Add filter parameters if they exist
    if (filter.questionTypeId) params.append('questionTypeId', filter.questionTypeId);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);
    if (filter.minScore !== undefined) params.append('minScore', filter.minScore.toString());
    if (filter.maxScore !== undefined) params.append('maxScore', filter.maxScore.toString());
    if (filter.clipNumber !== undefined) params.append('clipNumber', filter.clipNumber.toString());
    if (filter.prompt) params.append('prompt', filter.prompt);
    
    // Add pagination with defaults
    params.append('page', (filter.page ?? 0).toString());
    params.append('size', (filter.size ?? 10).toString());
    
    // Add sorting with defaults
    const sortParam = filter.sort 
      ? (filter.direction === 'desc' ? `${filter.sort},desc` : filter.sort)
      : 'id,asc';
    params.append('sort', sortParam);

    const response = await apiClient.get<PageResponse<QuestionViewModel>>(
      `${BASE_URL}?${params.toString()}`
    ) as unknown as ApiResponse<PageResponse<QuestionViewModel>>;
    
    return response;
  },

  /**
   * Get a question by ID
   */
  /**
   * Get a question by ID
   */
  getById: async (id: string): Promise<ApiResponse<QuestionViewModel>> => {
    const response = await apiClient.get<QuestionViewModel>(`${BASE_URL}/${id}`) as unknown as ApiResponse<QuestionViewModel>;
    return response;
  },

  /**
   * Create a new question with form data
   */
  /**
   * Create a new question
   */
  create: async (createQuestionViewModel: CreateQuestionViewModel): Promise<ApiResponse<QuestionViewModel>> => {
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

    const response = await apiClient.post<QuestionViewModel>(
      BASE_URL, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ) as unknown as ApiResponse<QuestionViewModel>;
    
    return response;
  },

  /**
   * Update an existing question
   */
  /**
   * Update an existing question
   */
  update: async (
    id: string, 
    updateQuestionViewModel: UpdateQuestionViewModel
  ): Promise<ApiResponse<QuestionViewModel>> => {
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

    const response = await apiClient.put<QuestionViewModel>(
      `${BASE_URL}/${id}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ) as unknown as ApiResponse<QuestionViewModel>;
    
    return response;
  },

  /**
   * Delete a question by ID
   */
  /**
   * Delete a question by ID
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`) as unknown as ApiResponse<void>;
    return response;
  },
};
