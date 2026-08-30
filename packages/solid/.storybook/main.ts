import type { StorybookConfig } from 'storybook-solidjs-vite'

const config: StorybookConfig = {
  stories: [
    '../**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: 'storybook-solidjs-vite',
    options: {},
  },
}

export default config
