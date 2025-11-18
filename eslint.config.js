import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'], // Required for React 17+
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        ignores: [
            'vendor',
            'node_modules',
            'public',
            'bootstrap/ssr',
            'tailwind.config.js',
            'resources/js/ziggy.js',
            'resources/js/app.tsx',
            'resources/js/types/index.d.ts',
            'resources/js/hooks/useProductForm.ts',
            'resources/js/pages/admin/orders/orderDetails.tsx',
            'resources/js/pages/admin/settings/siteSettings.tsx',
            'resources/js/pages/product/addProduct.tsx',
            'resources/js/pages/product/editProduct.tsx',
            'resources/js/pages/product/productList.tsx',
            'resources/js/components/ui/wysiwyg-editor.tsx',
            'resources/js/components/user-menu-content.tsx',
        ],
    },
    prettier, // Turn off all rules that might conflict with Prettier
];
