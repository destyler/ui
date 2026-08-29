import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import BlurredExample from '../examples/Blurred.svelte'
import CustomizedExample from '../examples/Customized.svelte'
import InitialValueExample from '../examples/InitialValue.svelte'
import OtpModeExample from '../examples/OtpMode.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'
import WithMaskExample from '../examples/WithMask.svelte'

const meta: Meta = {
  title: 'Components / Form / OTP Input',
  parameters: { layout: 'fullscreen' },
}

export default meta

export const Basic = { render: () => ({ Component: BasicExample }) }
export const Blurred = { render: () => ({ Component: BlurredExample }) }
export const Customized = { render: () => ({ Component: CustomizedExample }) }
export const InitialValue = { render: () => ({ Component: InitialValueExample }) }
export const OtpMode = { render: () => ({ Component: OtpModeExample }) }
export const RootProvider = { render: () => ({ Component: RootProviderExample }) }
export const WithField = { render: () => ({ Component: WithFieldExample }) }
export const WithMask = { render: () => ({ Component: WithMaskExample }) }
