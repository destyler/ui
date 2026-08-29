import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import ActionExample from '../examples/Action.svelte'
import BasicExample from '../examples/Basic.svelte'
import ToastActionExample from '../examples/ToastAction.svelte'
import ToastPlacementExample from '../examples/ToastPlacement.svelte'
import ToastPromiseExample from '../examples/ToastPromise.svelte'
import ToastTypesExample from '../examples/ToastTypes.svelte'
import ToastUpdateExample from '../examples/ToastUpdate.svelte'
import UpdateExample from '../examples/Update.svelte'

const meta: Meta = { title: 'Components / Overlay / Toast', parameters: { layout: 'fullscreen' } }
const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export default meta
export const Action = story(ActionExample)
export const Basic = story(BasicExample)
export const ToastAction = story(ToastActionExample)
export const ToastPlacement = story(ToastPlacementExample)
export const ToastPromise = story(ToastPromiseExample)
export const ToastTypes = story(ToastTypesExample)
export const ToastUpdate = story(ToastUpdateExample)
export const Update = story(UpdateExample)
