// src/services/GoogleAuthService.ts
import { ref, Ref, onMounted } from "vue";
import { getToken } from "./auth.js";
import { useRouter, Router } from "vue-router";

interface GoogleUser {
  code: string;
  [key: string]: string | undefined;
}

import { AxiosResponse } from "axios";

type TokenResponse = AxiosResponse<string> | null;

interface GoogleAuthCallback {
  (response: GoogleUser): void;
}

export function useGoogleAuth(clientId: string) {
  const isGapiLoaded: Ref<boolean> = ref(false);
  const isInitialized: Ref<boolean> = ref(false);
  const isSignedIn: Ref<boolean> = ref(false);
  const googleUser: Ref<GoogleUser | null> = ref(null);
  const error: Ref<string | null> = ref(null);
  const router: Router = useRouter();

  // Initialize Google Sign-In
  const initializeGoogleSignIn = (callback: GoogleAuthCallback): void => {
    if (!window.google) {
      console.debug("Google SDK not loaded yet");
      return;
    }

    try {
      console.debug("Initializing Google Sign-In");
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          console.debug("Google callback triggered", response);
          callback(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      console.debug("Google Sign-In initialized successfully");
      isInitialized.value = true;
    } catch (err) {
      console.error("Failed to initialize Google Sign-In:", err);
      error.value = "Failed to initialize Google Sign-In";
    }
  };

  // Prompt for Google Sign-In
  const promptSignIn = (redirectUrl: string): void => {
    console.log("Prompting for Google Sign-In...");
    if (!isInitialized.value || !window.google) {
      error.value = "Google Sign-In not initialized";
      return;
    }

    try {
      window.google.accounts.oauth2
        .initCodeClient({
          client_id: clientId,
          scope: "email profile",
          ux_mode: "popup",
          redirect_uri: "http://localhost:5173",
          callback: (response: GoogleUser) => {
            if (response.code) {
              googleUser.value = response;
              isSignedIn.value = true;

              getToken(response.code, "google")
                .then((tokenResponse: TokenResponse) => {
                  console.log("Token received:", tokenResponse);

                  if (tokenResponse) {
                    localStorage.setItem("token", tokenResponse.data);
                    router.push(redirectUrl);
                  }
                })
                .catch((err: Error) => {
                  error.value = "Failed to get token";
                  console.error(err);
                });

              console.log("Successfully signed in:", response);
            }
          },
        })
        .requestCode();
    } catch (err) {
      error.value = "Failed to prompt for sign-in";
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
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isGapiLoaded.value = true;
      };
      script.onerror = () => {
        error.value = "Failed to load Google Identity Services SDK";
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
    promptSignIn,
  };
}

// Add type declarations for the Google API
interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: GoogleUser) => void;
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
}

interface GoogleCodeClientConfig {
  client_id: string;
  scope: string;
  ux_mode: "popup" | "redirect";
  redirect_uri: string;
  callback: (response: GoogleUser) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
        };
        oauth2: {
          initCodeClient: (config: GoogleCodeClientConfig) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}
