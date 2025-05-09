import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        plugin(),
        tsconfigPaths()
    ],
    base: '/',
    server: {
        port: 55423,
    }
})
