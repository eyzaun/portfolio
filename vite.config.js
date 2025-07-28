import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/portfolio/', // GitHub Pages için portfolio repository base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
});