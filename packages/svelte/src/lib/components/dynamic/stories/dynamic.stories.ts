import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import BlurBehaviorExample from '../examples/BlurBehavior.svelte'
import DisabledEditingExample from '../examples/DisabledEditing.svelte'
import InitialValueExample from '../examples/InitialValue.svelte'
import MaxWithOverflowExample from '../examples/MaxWithOverflow.svelte'
import OnEventExample from '../examples/OnEvent.svelte'
import PasteBehaviorExample from '../examples/PasteBehavior.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import ValidatedExample from '../examples/Validated.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Utility / Dynamic',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const BlurBehavior = story(BlurBehaviorExample)
export const DisabledEditing = story(DisabledEditingExample)
export const InitialValue = story(InitialValueExample)
export const MaxWithOverflow = story(MaxWithOverflowExample)
export const OnEvent = story(OnEventExample)
export const PasteBehavior = story(PasteBehaviorExample)
export const RootProvider = story(RootProviderExample)
export const Validated = story(ValidatedExample)
export const WithField = story(WithFieldExample)
