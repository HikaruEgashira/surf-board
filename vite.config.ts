import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { securityHeaders } from './src/config/security';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/surf-board/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value])),
  },
});
