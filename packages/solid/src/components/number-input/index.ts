export { numberInputAnatomy } from './anatomy'
export { NumberInputContext, type NumberInputContextProps } from './components/Context'
export {
  NumberInputControl,
  type NumberInputControlBaseProps,
  type NumberInputControlProps,
} from './components/Control'
export {
  NumberInputDecrementTrigger,
  type NumberInputDecrementTriggerBaseProps,
  type NumberInputDecrementTriggerProps,
} from './components/DecrementTrigger'
export {
  NumberInputIncrementTrigger,
  type NumberInputIncrementTriggerBaseProps,
  type NumberInputIncrementTriggerProps,
} from './components/IncrementTrigger'
export {
  NumberInputInput,
  type NumberInputInputBaseProps,
  type NumberInputInputProps,
} from './components/Input'
export {
  NumberInputLabel,
  type NumberInputLabelBaseProps,
  type NumberInputLabelProps,
} from './components/Label'
export {
  NumberInputRoot,
  type NumberInputRootBaseProps,
  type NumberInputRootProps,
} from './components/Root'
export {
  NumberInputRootProvider,
  type NumberInputRootProviderBaseProps,
  type NumberInputRootProviderProps,
} from './components/RootProvider'
export {
  NumberInputScrubber,
  type NumberInputScrubberBaseProps,
  type NumberInputScrubberProps,
} from './components/Scrubber'
export {
  NumberInputValueText,
  type NumberInputValueTextBaseProps,
  type NumberInputValueTextProps,
} from './components/ValueText'
export {
  useNumberInput,
  type UseNumberInputProps,
  type UseNumberInputReturn,
} from './hooks/use-number-input'
export { useNumberInputContext, type UseNumberInputContext } from './hooks/use-number-input-context'
export * as NumberInput from './namespace'

export type {
  FocusChangeDetails as NumberInputFocusChangeDetails,
  ValueChangeDetails as NumberInputValueChangeDetails,
  ValueInvalidDetails as NumberInputValueInvalidDetails,
} from '@destyler/number-input'
