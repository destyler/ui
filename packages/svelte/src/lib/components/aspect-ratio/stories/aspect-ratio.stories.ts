import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import PortraitExample from '../examples/Portrait.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import SquareExample from '../examples/Square.svelte'

const meta: Meta = {
  title: 'Components / Utility / Aspect Ratio',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Portrait = story(PortraitExample)
export const RootProvider = story(RootProviderExample)
export const Square = story(SquareExample)
