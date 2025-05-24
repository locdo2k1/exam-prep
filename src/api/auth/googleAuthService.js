// src/services/GoogleAuthService.js
import { ref, onMounted } from 'vue';
import { getToken } from './auth.js';
import { useRouter } from 'vue-router';

export function useGoogleAuth(clientId) {
   const isGapiLoaded = ref(false);
   const isInitialized = ref(false);
   const isSignedIn = ref(false);
   const googleUser = ref(null);
   const error = ref(null);
   const router = useRouter();

   // Initialize Google Sign-In
   const initializeGoogleSignIn = (callback) => {
      if (!window.google) {
         error.value = 'Google Identity Services SDK not loaded';
         return;
      }

      try {
         window.google.accounts.id.initialize({
            client_id: clientId,
            callback: callback,
            auto_select: false,
            cancel_on_tap_outside: true
         });
         isInitialized.value = true;
      } catch (err) {
         error.value = 'Failed to initialize Google Sign-In';
         console.error(err);
      }
   };

   // Prompt for Google Sign-In
   const promptSignIn = (redirectUrl) => {
      console.log('Prompting for Google Sign-In...');
      if (!isInitialized.value || !window.google) {
         error.value = 'Google Sign-In not initialized';
         return;
      }

      try {
         window.google.accounts.oauth2.initCodeClient({
            client_id: clientId,
            scope: 'email profile',
            ux_mode: 'popup', // Changed from 'redirect' to 'popup'
            redirect_uri: 'http://localhost:5173',
            callback: (response) => {
               if (response.code) {
                  googleUser.value = response;
                  isSignedIn.value = true;

                  getToken(response.code, 'google')
                     .then(tokenResponse => {
                        console.log('Token received:', tokenResponse);

                        localStorage.setItem('token', tokenResponse.data);
                        router.push(redirectUrl);
                     })
                     .catch(err => {
                        error.value = 'Failed to get token';
                        console.error(err);
                     });

                  console.log('Successfully signed in:', response);
               }
            }
         }).requestCode();
      } catch (err) {
         error.value = 'Failed to prompt for sign-in';
         console.error(err);
      }
   };

   // Mounted hook to load gapi
   onMounted(() => {
      // Check if the script is already loaded
      if (window.google?.accounts) {
         isGapiLoaded.value = true;
      } else {
         // If we need to manually load the script
         const script = document.createElement('script');
         script.src = 'https://accounts.google.com/gsi/client';
         script.async = true;
         script.defer = true;
         script.onload = () => {
            isGapiLoaded.value = true;
         };
         script.onerror = () => {
            error.value = 'Failed to load Google Identity Services SDK';
         };
         document.head.appendChild(script);
      }
   });

   return {
      isGapiLoaded,
      isInitialized,
      isSignedIn,
      googleUser,
      error,
      initializeGoogleSignIn,
      promptSignIn
   };
}   