import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import CenterOriginExample from '../examples/CenterOrigin.svelte'
import DraggingIndicatorExample from '../examples/DraggingIndicator.svelte'
import InitialValueExample from '../examples/InitialValue.svelte'
import MinMaxExample from '../examples/MinMax.svelte'
import OnEventExample from '../examples/OnEvent.svelte'
import RangeExample from '../examples/Range.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import StepExample from '../examples/Step.svelte'
import VerticalExample from '../examples/Vertical.svelte'
import WithMarksExample from '../examples/WithMarks.svelte'

const meta: Meta = {
  title: 'Components / Form / Slider',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const CenterOrigin = { render: () => ({ Component: CenterOriginExample }) }
export const DraggingIndicator = { render: () => ({ Component: DraggingIndicatorExample }) }
export const InitialValue = { render: () => ({ Component: InitialValueExample }) }
export const MinMax = { render: () => ({ Component: MinMaxExample }) }
export const OnEvent = { render: () => ({ Component: OnEventExample }) }
export const Range = { render: () => ({ Component: RangeExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const Step = { render: () => ({ Component: StepExample }) }
export const Vertical = { render: () => ({ Component: VerticalExample }) }
export const WithMarks = { render: () => ({ Component: WithMarksExample }) }
