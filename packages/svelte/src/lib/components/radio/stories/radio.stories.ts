import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import DisabledExample from '../examples/Disabled.svelte'
import InitialValueExample from '../examples/InitialValue.svelte'
import OnEventExample from '../examples/OnEvent.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Form / Radio',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Disabled = { render: () => ({ Component: DisabledExample }) }
export const InitialValue = { render: () => ({ Component: InitialValueExample }) }
export const OnEvent = { render: () => ({ Component: OnEventExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
