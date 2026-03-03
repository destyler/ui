import antfu, { astro, react, vue } from '@antfu/eslint-config'

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
    ...astro({
      files: ['docs/**/*.{js,ts,jsx,tsx,astro}'],
    }),
  },
)
