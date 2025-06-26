import apiClient from './axios';

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

export interface QuestionSetViewModel {
  id: string;
  title: string;
  description?: string;
  order: number;
  imageUrl?: string;
  questionSetItems: QuestionSetItem[];
  files: FileInfoViewModel[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface QuestionSetFilter {
  title?: string;
  minOrder?: number;
  maxOrder?: number;
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
    if (filter.minOrder !== undefined) params.append('minOrder', filter.minOrder.toString());
    if (filter.maxOrder !== undefined) params.append('maxOrder', filter.maxOrder.toString());
    
    // Add pagination
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());
    
    // Add sorting
    if (filter.sort) {
      const sortParam = filter.direction === 'desc' ? `${filter.sort},desc` : filter.sort;
      params.append('sort', sortParam);
    }

    const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get a question set by ID
   */
  getById: async (id: string): Promise<QuestionSetViewModel> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data;
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
    
    const response = await apiClient.post(
      BASE_URL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
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
    
    const response = await apiClient.put(
      `${BASE_URL}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
  },

  /**
   * Delete a question set by ID
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Remove a file from a question set
   */
  removeFile: async (questionSetId: string, fileId: string): Promise<void> => {
    await apiClient.delete(
      `${BASE_URL}/${questionSetId}/files/${fileId}`
    );
  },

  /**
   * Reorder questions in a question set
   */
  reorderQuestions: async (
    questionSetId: string, 
    questionOrders: Array<{ id: string; order: number }>
  ): Promise<void> => {
    await apiClient.put(
      `${BASE_URL}/${questionSetId}/reorder`,
      questionOrders
    );
  },
};
