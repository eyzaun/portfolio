import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './', // GitHub Pages için relative path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});