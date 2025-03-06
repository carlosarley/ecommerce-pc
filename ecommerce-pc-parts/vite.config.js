import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), // Necesario para React
    tailwindcss(), // Plugin de Tailwind CSS
  ],
});