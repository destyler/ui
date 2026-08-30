import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Navigation / Breadcrumbs',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Context } from '../examples/Context'
export { RootProvider } from '../examples/RootProvider'
