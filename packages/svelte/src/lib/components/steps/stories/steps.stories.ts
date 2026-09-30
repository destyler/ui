import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import InitialStepExample from '../examples/InitialStep.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = { title: 'Components / Layout / Steps', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Controlled = story(ControlledExample)
export const InitialStep = story(InitialStepExample)
export const RootProvider = story(RootProviderExample)
