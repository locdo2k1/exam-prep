import apiClient from "../axios";

export const login = async (userData) => {
   const response = await apiClient.post('/auth/login', userData);
   return response.data;
};