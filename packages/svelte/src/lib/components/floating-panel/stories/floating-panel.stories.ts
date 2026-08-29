import type { Meta, StoryObj } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import DefaultOpenExample from '../examples/DefaultOpen.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithContextExample from '../examples/WithContext.svelte'

const meta: Meta = {
  title: 'Components / Utility / Floating Panel',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const story = (Component: Component<any>): Story => ({ render: () => ({ Component }) })

export const Basic: Story = story(BasicExample)
export const Controlled: Story = story(ControlledExample)
export const DefaultOpen: Story = story(DefaultOpenExample)
export const RootProvider: Story = story(RootProviderExample)
export const WithContext: Story = story(WithContextExample)
