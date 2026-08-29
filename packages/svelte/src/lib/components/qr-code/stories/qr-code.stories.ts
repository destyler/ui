import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import ErrorCorrectionExample from '../examples/ErrorCorrection.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithOverlayExample from '../examples/WithOverlay.svelte'

const meta: Meta = {
  title: 'Components / Data / QR Code',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const ErrorCorrection = story(ErrorCorrectionExample)
export const RootProvider = story(RootProviderExample)
export const WithOverlay = story(WithOverlayExample)
