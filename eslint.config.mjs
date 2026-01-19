import antfu, { react, vue } from '@antfu/eslint-config'

export default antfu(
  {
    pnpm: false,
    vue: false,
    react: false,
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
  },
)
