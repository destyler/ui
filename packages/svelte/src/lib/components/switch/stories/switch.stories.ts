import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import DisabledExample from '../examples/Disabled.svelte'
import InitialValueExample from '../examples/InitialValue.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / Switch',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Controlled = { render: () => ({ Component: ControlledExample }) }
export const Disabled = { render: () => ({ Component: DisabledExample }) }
export const InitialValue = { render: () => ({ Component: InitialValueExample }) }
export const RenderProp = { render: () => ({ Component: RenderPropExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
