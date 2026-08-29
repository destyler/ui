import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import CustomizedExample from '../examples/Customized.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Navigation / Pagination',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Customized = story(CustomizedExample)
export const RootProvider = story(RootProviderExample)
