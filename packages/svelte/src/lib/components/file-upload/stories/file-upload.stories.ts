import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / File Upload',
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

export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
