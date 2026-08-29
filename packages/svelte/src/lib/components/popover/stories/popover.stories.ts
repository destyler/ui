import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import ArrowExample from '../examples/Arrow.svelte'
import AsChildExample from '../examples/AsChild.svelte'
import BasicExample from '../examples/Basic.svelte'
import CloseBehaviorExample from '../examples/CloseBehavior.svelte'
import ControlledExample from '../examples/Controlled.svelte'
import ModalExample from '../examples/Modal.svelte'
import OnOpenChangeExample from '../examples/OnOpenChange.svelte'
import PortalledExample from '../examples/Portalled.svelte'
import PositioningExample from '../examples/Positioning.svelte'
import RenderFnExample from '../examples/RenderFn.svelte'
import RootProviderExample from '../examples/RootProvider.svelte'

const meta: Meta = { title: 'Components / Overlay / Popover', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Arrow = story(ArrowExample)
export const AsChild = story(AsChildExample)
export const Basic = story(BasicExample)
export const CloseBehavior = story(CloseBehaviorExample)
export const Controlled = story(ControlledExample)
export const Modal = story(ModalExample)
export const OnOpenChange = story(OnOpenChangeExample)
export const Portalled = story(PortalledExample)
export const Positioning = story(PositioningExample)
export const RenderFn = story(RenderFnExample)
export const RootProvider = story(RootProviderExample)
