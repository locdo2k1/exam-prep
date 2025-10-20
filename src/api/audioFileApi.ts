import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface FileInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareLinkRequest {
  path: string;
  settings: {
    access: 'viewer' | 'editor' | 'viewer_no_comment';
    allow_download: boolean;
    audience: 'public' | 'team' | 'no_one';
    requested_visibility: 'public' | 'team_only';
  };
}

export interface ShareLinkResponse {
  url: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const audioFileApi = {
  /**
   * Upload an audio file
   * @param file The audio file to upload
   * @param path Optional path where the file should be stored
   * @returns Promise with file information
   */
  async uploadAudio(file: File, path: string = ''): Promise<FileInfo> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await api.post<FileInfo>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get file information by ID
   * @param fileId The ID of the file
   * @returns Promise with file information
   */
  async getFileInfo(fileId: string): Promise<FileInfo> {
    const response = await api.get<FileInfo>(`/files/${fileId}`);
    return response.data;
  },

  /**
   * Get a temporary download URL for a file
   * @param fileId The ID of the file
   * @returns Promise with the download URL
   */
  async getFileUrl(fileId: string): Promise<string> {
    const response = await api.get(`/files/${fileId}/url`);
    return response.data;
  },

  /**
   * Download a file by ID
   * @param fileId The ID of the file to download
   * @returns Promise with the file data
   */
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await api.get<Blob>(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * List files in a specific path
   * @param path The path to list files from (optional)
   * @returns Promise with list of file information
   */
  async listFiles(path: string = ''): Promise<FileInfo[]> {
    const response = await api.get<FileInfo[]>('/files', {
      params: { path },
    });
    return response.data;
  },

  /**
   * Delete a file by ID
   * @param fileId The ID of the file to delete
   */
  async deleteFile(fileId: string): Promise<void> {
    await api.delete(`/files/${fileId}`);
  },

  /**
   * Create a shareable link for a file
   * @param request The share link request parameters
   * @returns Promise with the shareable link
   */
  async createShareLink(request: ShareLinkRequest): Promise<ShareLinkResponse> {
    const response = await api.post<ShareLinkResponse>('/files/share-link', request);
    return response.data;
  },
};

export default audioFileApi;
