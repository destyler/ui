import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'

const meta: Meta = {
  title: 'Components / Data / Toggle',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
