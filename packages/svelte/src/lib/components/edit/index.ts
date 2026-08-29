export { editAnatomy } from './anatomy'
export { default as EditArea, type EditAreaBaseProps, type EditAreaProps } from './components/Area.svelte'
export {
  default as EditCancelTrigger,
  type EditCancelTriggerBaseProps,
  type EditCancelTriggerProps,
} from './components/CancelTrigger.svelte'
export { default as EditContext, type EditContextProps } from './components/Context.svelte'
export {
  default as EditControl,
  type EditControlBaseProps,
  type EditControlProps,
} from './components/Control.svelte'
export {
  default as EditEditTrigger,
  type EditEditTriggerBaseProps,
  type EditEditTriggerProps,
} from './components/EditTrigger.svelte'
export { default as EditInput, type EditInputBaseProps, type EditInputProps } from './components/Input.svelte'
export { default as EditLabel, type EditLabelBaseProps, type EditLabelProps } from './components/Label.svelte'
export {
  default as EditPreview,
  type EditPreviewBaseProps,
  type EditPreviewProps,
} from './components/Preview.svelte'
export { default as EditRoot, type EditRootBaseProps, type EditRootProps } from './components/Root.svelte'
export {
  default as EditRootProvider,
  type EditRootProviderBaseProps,
  type EditRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as EditSubmitTrigger,
  type EditSubmitTriggerBaseProps,
  type EditSubmitTriggerProps,
} from './components/SubmitTrigger.svelte'
export { useEditContext } from './hooks/use-edit-context'
export type { UseEditContext } from './hooks/use-edit-context'
export { useEdit } from './hooks/use-edit.svelte'
export type { UseEditProps, UseEditReturn } from './hooks/use-edit.svelte'
export * as Edit from './namespace'

export type { ValueChangeDetails as EditValueChangeDetails } from '@destyler/edit'
