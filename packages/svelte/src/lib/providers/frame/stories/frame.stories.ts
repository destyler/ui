import type { Meta, StoryObj } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ScriptExample from '../examples/Script.svelte'
import SrcDocExample from '../examples/SrcDoc.svelte'

const meta: Meta = {
  title: 'Providers / Runtime / Frame',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const story = (Component: Component<any>): Story => ({ render: () => ({ Component }) })

export const Basic: Story = story(BasicExample)
export const Script: Story = story(ScriptExample)
export const SrcDoc: Story = story(SrcDocExample)
