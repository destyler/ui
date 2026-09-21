import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'

const meta: Meta = {
  title: 'Components / Navigation / Tree',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Controlled = { render: () => ({ Component: ControlledExample }) }
