import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Aspect Ratio',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Portrait } from '../examples/Portrait'
export { RootProvider } from '../examples/RootProvider'
export { Square } from '../examples/Square'
