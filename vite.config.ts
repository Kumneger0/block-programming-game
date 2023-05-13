import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    rollupOptions: {
      plugins: [terser()],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            const packageName = id.match(/\/node_modules\/([^/]+)\//)[1];
            return `vendor/${packageName}`;
          }
        },
      },
    },
  },
});
