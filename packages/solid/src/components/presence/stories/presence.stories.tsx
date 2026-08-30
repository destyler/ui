import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Presence',
}

export default meta

export { Basic } from '../examples/Basic'
export { LazyMount } from '../examples/LazyMount'
export { LazyMountAndUnmountOnExit } from '../examples/LazyMountAndUnmountOnExit'
export { UnmountOnExit } from '../examples/UnmountOnExit'
