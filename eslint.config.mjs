import antfu, { astro, react, svelte, vue } from '@antfu/eslint-config'

export default antfu(
  {
    pnpm: false,
    vue: false,
    react: false,
    astro: false,
    ignores: [
      '.specstory/**',
    ],
  },
  {
    ...vue({
      files: ['packages/vue/**/*.{vue,js,ts,jsx,tsx}'],
    }),
  },
  {
    ...react({
      files: ['packages/react/**/*.{js,ts,jsx,tsx}'],
    }),
    rules: {
      'style/jsx-one-expression-per-line': 'off',
    },
  },
  {
    ...svelte({
      files: ['packages/svelte/**/*.{svelte,js,ts}'],
    }),
  },
  {
    files: ['packages/svelte/package.json'],
    rules: {
      // npm applies `files` patterns in order; sorting would re-include
      // development-only files after their exclusion rules.
      'jsonc/sort-array-values': 'off',
    },
  },
  {
    ...astro({
      files: ['docs/**/*.{js,ts,jsx,tsx,astro}'],
    }),
  },
)
