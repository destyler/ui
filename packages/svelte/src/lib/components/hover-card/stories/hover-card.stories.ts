import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import PositioningExample from '../examples/Positioning.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = { title: 'Components / Overlay / Hover Card', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const Positioning = story(PositioningExample)
export const RenderProp = story(RenderPropExample)
export const RootProvider = story(RootProviderExample)
