import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        chrome: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'indent': ['warn', 2],
      'no-undef': 'error',
      'no-unused-expressions': 'warn',
      'camelcase': 'warn',
      'max-len': ['warn', { code: 200 }]
    },
    ignores: [
      'node_modules/*',
      'dist/*',
      'build/*'
    ]
  }
];
