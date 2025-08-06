import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
        }),
    ],
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
    resolve: {
        dedupe: ['react', 'react-dom'],
    },
    server: {
        host: '0.0.0.0', 
        proxy: {
            '/api': {
                target: 'http://backend:8000',
                changeOrigin: true
            }
        }
    },
})
