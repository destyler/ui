export { clipboardAnatomy } from './anatomy'
export { ClipboardContext, type ClipboardContextProps } from './components/Context'
export {
  ClipboardControl,
  type ClipboardControlBaseProps,
  type ClipboardControlProps,
} from './components/Control'
export {
  ClipboardIndicator,
  type ClipboardIndicatorBaseProps,
  type ClipboardIndicatorProps,
} from './components/Indicator'
export {
  ClipboardInput,
  type ClipboardInputBaseProps,
  type ClipboardInputProps,
} from './components/Input'
export {
  ClipboardLabel,
  type ClipboardLabelBaseProps,
  type ClipboardLabelProps,
} from './components/Label'
export {
  ClipboardRoot,
  type ClipboardRootBaseProps,
  type ClipboardRootProps,
} from './components/Root'
export {
  ClipboardRootProvider,
  type ClipboardRootProviderBaseProps,
  type ClipboardRootProviderProps,
} from './components/RootProvider'
export {
  ClipboardTrigger,
  type ClipboardTriggerBaseProps,
  type ClipboardTriggerProps,
} from './components/Trigger'
export {
  ClipboardValueText,
  type ClipboardValueTextBaseProps,
  type ClipboardValueTextProps,
} from './components/ValueText'
export { useClipboard, type UseClipboardProps, type UseClipboardReturn } from './hooks/use-clipboard'
export { useClipboardContext, type UseClipboardContext } from './hooks/use-clipboard-context'
export * as Clipboard from './namespace'

export type { CopyStatusDetails as ClipboardCopyStatusDetails } from '@destyler/clipboard'
