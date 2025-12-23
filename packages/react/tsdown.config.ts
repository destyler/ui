import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  platform: 'neutral',
  fromVite: true,
  format: [
    'esm',
  ],
  dts: {
    vue: true,
  },
})
