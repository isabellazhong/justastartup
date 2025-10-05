/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_GEMINI_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}