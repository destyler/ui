import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import DisabledTabExample from '../examples/DisabledTab.svelte'
import IndicatorExample from '../examples/Indicator.svelte'
import InitialTabExample from '../examples/InitialTab.svelte'
import LazyMountExample from '../examples/LazyMount.svelte'
import ManualExample from '../examples/Manual.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import VerticalExample from '../examples/Vertical.svelte'

const meta: Meta = { title: 'Components / Layout / Tabs', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const DisabledTab = story(DisabledTabExample)
export const Indicator = story(IndicatorExample)
export const InitialTab = story(InitialTabExample)
export const LazyMount = story(LazyMountExample)
export const Manual = story(ManualExample)
export const RootProvider = story(RootProviderExample)
export const Vertical = story(VerticalExample)
