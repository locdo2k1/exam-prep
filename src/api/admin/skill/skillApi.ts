import apiClient from "@/api/axios";
import type { AxiosResponse, AxiosError } from "axios";

/**
 * Skill View Model
 */
export interface SkillVM {
  id: string;
  code: string;
  name: string;
  description?: string;
}

/**
 * API Response Type
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Get all skills
 * @returns Promise with all skills
 */
export const getAllSkills = async (): Promise<ApiResponse<SkillVM[]>> => {
  try {
    return await apiClient.get("skills");
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Get skill by ID
 * @param id The ID of the skill to retrieve
 * @returns Promise with the skill data
 */
export const getSkillById = async (id: string): Promise<ApiResponse<SkillVM>> => {
  try {
    return await apiClient.get(`skills/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Get skill by code
 * @param code The code of the skill to retrieve
 * @returns Promise with the skill data
 */
export const getSkillByCode = async (code: string): Promise<ApiResponse<SkillVM>> => {
  try {
    return await apiClient.get(`skills/code/${code}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Create a new skill
 * @param skill The skill data to create
 * @returns Promise with the created skill
 */
export const createSkill = async (skill: Omit<SkillVM, "id">): Promise<ApiResponse<SkillVM>> => {
  try {
    return await apiClient.post("skills", skill);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Update an existing skill
 * @param id The ID of the skill to update
 * @param skill The skill data to update
 * @returns Promise with the updated skill
 */
export const updateSkill = async (id: string, skill: Omit<SkillVM, "id">): Promise<ApiResponse<SkillVM>> => {
  try {
    return await apiClient.put(`skills/${id}`, skill);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

/**
 * Delete a skill by ID
 * @param id The ID of the skill to delete
 * @returns Promise with the delete response
 */
export const deleteSkill = async (id: string): Promise<ApiResponse<void>> => {
  try {
    return await apiClient.delete(`skills/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    throw axiosError.response || { data: { success: false, message: "An error occurred" } };
  }
};

// Export all API functions as default
export default {
  getAllSkills,
  getSkillById,
  getSkillByCode,
  createSkill,
  updateSkill,
  deleteSkill,
};
