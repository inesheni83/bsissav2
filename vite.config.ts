import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // Plugin Wayfinder temporairement désactivé pour éviter les conflits
        // avec les contrôleurs d'authentification à deux facteurs
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
