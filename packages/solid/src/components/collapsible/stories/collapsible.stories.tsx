import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Collapsible',
}

export default meta

export { Basic } from '../examples/Basic'
export { InitialOpen } from '../examples/InitialOpen'
export { LazyMount } from '../examples/LazyMount'
export { LazyMountAndUnmountOnExit } from '../examples/LazyMountAndUnmountOnExit'
export { OnExitComplete } from '../examples/OnExitComplete'
export { RootProvider } from '../examples/RootProvider'
export { UnmountOnExit } from '../examples/UnmountOnExit'
