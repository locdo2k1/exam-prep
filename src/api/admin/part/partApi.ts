import apiClient from '@/api/axios';
import { Pageable, Page } from '@/types/common';

export interface Part {
  id?: string;
  name: string;
  description?: string;
  // Add other part properties as needed
}

export interface PartViewModel extends Part {
  // Add any view model specific properties
}

const API_BASE_URL = '/parts';

export const partApi = {
  /**
   * Get all parts with pagination and optional search
   * @param search Optional search term
   * @param pageable Pagination parameters
   * @returns Page of PartViewModel
   */
  async getAllParts(search?: string, pageable?: Pageable): Promise<Page<PartViewModel>> {
    const params = {
      search: search || undefined,
      page: pageable?.page,
      size: pageable?.size,
      sort: pageable?.sort
    };
    
    const response = await apiClient.get<Page<PartViewModel>>(API_BASE_URL, { params });
    return response.data;
  },

  /**
   * Get a part by ID
   * @param id Part ID
   * @returns PartViewModel
   */
  async getPartById(id: string): Promise<PartViewModel> {
    const response = await apiClient.get<PartViewModel>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new part
   * @param part Part data to create
   * @returns Created Part
   */
  async createPart(part: Omit<Part, 'id'>): Promise<Part> {
    const response = await apiClient.post<Part>(API_BASE_URL, part);
    return response.data;
  },

  /**
   * Update an existing part
   * @param id Part ID
   * @param part Part data to update
   * @returns Updated Part
   */
  async updatePart(id: string, part: Partial<Part>): Promise<Part> {
    const response = await apiClient.put<Part>(`${API_BASE_URL}/${id}`, part);
    return response.data;
  },

  /**
   * Delete a part
   * @param id Part ID to delete
   */
  async deletePart(id: string): Promise<void> {
    await apiClient.delete(`${API_BASE_URL}/${id}`);
  }
};

export default partApi;
