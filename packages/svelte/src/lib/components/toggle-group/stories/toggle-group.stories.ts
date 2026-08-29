import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import MultipleExample from '../examples/Multiple.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Data / Toggle Group',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const Multiple = story(MultipleExample)
export const RenderProp = story(RenderPropExample)
export const RootProvider = story(RootProviderExample)
