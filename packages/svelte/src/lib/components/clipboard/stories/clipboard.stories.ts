import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import RenderFnExample from '../examples/RenderFn.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Utility / Clipboard',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const RenderFn = story(RenderFnExample)
export const RootProvider = story(RootProviderExample)
