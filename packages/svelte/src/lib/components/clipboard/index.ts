export { clipboardAnatomy } from './anatomy'
export { default as ClipboardContext, type ClipboardContextProps } from './components/Context.svelte'
export {
  default as ClipboardControl,
  type ClipboardControlBaseProps,
  type ClipboardControlProps,
} from './components/Control.svelte'
export {
  default as ClipboardIndicator,
  type ClipboardIndicatorBaseProps,
  type ClipboardIndicatorProps,
} from './components/Indicator.svelte'
export {
  default as ClipboardInput,
  type ClipboardInputBaseProps,
  type ClipboardInputProps,
} from './components/Input.svelte'
export {
  default as ClipboardLabel,
  type ClipboardLabelBaseProps,
  type ClipboardLabelProps,
} from './components/Label.svelte'
export { default as ClipboardRoot, type ClipboardRootBaseProps, type ClipboardRootProps } from './components/Root.svelte'
export {
  default as ClipboardRootProvider,
  type ClipboardRootProviderBaseProps,
  type ClipboardRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as ClipboardTrigger,
  type ClipboardTriggerBaseProps,
  type ClipboardTriggerProps,
} from './components/Trigger.svelte'
export {
  default as ClipboardValueText,
  type ClipboardValueTextBaseProps,
  type ClipboardValueTextProps,
} from './components/ValueText.svelte'
export { ClipboardProvider, useClipboardContext } from './hooks/use-clipboard-context'
export type { UseClipboardContext } from './hooks/use-clipboard-context'
export { useClipboard } from './hooks/use-clipboard.svelte'
export type { UseClipboardProps, UseClipboardReturn } from './hooks/use-clipboard.svelte'
export * as Clipboard from './namespace'

export type { CopyStatusDetails as ClipboardCopyStatusDetails } from '@destyler/clipboard'
