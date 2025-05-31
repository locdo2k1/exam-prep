import apiClient from "../axios";

export const login = async (username, password) => {
   const response = await apiClient.post('/auth/login', {}, {
      auth: {
         username: username.toString(),
         password: password.toString(),
      },
   });

   return response;
};
