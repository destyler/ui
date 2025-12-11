export { editAnatomy } from './anatomy'
export {
  default as EditArea,
  type EditAreaProps,
} from './components/Area.vue'
export {
  default as EditCancelTrigger,
  type EditCancelTriggerProps,
} from './components/CancelTrigger.vue'
export {
  default as EditContext,
  type EditContextProps,
} from './components/Context.vue'
export {
  default as EditControl,
  type EditControlProps,
} from './components/Control.vue'
export {
  default as EditEditTrigger,
  type EditEditTriggerProps,
} from './components/EditTrigger.vue'
export {
  default as EditInput,
  type EditInputProps,
} from './components/Input.vue'
export {
  default as EditLabel,
  type EditLabelProps,
} from './components/Label.vue'
export {
  default as EditPreview,
  type EditPreviewProps,
} from './components/Preview.vue'
export {
  default as EditRoot,
  type EditRootEmits,
  type EditRootProps,
} from './components/Root.vue'
export {
  default as EditRootProvider,
  type EditRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as EditSubmitTrigger,
  type EditSubmitTriggerProps,
} from './components/SubmitTrigger.vue'

export { useEdit, type UseEditProps, type UseEditReturn } from './composables/use-edit'
export { useEditContext, type UseEditContext } from './composables/use-edit-context'
export type {
  EditChangeDetails,
  ValueChangeDetails as EditValueChangeDetails,
} from '@destyler/edit'
