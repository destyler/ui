export { toastAnatomy } from './anatomy'

export {
  default as Toaster,
  type ToasterBaseProps,
  type ToasterProps,
} from './components/Toaster.vue'
export { createToaster, type CreateToasterProps, type CreateToasterReturn } from './composables/create-toaster'
export { useToastContext, type UseToastContext } from './composables/use-toast-context'

export * as Toast from './namespace'
