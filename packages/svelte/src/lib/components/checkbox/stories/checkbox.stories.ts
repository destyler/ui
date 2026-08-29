import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import GroupExample from '../examples/Group.svelte'
import GroupControlledExample from '../examples/GroupControlled.svelte'
import GroupWithFormExample from '../examples/GroupWithForm.svelte'
import GroupWithInvalidExample from '../examples/GroupWithInvalid.svelte'
import GroupWithSelectAllExample from '../examples/GroupWithSelectAll.svelte'
import IndeterminateExample from '../examples/Indeterminate.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / Checkbox',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Controlled = { render: () => ({ Component: ControlledExample }) }
export const Group = { render: () => ({ Component: GroupExample }) }
export const GroupControlled = { render: () => ({ Component: GroupControlledExample }) }
export const GroupWithForm = { render: () => ({ Component: GroupWithFormExample }) }
export const GroupWithInvalid = { render: () => ({ Component: GroupWithInvalidExample }) }
export const GroupWithSelectAll = { render: () => ({ Component: GroupWithSelectAllExample }) }
export const Indeterminate = { render: () => ({ Component: IndeterminateExample }) }
export const RenderProp = { render: () => ({ Component: RenderPropExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
