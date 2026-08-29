import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import CheckboxExample from '../examples/Checkbox.svelte'
import ContextExample from '../examples/Context.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import GroupExample from '../examples/Group.svelte'
import NestedExample from '../examples/Nested.svelte'
import RadioGroupExample from '../examples/RadioGroup.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import SeparatorExample from '../examples/Separator.svelte'

const meta: Meta = {
  title: 'Components / Navigation / Menu',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)
export const Checkbox = story(CheckboxExample)
export const Context = story(ContextExample)
export const Controlled = story(ControlledExample)
export const Group = story(GroupExample)
export const Nested = story(NestedExample)
export const RadioGroup = story(RadioGroupExample)
export const RenderProp = story(RenderPropExample)
export const RootProvider = story(RootProviderExample)
export const Separator = story(SeparatorExample)
