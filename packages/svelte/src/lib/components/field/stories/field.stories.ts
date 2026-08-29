import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import DisabledExample from '../examples/Disabled.svelte'
import InputExample from '../examples/Input.svelte'
import InputControlledExample from '../examples/InputControlled.svelte'
import ReactiveInvalidExample from '../examples/ReactiveInvalid.svelte'
import RequiredIndicatorExample from '../examples/RequiredIndicator.svelte'
import SelectExample from '../examples/Select.svelte'
import SelectControlledExample from '../examples/SelectControlled.svelte'
import TextareaExample from '../examples/Textarea.svelte'
import TextareaAutoresizeExample from '../examples/TextareaAutoresize.svelte'
import TextareaControlledExample from '../examples/TextareaControlled.svelte'

const meta: Meta = {
  title: 'Components / Form / Field',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Disabled = { render: () => ({ Component: DisabledExample }) }
export const Input = { render: () => ({ Component: InputExample }) }
export const InputControlled = { render: () => ({ Component: InputControlledExample }) }
export const ReactiveInvalid = { render: () => ({ Component: ReactiveInvalidExample }) }
export const RequiredIndicator = { render: () => ({ Component: RequiredIndicatorExample }) }
export const Select = { render: () => ({ Component: SelectExample }) }
export const SelectControlled = { render: () => ({ Component: SelectControlledExample }) }
export const Textarea = { render: () => ({ Component: TextareaExample }) }
export const TextareaAutoresize = { render: () => ({ Component: TextareaAutoresizeExample }) }
export const TextareaControlled = { render: () => ({ Component: TextareaControlledExample }) }
