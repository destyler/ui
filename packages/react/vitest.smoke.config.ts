import type { ReactBabelOptions } from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import { browserSmokeConfig } from '../../utils/test/browser-smoke/config'
import viteConfig from './vite.config'

export default mergeConfig(
  mergeConfig(viteConfig, defineConfig({
    plugins: [{
      name: 'browser-smoke-react-babel-cwd',
      // The production compiler remains intact; only resolve its plugin from
      // the React package when this project is launched at the workspace root.
      api: {
        reactBabel(options: ReactBabelOptions) {
          options.cwd = fileURLToPath(new URL('.', import.meta.url))
        },
      },
    }],
  })),
  browserSmokeConfig('react', new URL('.', import.meta.url)),
)
