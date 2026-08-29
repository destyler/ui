import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import ArrowExample from '../examples/Arrow.svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import PositioningExample from '../examples/Positioning.svelte'
import RenderFnExample from '../examples/RenderFn.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import TimingsExample from '../examples/Timings.svelte'

const meta: Meta = { title: 'Components / Overlay / Tooltip', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Arrow = story(ArrowExample)
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const Positioning = story(PositioningExample)
export const RenderFn = story(RenderFnExample)
export const RootProvider = story(RootProviderExample)
export const Timings = story(TimingsExample)
