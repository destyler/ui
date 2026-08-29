import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import AutoPlayExample from '../examples/AutoPlay.svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Data / Carousel',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const AutoPlay = story(AutoPlayExample)
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const RootProvider = story(RootProviderExample)
