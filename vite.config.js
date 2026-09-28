import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost/locations-app",
    },
  },
  preview: {
    proxy: {
      "/api": "http://localhost/locations-app",
    },
  },
});
