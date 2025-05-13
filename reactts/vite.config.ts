import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        plugin(),
        tailwindcss(),
        tsconfigPaths()
    ],
    base: '/',
    server: {
        port: 55423,
    }
})
