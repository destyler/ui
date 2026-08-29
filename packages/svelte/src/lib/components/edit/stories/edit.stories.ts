import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import CustomControlsExample from '../examples/CustomControls.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Utility / Edit',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const CustomControls = story(CustomControlsExample)
export const RootProvider = story(RootProviderExample)
export const WithField = story(WithFieldExample)
