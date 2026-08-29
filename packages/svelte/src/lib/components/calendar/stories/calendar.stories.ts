import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import RangeExample from '../examples/Range.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import StandaloneExample from '../examples/Standalone.svelte'

const meta: Meta = {
  title: 'Components / Data / Calendar',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const Range = story(RangeExample)
export const RootProvider = story(RootProviderExample)
export const Standalone = story(StandaloneExample)
