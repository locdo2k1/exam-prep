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
      return response;
   },
   (error) => {
      if (error.response.status === 401) {
         // Handle unauthorized
         console.log("Handle unauthorized");
      }
      if (error.response.status === 403) {
         // Handle forbidden
         console.log("Handle forbidden");
      }
      if (error.response.status === 404) {
         // Handle not found
      }
      if (error.response.status === 500) {
         // Handle server error
      }
      throw error;
   },
);

export default apiClient;
