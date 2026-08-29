import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'

const meta: Meta = {
  title: 'Components / Data / Timer',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
