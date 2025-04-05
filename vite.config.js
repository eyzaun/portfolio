import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        about: 'src/pages/about.html',
        projects: 'src/pages/projects.html',
        contact: 'src/pages/contact.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});