import { defineConfig } from 'tsdown'
import solid from 'unplugin-solid/rolldown'

const entry = [
  './src/index.ts',
  './src/anatomy.ts',
  './src/utils/collection.ts',
  './src/factory/index.tsx',
  './src/components/*/index.ts',
  './src/providers/*/index.ts',
]

export default defineConfig([
  {
    entry,
    platform: 'neutral',
    format: ['esm'],
    dts: true,
    clean: true,
    plugins: [solid()],
    tsconfig: './tsconfig.build.json',
  },
  {
    entry,
    platform: 'neutral',
    format: ['esm'],
    dts: false,
    clean: false,
    inputOptions: {
      transform: {
        jsx: 'preserve',
      },
    },
    outExtensions: () => ({ js: '.jsx' }),
    tsconfig: './tsconfig.build.json',
  },
])
