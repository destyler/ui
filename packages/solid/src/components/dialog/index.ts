export { dialogAnatomy } from './anatomy'
export {
  DialogBackdrop,
  type DialogBackdropBaseProps,
  type DialogBackdropProps,
} from './components/Backdrop'
export {
  DialogCloseTrigger,
  type DialogCloseTriggerBaseProps,
  type DialogCloseTriggerProps,
} from './components/CloseTrigger'
export {
  DialogContent,
  type DialogContentBaseProps,
  type DialogContentProps,
} from './components/Content'
export { DialogContext, type DialogContextProps } from './components/Context'
export {
  DialogDescription,
  type DialogDescriptionBaseProps,
  type DialogDescriptionProps,
} from './components/Description'
export {
  DialogPositioner,
  type DialogPositionerBaseProps,
  type DialogPositionerProps,
} from './components/Positioner'
export { DialogRoot, type DialogRootBaseProps, type DialogRootProps } from './components/Root'
export {
  DialogRootProvider,
  type DialogRootProviderBaseProps,
  type DialogRootProviderProps,
} from './components/RootProvider'
export { DialogTitle, type DialogTitleBaseProps, type DialogTitleProps } from './components/Title'
export {
  DialogTrigger,
  type DialogTriggerBaseProps,
  type DialogTriggerProps,
} from './components/Trigger'
export { useDialog, type UseDialogProps, type UseDialogReturn } from './hooks/use-dialog'
export { useDialogContext, type UseDialogContext } from './hooks/use-dialog-context'
export * as Dialog from './namespace'

export type { OpenChangeDetails as DialogOpenChangeDetails } from '@destyler/dialog'
