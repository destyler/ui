import { defineConfig } from 'tsdown'
import { splitDtsVariableDeclarations } from './build/split-dts-variable-declarations.ts'

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  platform: 'neutral',
  fromVite: true,
  format: [
    'esm',
  ],
  dts: true,
  plugins: [splitDtsVariableDeclarations],
})
