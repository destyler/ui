import type { Meta } from '@storybook/svelte-vite'
import AdvancedExample from '../examples/Advanced.svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import MultipleExample from '../examples/Multiple.svelte'
import ReactiveCollectionExample from '../examples/ReactiveCollection.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / Select',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Advanced = { render: () => ({ Component: AdvancedExample }) }
export const Basic = { render: () => ({ Component: BasicExample }) }
export const Controlled = { render: () => ({ Component: ControlledExample }) }
export const Multiple = { render: () => ({ Component: MultipleExample }) }
export const ReactiveCollection = { render: () => ({ Component: ReactiveCollectionExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
