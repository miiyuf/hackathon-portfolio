import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
        include: ['react', 'react-dom', '@material-tailwind/react'],
    },
    resolve: {
        dedupe: ['react', 'react-dom'],
    },
    server: {
        host: '0.0.0.0',
    },
})
