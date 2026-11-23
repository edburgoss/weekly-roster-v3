import gasPlugin from '@gas-plugin/unplugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [gasPlugin({ manifest: 'appsscript.json' })],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: 'src/backend/index.ts',
      formats: ['es'],
      fileName: () => 'Code.js',
    },
  },
});
