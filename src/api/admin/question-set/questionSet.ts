import apiClient from '../../axios';

export interface FileInfoViewModel {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface QuestionSetItem {
  id: string;
  questionId: string;
  order: number;
}

export interface QuestionCategoryViewModel {
  id: string;
  name: string;
  // Add other category properties as needed
}

export interface QuestionTypeViewModel {
  id: string;
  name: string;
  // Add other type properties as needed
}

export interface OptionViewModel {
  id: string;
  content: string;
  isCorrect: boolean;
  // Add other option properties as needed
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

export interface QuestionSetViewModel {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  order: number;
  questions: QuestionViewModel[];
  totalQuestions: number;
  totalScore: number;
  files?: FileInfoViewModel[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface QuestionSetFilter {
  title?: string;
  search?: string;        // General search term (searches in title and description)
  minOrder?: number;
  maxOrder?: number;
  minQuestions?: number;  // Filter by minimum number of questions
  maxQuestions?: number;  // Filter by maximum number of questions
  minScore?: number;      // Filter by minimum total score
  maxScore?: number;      // Filter by maximum total score
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const BASE_URL = '/question-sets';

export const questionSetApi = {
  /**
   * Get all question sets with pagination and filtering
   */
  getAll: async (filter: QuestionSetFilter = {}): Promise<PaginatedResponse<QuestionSetViewModel>> => {
    const params = new URLSearchParams();
    
    // Add filter parameters if they exist
    if (filter.title) params.append('title', filter.title);
    if (filter.search) params.append('search', filter.search);
    if (filter.minOrder !== undefined) params.append('minOrder', filter.minOrder.toString());
    if (filter.maxOrder !== undefined) params.append('maxOrder', filter.maxOrder.toString());
    if (filter.minQuestions !== undefined) params.append('minQuestions', filter.minQuestions.toString());
    if (filter.maxQuestions !== undefined) params.append('maxQuestions', filter.maxQuestions.toString());
    if (filter.minScore !== undefined) params.append('minScore', filter.minScore.toString());
    if (filter.maxScore !== undefined) params.append('maxScore', filter.maxScore.toString());
    
    // Add pagination with defaults
    params.append('page', (filter.page ?? 0).toString());
    params.append('size', (filter.size ?? 10).toString());
    
    // Add sorting with defaults
    const sortParam = filter.sort 
      ? (filter.direction === 'desc' ? `${filter.sort},desc` : filter.sort)
      : 'order,asc';
    params.append('sort', sortParam);

    const response = await apiClient.get<PaginatedResponse<QuestionSetViewModel>>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a question set by ID
   */
  getById: async (id: string): Promise<QuestionSetViewModel> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  /**
   * Create a new question set
   */
  create: async (questionSetData: {
    title: string;
    description?: string;
    questionIds: string | string[];
    audioFiles?: File[];
    order?: number;
  }): Promise<QuestionSetViewModel> => {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('title', questionSetData.title);
    if (questionSetData.description) {
      formData.append('description', questionSetData.description);
    }
    
    // Handle question IDs (convert array to comma-separated string if needed)
    const questionIds = Array.isArray(questionSetData.questionIds) 
      ? questionSetData.questionIds.join(',') 
      : questionSetData.questionIds;
    formData.append('questionIds', questionIds);
    
    // Add audio files if any
    if (questionSetData.audioFiles?.length) {
      questionSetData.audioFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('audioFiles', file);
        }
      });
    }
    
    // Add order if provided
    if (questionSetData.order !== undefined) {
      formData.append('order', questionSetData.order.toString());
    }
    
    return await apiClient.post(
      BASE_URL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Update an existing question set
   */
  update: async (
    id: string, 
    updateData: {
      title?: string;
      description?: string;
      questionIds?: string | string[];
      audioFiles?: File[];
      order?: number;
    }
  ): Promise<QuestionSetViewModel> => {
    const formData = new FormData();
    
    // Add fields if they exist in updateData
    if (updateData.title) formData.append('title', updateData.title);
    if (updateData.description !== undefined) formData.append('description', updateData.description);
    if (updateData.order !== undefined) formData.append('order', updateData.order.toString());
    
    // Handle question IDs if provided
    if (updateData.questionIds) {
      const questionIds = Array.isArray(updateData.questionIds)
        ? updateData.questionIds.join(',')
        : updateData.questionIds;
      formData.append('questionIds', questionIds);
    }
    
    // Handle file updates if any
    if (updateData.audioFiles?.length) {
      updateData.audioFiles.forEach(file => {
        if (file instanceof File) {
          formData.append('audioFiles', file);
        }
      });
    }
    
    return await apiClient.put(
      `${BASE_URL}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Delete a question set by ID
   */
  delete: async (id: string) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Remove a file from a question set
   */
  removeFile: async (questionSetId: string, fileId: string) => {
    return await apiClient.delete(
      `${BASE_URL}/${questionSetId}/files/${fileId}`
    );
  },

  /**
   * Reorder questions in a question set
   */
  reorderQuestions: async (
    questionSetId: string, 
    questionOrders: Array<{ id: string; order: number }>
  ): Promise<ApiResponse<void>> => {
    return await apiClient.put(
      `${BASE_URL}/${questionSetId}/reorder-questions`,
      { questionOrders }
    );
  },
};
