// src/services/GoogleAuthService.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useGoogleAuth(clientId) {
   const isGapiLoaded = ref(false);
   const isInitialized = ref(false);
   const isSignedIn = ref(false);
   const googleUser = ref(null);
   const error = ref(null);

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
   const promptSignIn = () => {
      if (!isInitialized.value || !window.google) {
         error.value = 'Google Sign-In not initialized';
         return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUri = urlParams.get('redirect') || '';
      const fullRedirectUri = `${window.location.origin}${redirectUri}`;
      console.log(fullRedirectUri);

      try {
         window.google.accounts.oauth2.initCodeClient({
            client_id: clientId,
            scope: 'email profile',
            ux_mode: 'redirect',
            redirect_uri: fullRedirectUri,
            callback: (response) => {
               if (response.code) {
                  googleUser.value = response;
                  isSignedIn.value = true;
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