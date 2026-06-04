import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Config separada do build (vite.config.ts) para não carregar o vite-plugin-dts
// nem o modo library durante os testes. Ambiente jsdom para os componentes React.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
