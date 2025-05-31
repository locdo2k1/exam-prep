import axios from 'axios';

const apiClient = axios.create({
   baseURL: 'http://localhost:8080/api',
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
   },
});

apiClient.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
);

apiClient.interceptors.response.use(
   (response) => {
      const apiResponse = response.data;
      if (apiResponse.success) {
         return apiResponse.data;
      }
      return Promise.reject({
         message: apiResponse.message,
         status: apiResponse.status,
         errors: apiResponse.errors
      });
   },
   (error) => {
      if (error.response?.data) {
         const apiResponse = error.response.data;
         return Promise.reject({
            message: apiResponse.message,
            status: apiResponse.status,
            errors: apiResponse.errors
         });
      }

      if (error.response?.status === 401) {
         // Handle unauthorized
         console.log("Handle unauthorized");
      } else if (error.response?.status === 403) {
         // Handle forbidden
         console.log("Handle forbidden");
      }

      return Promise.reject(error);
   },
);

export default apiClient;
