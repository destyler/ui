import type { Meta, StoryObj } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import AutofocusExample from '../examples/Autofocus.svelte'
import BasicExample from '../examples/Basic.svelte'
import InitialFocusExample from '../examples/InitialFocus.svelte'

const meta: Meta = {
  title: 'Providers / Behavior / Focus Trap',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const story = (Component: Component<any>): Story => ({ render: () => ({ Component }) })

export const Autofocus: Story = story(AutofocusExample)
export const Basic: Story = story(BasicExample)
export const InitialFocus: Story = story(InitialFocusExample)
