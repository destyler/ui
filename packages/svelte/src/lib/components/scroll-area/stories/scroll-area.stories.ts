import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import VirtualScrollExample from '../examples/VirtualScroll.svelte'

const meta: Meta = { title: 'Components / Layout / Scroll Area', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const RootProvider = story(RootProviderExample)
export const VirtualScroll = story(VirtualScrollExample)
