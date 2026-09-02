import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Floating Panel',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Controlled } from '../examples/Controlled'
export { DefaultOpen } from '../examples/DefaultOpen'
export { RootProvider } from '../examples/RootProvider'
export { WithContext } from '../examples/WithContext'
