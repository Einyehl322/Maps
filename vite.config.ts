import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // maplibre-gl carga su worker como módulo aparte; el pre-bundle de deps no lo
  // resuelve y el mapa se queda en blanco.
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  // El worker de MapLibre se carga como módulo (`type: 'module'`).
  worker: {
    format: 'es',
  },
})
