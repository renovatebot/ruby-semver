/* eslint-disable import/no-named-as-default-member */
import eslintContainerbase from '@containerbase/eslint-plugin';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintJestPlugin from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: [
      '**/.git/',
      '**/.vscode',
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/__fixtures__/**/*',
      '**/__mocks__/**/*',
      '**/*.d.ts',
      '**/*.generated.ts',
      'tools/dist',
      'patches',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,js,mjs,cjs}'],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,js,mjs,cjs}'],
  })),
  eslintPluginImport.flatConfigs.errors,
  eslintPluginImport.flatConfigs.warnings,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  eslintJestPlugin.configs['flat/recommended'],
  eslintJestPlugin.configs['flat/style'],
  pluginPromise.configs['flat/recommended'],
  eslintContainerbase.configs.all,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,js,mjs,cjs}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'eslint.config.mjs',
            'test/**',
            'tools/**',
            'jest.config.js',
            '__mocks__/**',
            '**/*.test.ts',
          ],
        },
      ],

      'require-await': 'error',
      'no-use-before-define': 0,
      'no-restricted-syntax': 0,
      'no-await-in-loop': 0,
      'prefer-destructuring': 'off',
      'prefer-template': 'off',
      'no-underscore-dangle': 0,
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-member-accessibility': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      // '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-non-null-assertion': 0,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: false,
        },
      ],

      // TODO: fixme
      '@typescript-eslint/prefer-nullish-coalescing': 0,
    },
  },
  {
    files: ['**/*.test.ts'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      'jest/expect-expect': 0,
    },
  },
);
