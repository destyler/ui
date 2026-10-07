import antfu, { astro, react, solid, svelte, vue } from '@antfu/eslint-config'

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
  // Other framework preset activation is tracked separately: their existing
  // Promise spreads remain inert until parser scope and diagnostics are reviewed.
  {
    ...vue({
      files: ['packages/vue/**/*.{vue,js,ts,jsx,tsx}'],
    }),
  },
  // Preset builders return Promise<FlatConfig[]>; the composer resolves them.
  react({
    files: ['packages/react/**/*.{js,ts,jsx,tsx}'],
  }),
  {
    // Preserve this existing global style override, including other JSX users.
    rules: {
      'style/jsx-one-expression-per-line': 'off',
    },
  },
  {
    ...svelte({
      files: ['packages/svelte/**/*.{svelte,js,ts}'],
    }),
  },
  // Resolve the async preset through the composer; spreading it drops its rules.
  // Other inactive framework presets remain separately tracked work.
  solid({
    files: ['packages/solid/**/*.{js,ts,jsx,tsx}'],
  }),
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
