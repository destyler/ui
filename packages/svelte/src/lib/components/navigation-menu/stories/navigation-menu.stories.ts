import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import CustomDelayExample from '../examples/CustomDelay.svelte'
import DisableClickExample from '../examples/DisableClick.svelte'
import DisableHoverExample from '../examples/DisableHover.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import VerticalExample from '../examples/Vertical.svelte'

const meta: Meta = {
  title: 'Components / Navigation / Navigation Menu',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const CustomDelay = story(CustomDelayExample)
export const DisableClick = story(DisableClickExample)
export const DisableHover = story(DisableHoverExample)
export const RootProvider = story(RootProviderExample)
export const Vertical = story(VerticalExample)
