import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import LazyMountExample from '../examples/LazyMount.svelte'
import LazyMountAndUnmountOnExitExample from '../examples/LazyMountAndUnmountOnExit.svelte'
import UnmountOnExitExample from '../examples/UnmountOnExit.svelte'

const meta: Meta = {
  title: 'Components / Utility / Presence',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const LazyMount = story(LazyMountExample)
export const LazyMountAndUnmountOnExit = story(LazyMountAndUnmountOnExitExample)
export const UnmountOnExit = story(UnmountOnExitExample)
