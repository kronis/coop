import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import { rules } from '@eslint/js/src/configs/eslint-all';

export default [
  {
    ignores: ['.prettierrc.js', 'build/**/*', 'eslint.config.mjs'],
  },
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.spec.{js,mjs,cjs,ts}'],
    rules: {
      '@typescript-eslint/no-unsafecall': 'off',
    },
  },
];
