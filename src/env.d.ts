// Tell TypeScript about Vite's environment variables typing
/// <reference types="vite/client" />

import type { DefineComponent } from "vue";

// Provide type information for .vue file imports
declare module "*.vue" {
  // Define basic component type structure:
  // - First object: props
  // - Second object: emits
  // - Third unknown: other component options
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// Define type for environment variables
// This allows TypeScript to know about your .env file variables
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // Add other env variables here as needed
}

// Enhance the ImportMeta interface from Vite
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow TypeScript to understand @ path aliases
declare module "@/*";
