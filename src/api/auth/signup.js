import apiClient from '../axios';

export const signup = async (username, email, password) => {
   try {
      const response = await apiClient.post('/auth/signup', {
         username,
         email,
         password,
      });
      return response.data;
   } catch (error) {
      throw error;
   }
};