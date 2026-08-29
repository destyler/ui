import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import Basic from '../examples/Basic.svelte'
import Context from '../examples/Context.svelte'
import RootProvider from '../examples/RootProvider.svelte'

const meta: Meta = {
  title: 'Components / Navigation / Breadcrumbs',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const BasicExample = story(Basic)
export const RootProviderExample = story(RootProvider)
export const ContextExample = story(Context)
