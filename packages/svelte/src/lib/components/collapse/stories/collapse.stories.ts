import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import CollapsibleExample from '../examples/Collapsible.svelte'
import ContextFocusedValueExample from '../examples/ContextFocusedValue.svelte'
import ContextGetItemStateExample from '../examples/ContextGetItemState.svelte'
import ContextSetValueExample from '../examples/ContextSetValue.svelte'
import ContextValueExample from '../examples/ContextValue.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import DisabledExample from '../examples/Disabled.svelte'
import HorizontalExample from '../examples/Horizontal.svelte'
import MultipleExample from '../examples/Multiple.svelte'
import RenderPropExample from '../examples/RenderProp.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'
import VerticalExample from '../examples/Vertical.svelte'

const meta: Meta = { title: 'Components / Layout / Collapse', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Basic = story(BasicExample)
export const Collapsible = story(CollapsibleExample)
export const ContextFocusedValue = story(ContextFocusedValueExample)
export const ContextGetItemState = story(ContextGetItemStateExample)
export const ContextSetValue = story(ContextSetValueExample)
export const ContextValue = story(ContextValueExample)
export const Controlled = story(ControlledExample)
export const Disabled = story(DisabledExample)
export const Horizontal = story(HorizontalExample)
export const Multiple = story(MultipleExample)
export const RenderProp = story(RenderPropExample)
export const RootProvider = story(RootProviderExample)
export const Vertical = story(VerticalExample)
