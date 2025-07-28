import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/eyzaun.github.io2/', // GitHub Pages için repository base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});