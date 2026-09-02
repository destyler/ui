import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Navigation Menu',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Controlled } from '../examples/Controlled'
export { CustomDelay } from '../examples/CustomDelay'
export { DisableClick } from '../examples/DisableClick'
export { DisableHover } from '../examples/DisableHover'
export { RootProvider } from '../examples/RootProvider'
export { Vertical } from '../examples/Vertical'
