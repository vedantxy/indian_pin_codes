import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* global process */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': API_URL,
      },
    },
    optimizeDeps: {
      include: [
        'react-is',
        'recharts',
        'react-simple-maps',
        'd3-geo',
        'd3-scale',
        'topojson-client',
      ],
    },
  };
});
