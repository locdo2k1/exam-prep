import { AxiosResponse } from 'axios';
import apiClient from './axios';

export interface BasicUserInfo {
  id: string;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export const getUserBasicInfo = async (
  userId?: string
): Promise<AxiosResponse<ApiResponse<BasicUserInfo>>> => {
  const url = userId ? `/users/${userId}/basic` : '/users/me/basic';
  const response = await apiClient.get<ApiResponse<BasicUserInfo>>(url);
  return response;
};

const userApi = {
  getBasicUserInfo: getUserBasicInfo,
};

export default userApi;
