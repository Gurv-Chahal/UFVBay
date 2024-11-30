import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Keeps your custom server port
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Resolves the 'global is not defined' error
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Provides polyfills for Node.js globals
        }),
      ],
    },
  },
  resolve: {
    alias: {
      global: 'globalThis', // Ensures global alias compatibility
    },
  },
});
