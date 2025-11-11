// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Em produção (no GitHub Pages) o app vive em /financiamento-simulator/
  // Em dev, continua em '/'
  base: mode === 'production' ? '/financiamento-simulator/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    // opcional: evita alertas chatos em projetos com gráficos/libs grandes
    chunkSizeWarningLimit: 1000,
  },
}))
