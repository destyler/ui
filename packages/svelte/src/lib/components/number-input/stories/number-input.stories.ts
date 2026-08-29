import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import FormattedExample from '../examples/Formatted.svelte'
import FormUsageExample from '../examples/FormUsage.svelte'
import FractionDigitsExample from '../examples/FractionDigits.svelte'
import MinMaxExample from '../examples/MinMax.svelte'
import MouseWheelExample from '../examples/MouseWheel.svelte'
import NoClampExample from '../examples/NoClamp.svelte'
import RenderFnExample from '../examples/RenderFn.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import ScrubberExample from '../examples/Scrubber.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / Number Input',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Formatted = { render: () => ({ Component: FormattedExample }) }
export const FormUsage = { render: () => ({ Component: FormUsageExample }) }
export const FractionDigits = { render: () => ({ Component: FractionDigitsExample }) }
export const MinMax = { render: () => ({ Component: MinMaxExample }) }
export const MouseWheel = { render: () => ({ Component: MouseWheelExample }) }
export const NoClamp = { render: () => ({ Component: NoClampExample }) }
export const RenderFn = { render: () => ({ Component: RenderFnExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const Scrubber = { render: () => ({ Component: ScrubberExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
