import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname),
      '@': path.resolve(__dirname),
      '~~': path.resolve(__dirname),
      '@@': path.resolve(__dirname),
      // Add aliases for subdirectories of app and shared if needed, but the root alias should be sufficient for most imports.
    },
  },
});
