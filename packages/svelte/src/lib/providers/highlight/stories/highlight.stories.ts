import type { Meta, StoryObj } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import IgnoreCaseExample from '../examples/IgnoreCase.svelte'
import MatchAllExample from '../examples/MatchAll.svelte'
import MultipleExample from '../examples/Multiple.svelte'
import WithInputExample from '../examples/WithInput.svelte'

const meta: Meta = {
  title: 'Providers / Content / Highlight',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const story = (Component: Component<any>): Story => ({ render: () => ({ Component }) })

export const Basic: Story = story(BasicExample)
export const IgnoreCase: Story = story(IgnoreCaseExample)
export const MatchAll: Story = story(MatchAllExample)
export const Multiple: Story = story(MultipleExample)
export const WithInput: Story = story(WithInputExample)
