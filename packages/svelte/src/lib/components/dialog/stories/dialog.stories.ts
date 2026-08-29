import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import LazyMountExample from '../examples/LazyMount.svelte'
import RenderFnExample from '../examples/RenderFn.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = { title: 'Components / Overlay / Dialog', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const LazyMount = story(LazyMountExample)
export const RenderFn = story(RenderFnExample)
export const RootProvider = story(RootProviderExample)
