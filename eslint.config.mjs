import antfu, { astro, react, solid, svelte, vue } from '@antfu/eslint-config'

// Stage 2 pilot: activate Vue rules for the reviewed Frame provider only.
// Keep this explicit list until each additional source cohort has been reviewed.
// All other Vue components and Svelte remain tracked restoration work.
const vueFrameFiles = [
  'packages/vue/src/providers/frame/components/Content.vue',
  'packages/vue/src/providers/frame/components/Frame.vue',
  'packages/vue/src/providers/frame/examples/Basic.vue',
  'packages/vue/src/providers/frame/examples/Script.vue',
  'packages/vue/src/providers/frame/examples/SrcDoc.vue',
]

// The preset setup also introduces Vue globals; scope those to the same files.
const vueFrameConfig = (await vue({
  files: vueFrameFiles,
  typescript: true,
  overrides: {
    // import-lite joins ordinary and setup script bodies. Its import/first
    // fixer can move module exports into setup and break Vue compilation.
    // Ordinary JS/TS import ordering remains enabled.
    'import/first': 'off',
  },
})).map(config => ({ ...config, files: vueFrameFiles }))

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
  vueFrameConfig,
  {
    name: 'destyler/vue-frame-parser-compatibility',
    files: ['packages/vue/src/providers/frame/components/Frame.vue'],
    rules: {
      // Vue compiles iframe descendants; vue-eslint-parser sees raw text.
      // Preserve indentation checks outside that exact raw-text node.
      'vue/html-indent': ['error', 2, { ignores: ['VElement[name=\'iframe\'] > VText'] }],
      // Preserve the public Frame name while rejecting native frame/div/iframe.
      'vue/no-reserved-component-names': ['error', { htmlElementCaseSensitive: true }],
    },
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
  astro({
    files: ['docs/**/*.astro'],
  }),
)
