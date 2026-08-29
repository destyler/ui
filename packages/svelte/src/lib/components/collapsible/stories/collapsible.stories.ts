import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import InitialOpenExample from '../examples/InitialOpen.svelte'
import LazyMountExample from '../examples/LazyMount.svelte'
import LazyMountAndUnmountOnExitExample from '../examples/LazyMountAndUnmountOnExit.svelte'
import OnExitCompleteExample from '../examples/OnExitComplete.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import UnmountOnExitExample from '../examples/UnmountOnExit.svelte'

const meta: Meta = { title: 'Components / Layout / Collapsible', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const InitialOpen = story(InitialOpenExample)
export const LazyMount = story(LazyMountExample)
export const LazyMountAndUnmountOnExit = story(LazyMountAndUnmountOnExitExample)
export const OnExitComplete = story(OnExitCompleteExample)
export const RootProvider = story(RootProviderExample)
export const UnmountOnExit = story(UnmountOnExitExample)
