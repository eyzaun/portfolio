import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/', // .github.io repository'si için root path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});