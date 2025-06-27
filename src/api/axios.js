import axios from 'axios';

const apiClient = axios.create({
   baseURL: 'http://localhost:8080/api',
   timeout: 10000,
   headers: {
      'Access-Control-Allow-Origin': '*',
   },
   paramsSerializer: params => {
      const query = new URLSearchParams();
      for (const key in params) {
         if (params[key] !== undefined) {
            query.append(key, encodeURIComponent(params[key]));
         }
      }
      return query.toString();
   }
});

apiClient.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      // Set Content-Type based on the request data
      if (config.data instanceof FormData) {
         config.headers['Content-Type'] = 'multipart/form-data';
      } else {
         config.headers['Content-Type'] = 'application/json';
      }

      return config;
   },
);

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data - The response data
 * @property {string} [message] - Optional message from the server
 * @property {boolean} success - Indicates if the request was successful
 */

apiClient.interceptors.response.use(
   (response) => {
      // Ensure the response follows the ApiResponse format
      const apiResponse = response.data;
      if (apiResponse && typeof apiResponse.success === 'boolean') {
         return {
            data: apiResponse.data,
            message: apiResponse.message,
            success: apiResponse.success
         };
      }
      
      // If the response doesn't match the expected format, normalize it
      return {
         data: apiResponse,
         success: true
      };
   },
   (error) => {
      if (error.response?.data) {
         const apiResponse = error.response.data;
         return Promise.reject({
            data: apiResponse.data || null,
            message: apiResponse.message || 'An error occurred',
            success: false,
            status: error.response.status,
            errors: apiResponse.errors
         });
      }

      // Handle network errors or other non-API errors
      if (error.response?.status === 401) {
         // Handle unauthorized
         console.log("Handle unauthorized");
         return Promise.reject({
            data: null,
            message: 'Unauthorized access',
            success: false,
            status: 401
         });
      } else if (error.response?.status === 403) {
         // Handle forbidden
         console.log("Handle forbidden");
         return Promise.reject({
            data: null,
            message: 'Access forbidden',
            success: false,
            status: 403
         });
      }

      // For other types of errors
      return Promise.reject({
         data: null,
         message: error.message || 'An unexpected error occurred',
         success: false,
         status: error.response?.status
      });
   }
);

export default apiClient;
