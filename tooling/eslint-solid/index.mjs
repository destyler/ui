import parser from '@typescript-eslint/parser'
import solid from 'eslint-plugin-solid'

// Preserve the reviewed Antfu 7 Solid rules without Antfu 9's optional ^0.17 peer.
// Materialize rule defaults so an upstream preset cannot silently change policy.
export default {
  name: 'destyler/solid/rules',
  files: ['packages/solid/**/*.{js,ts,jsx,tsx}'],
  plugins: { solid },
  languageOptions: {
    parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
    sourceType: 'module',
  },
  rules: {
    'solid/components-return-once': 'warn',
    'solid/event-handlers': ['error', { ignoreCase: false, warnOnSpread: false }],
    'solid/imports': 'error',
    'solid/jsx-no-duplicate-props': 'error',
    'solid/jsx-no-script-url': 'error',
    'solid/jsx-no-undef': ['error', { allowGlobals: false, autoImport: true, typescriptEnabled: true }],
    'solid/jsx-uses-vars': 'error',
    'solid/no-destructure': 'error',
    'solid/no-innerhtml': ['error', { allowStatic: true }],
    'solid/no-react-deps': 'error',
    'solid/no-react-specific-props': 'error',
    'solid/no-unknown-namespaces': 'off',
    'solid/prefer-for': 'error',
    // Preserve eager memo-read warnings while accepting live accessor arguments.
    'solid/reactivity': ['warn', { customReactiveFunctions: [], allowEagerMemoArguments: false }],
    'solid/self-closing-comp': 'error',
    'solid/style-prop': ['error', { allowString: false, styleProps: ['style', 'css'] }],
  },
}
