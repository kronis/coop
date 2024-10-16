import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.prettierrc.cjs', 'build/**/*', 'eslint.config.mjs', '.mocharc.cjs'],
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
