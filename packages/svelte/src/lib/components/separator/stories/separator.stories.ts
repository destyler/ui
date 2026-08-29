import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import VerticalExample from '../examples/Vertical.svelte'

const meta: Meta = { title: 'Components / Layout / Separator', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const RootProvider = story(RootProviderExample)
export const Vertical = story(VerticalExample)
