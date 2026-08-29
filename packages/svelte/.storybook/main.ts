import type { StorybookConfig } from '@storybook/svelte-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../src/lib/**/stories/**/*.mdx',
    '../src/lib/**/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|svelte)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(config) {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      $lib: path.resolve(__dirname, '../src/lib'),
    }
    return config
  },
}

export default config
