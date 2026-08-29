import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import CloseExample from '../examples/Close.svelte'
import ContextExample from '../examples/Context.svelte'
import EventExample from '../examples/Event.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Data / Avatar',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Close = story(CloseExample)
export const Context = story(ContextExample)
export const Event = story(EventExample)
export const RootProvider = story(RootProviderExample)
