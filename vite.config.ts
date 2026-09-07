import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
            output: {},
        },
    },
    server: {
        port: 4321,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
