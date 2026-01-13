import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ command }) => {
  // Demo mode: serve the demo app
  if (command === 'serve') {
    return {
      plugins: [react()],
      root: './demo',
    };
  }

  // Build mode: build the library
  return {
    plugins: [react()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'SmartTooltip',
        formats: ['es', 'cjs'],
        fileName: (format) => (format === 'cjs' ? 'smart-tooltip.cjs' : 'smart-tooltip.js'),
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react-bootstrap'],
      },
    },
  };
});
