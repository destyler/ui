import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'

const meta: Meta = {
  title: 'Providers / Runtime / Locale',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Basic = {
  render: () => ({
    Component: BasicExample,
  }),
}
