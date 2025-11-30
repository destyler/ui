export { clipboardAnatomy } from './anatomy'

export {
  default as ClipboardContext,
  type ClipboardContextProps,
} from './components/Context.vue'

export {
  default as ClipboardControl,
  type ClipboardControlProps,
} from './components/Control.vue'
export {
  default as ClipboardIndicator,
  type ClipboardIndicatorProps,
} from './components/Indicator.vue'
export {
  default as ClipboardInput,
  type ClipboardInputProps,
} from './components/Input.vue'
export {
  default as ClipboardLabel,
  type ClipboardLabelProps,
} from './components/Label.vue'
export {
  default as ClipboardRoot,
  type ClipboardRootEmits,
  type ClipboardRootProps,
} from './components/Root.vue'
export {
  default as ClipboardRootProvider,
  type ClipboardRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as ClipboardTrigger,
  type ClipboardTriggerProps,
} from './components/Trigger.vue'
export {
  default as ClipboardValueText,
  type ClipboardValueTextProps,
} from './components/ValueText.vue'
export { useClipboard, type UseClipboardProps, type UseClipboardReturn } from './composables/use-clipboard'
export { useClipboardContext, type UseClipboardContext } from './composables/use-clipboard-context'

export * as Clipboard from './namespace'
export type { CopyStatusDetails as ClipboardCopyStatusDetails } from '@destyler/clipboard'
