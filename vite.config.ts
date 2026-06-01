import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// Modo "library": `vite build` empacota src/index.ts como pacote npm
// (ES + UMD) e o vite-plugin-dts gera os .d.ts. Em `vite dev`, o index.html
// da raiz serve o playground em examples/.
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RpgPropKit',
      fileName: 'rpg-prop-kit',
      cssFileName: 'rpg-prop-kit',
    },
    rollupOptions: {
      // React é peer dependency — não empacotar junto.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
})
