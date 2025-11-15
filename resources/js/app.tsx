import '../css/app.css';
import './ziggy';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

// Make route function globally available from Ziggy
if (typeof window !== 'undefined') {
    window.route = window.route || ((name: string, parameters?: any) => {
        // First check if Ziggy is available on window
        const ziggyRoutes = (window as any).Ziggy?.routes;
        const ziggyUrl = (window as any).Ziggy?.url;

        if (!ziggyRoutes || !ziggyUrl) {
            console.error('Ziggy routes not found. Make sure ziggy.js is loaded.');
            throw new Error('Ziggy routes not found.');
        }

        const route = ziggyRoutes[name];

        if (!route) {
            console.error('Available routes:', Object.keys(ziggyRoutes));
            throw new Error(`Route [${name}] not found.`);
        }

        const uri = route.uri.replace(/\{([^}]+)\}/g, (match: string, param: string) => {
            return parameters?.[param] || match;
        });

        return ziggyUrl + '/' + uri.replace(/^\/+/, '');
    });
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
