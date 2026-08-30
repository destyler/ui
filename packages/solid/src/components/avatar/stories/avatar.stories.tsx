import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Avatar',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Close } from '../examples/Close'
export { Context } from '../examples/Context'
export { Event } from '../examples/Event'
export { Provider } from '../examples/provider'
export { RootProvider } from '../examples/RootProvider'
