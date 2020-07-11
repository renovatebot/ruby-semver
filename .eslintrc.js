module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 9,
    tsconfigRootDir: __dirname,
    project: './tsconfig.lint.json',
  },
  rules: {
    'import/no-unresolved': 0, // done by typescript
    'import/prefer-default-export': 0, // no benefit
    'require-await': 'error',
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'no-underscore-dangle': 0,

    // TODO: fix lint
    '@typescript-eslint/camelcase': 'off', // disabled until ??
    '@typescript-eslint/no-var-requires': 'off', // disable until all files converted to typescript
    '@typescript-eslint/no-use-before-define': 'off', // disable until all files converted to typescript
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
      },
    ], // disable until proper interfaced api
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      env: {
        jest: true,
      },
      rules: {
        'prefer-destructuring': 0,
        'prefer-promise-reject-errors': 0,
        'import/no-dynamic-require': 0,
        'global-require': 0,

        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/unbound-method': 0,
      },
    },
    {
      files: ['**/*.mjs'],

      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
};
