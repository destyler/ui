import { mergeConfig } from 'vitest/config'
import { browserSmokeConfig } from '../../utils/test/browser-smoke/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  browserSmokeConfig('svelte', new URL('.', import.meta.url)),
)
