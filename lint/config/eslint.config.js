const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

const config = {
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            project: 'tsconfig.json',
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        globals: {
            browser: true,
            es6: true,
        },
    },
    plugins: {
        '@typescript-eslint': typescriptPlugin,
        'import': require('eslint-plugin-import'),
        'zeta': require('eslint-plugin-zeta'),
        '@angular-eslint': require('@angular-eslint/eslint-plugin'),
    },
};

