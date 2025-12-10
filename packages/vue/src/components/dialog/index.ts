export { dialogAnatomy } from './anatomy'
export {
  default as DialogBackdrop,
  type DialogBackdropProps,
} from './components/Backdrop.vue'
export {
  default as DialogCloseTrigger,
  type DialogCloseTriggerProps,
} from './components/CloseTrigger.vue'
export {
  default as DialogContent,
  type DialogContentProps,
} from './components/Content.vue'
export {
  default as DialogContext,
  type DialogContextProps,
} from './components/Context.vue'
export {
  default as DialogDescription,
  type DialogDescriptionProps,
} from './components/Description.vue'
export {
  default as DialogPositioner,
  type DialogPositionerProps,
} from './components/Positioner.vue'
export {
  default as DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
} from './components/Root.vue'
export {
  default as DialogRootProvider,
  type DialogRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as DialogTitle,
  type DialogTitleProps,
} from './components/Title.vue'
export {
  default as DialogTrigger,
  type DialogTriggerProps,
} from './components/Trigger.vue'
export { useDialog, type UseDialogProps, type UseDialogReturn } from './composables/use-dialog'
export { useDialogContext, type UseDialogContext } from './composables/use-dialog-context'
export * as Dialog from './namespace'

export type { OpenChangeDetails as DialogOpenChangeDetails } from '@destyler/dialog'
