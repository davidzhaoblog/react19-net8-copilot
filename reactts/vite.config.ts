import { defineConfig, loadEnv } from 'vite';
import plugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        plugin(),
        tsconfigPaths()
    ],
    base: '/',
    server: {
        port: 55423,
    }
})
