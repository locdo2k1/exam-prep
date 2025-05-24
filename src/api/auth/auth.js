import apiClient from "../axios";

async function getToken(code, provider) {
   try {
      const response = await apiClient.post('/auth/token', null, {
         params: {
            code: code,
            provider: provider
         }
      });

      return response;
   } catch (error) {
      console.error('Token error:', error);
      return null;
   }
}

export { getToken };
