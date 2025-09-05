import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import js from '@eslint/js';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {}
    },
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
      )
    ),
    plugins: {
      'react-refresh': reactRefresh
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'react-refresh/only-export-components': 'warn'
    }
  }
]);
