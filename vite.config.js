import { defineConfig } from 'vite';

// base './' keeps every asset path relative, so the same build works at
// https://<user>.github.io/<repo>/, on a custom domain, or opened from a subfolder.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500 },
  server: { host: true },
  preview: { host: true },
});
