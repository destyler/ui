import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import AdvancedExample from '../examples/Advanced.svelte'
import BasicExample from '../examples/Basic.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Utility / Combobox',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Advanced = story(AdvancedExample)
export const Basic = story(BasicExample)
export const RootProvider = story(RootProviderExample)
export const WithField = story(WithFieldExample)
