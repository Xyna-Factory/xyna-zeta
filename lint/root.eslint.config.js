//   instructions:
//
// - copy this file directly into the root project folder (next to package.json) and rename it to 'eslint.config.js'.
// - uncomment one of the lines inside the 'rules' object to either enable base or strict linting of the project.
// - replace the '[PROJECT]' string with the project's name to ensure the path to the eslint.config.js file is valid.

import globals from 'globals';
import tseslint from 'typescript-eslint';
// // eslint-disable-next-line zeta/xo
// import strictConfig from './projects/[PROJECT]/src/app/zeta/lint/config/strict/eslint.config.js';
// import baseConfig from './projects/[PROJECT]/src/app/zeta/lint/config/base/eslint.config.js';
import typescriptParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';
import angularPlugin from '@angular-eslint/eslint-plugin';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import zetaPlugin from 'eslint-plugin-zeta';
import { fileURLToPath } from 'url';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,ts}']
    },
    {
        languageOptions: {
            parser: typescriptParser,
            globals: globals.browser,
            parserOptions: {
                tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)),
                projectService: {
                    allowDefaultProject: [
                        'eslint.config.js',
                        'projects/xyna/src/app/zeta/lint/config/base/eslint.config.js',
                        'projects/xyna/src/app/zeta/lint/config/strict/eslint.config.js',
                        'projects/xyna/src/app/zeta/lint/plugins/eslint-plugin-zeta/index.js',
                        'projects/xyna/src/app/zeta/lint/root.eslint.config.js'
                    ]
                }
            }
        },
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.min.js'
        ],
        plugins: {
            stylistic,
            '@angular-eslint': angularPlugin,
            '@typescript-eslint': typescriptPlugin,
            import: importPlugin,
            zeta: zetaPlugin
        }
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            // ...baseConfig[0].rules,
            // ...strictConfig[0].rules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    }
];
