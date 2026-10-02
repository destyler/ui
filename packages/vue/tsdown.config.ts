import { defineConfig } from 'tsdown'
import { compatibleDts } from './build/compatible-dts.ts'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  platform: 'neutral',
  fromVite: true,
  format: [
    'esm',
  ],
  plugins: [compatibleDts],
  dts: {
    vue: true,
  },
})
