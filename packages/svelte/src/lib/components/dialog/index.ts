export { dialogAnatomy } from './anatomy'
export {
  default as DialogBackdrop,
  type DialogBackdropBaseProps,
  type DialogBackdropProps,
} from './components/Backdrop.svelte'
export {
  default as DialogCloseTrigger,
  type DialogCloseTriggerBaseProps,
  type DialogCloseTriggerProps,
} from './components/CloseTrigger.svelte'
export { default as DialogContent, type DialogContentBaseProps, type DialogContentProps } from './components/Content.svelte'
export { default as DialogContext, type DialogContextProps } from './components/Context.svelte'
export {
  default as DialogDescription,
  type DialogDescriptionBaseProps,
  type DialogDescriptionProps,
} from './components/Description.svelte'
export {
  default as DialogPositioner,
  type DialogPositionerBaseProps,
  type DialogPositionerProps,
} from './components/Positioner.svelte'
export { default as DialogRoot, type DialogRootBaseProps, type DialogRootProps } from './components/Root.svelte'
export {
  default as DialogRootProvider,
  type DialogRootProviderBaseProps,
  type DialogRootProviderProps,
} from './components/RootProvider.svelte'
export { default as DialogTitle, type DialogTitleBaseProps, type DialogTitleProps } from './components/Title.svelte'
export { default as DialogTrigger, type DialogTriggerBaseProps, type DialogTriggerProps } from './components/Trigger.svelte'
export { useDialogContext } from './hooks/use-dialog-context'
export type { UseDialogContext } from './hooks/use-dialog-context'
export { useDialog } from './hooks/use-dialog.svelte'
export type { UseDialogProps, UseDialogReturn } from './hooks/use-dialog.svelte'
export * as Dialog from './namespace'

export type { OpenChangeDetails as DialogOpenChangeDetails } from '@destyler/dialog'
