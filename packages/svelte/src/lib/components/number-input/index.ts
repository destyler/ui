export { numberInputAnatomy } from './anatomy'
export { default as NumberInputContext, type NumberInputContextProps } from './components/Context.svelte'
export {
  default as NumberInputControl,
  type NumberInputControlBaseProps,
  type NumberInputControlProps,
} from './components/Control.svelte'
export {
  default as NumberInputDecrementTrigger,
  type NumberInputDecrementTriggerBaseProps,
  type NumberInputDecrementTriggerProps,
} from './components/DecrementTrigger.svelte'
export {
  default as NumberInputIncrementTrigger,
  type NumberInputIncrementTriggerBaseProps,
  type NumberInputIncrementTriggerProps,
} from './components/IncrementTrigger.svelte'
export {
  default as NumberInputInput,
  type NumberInputInputBaseProps,
  type NumberInputInputProps,
} from './components/Input.svelte'
export {
  default as NumberInputLabel,
  type NumberInputLabelBaseProps,
  type NumberInputLabelProps,
} from './components/Label.svelte'
export {
  default as NumberInputRoot,
  type NumberInputRootBaseProps,
  type NumberInputRootProps,
} from './components/Root.svelte'
export {
  default as NumberInputRootProvider,
  type NumberInputRootProviderBaseProps,
  type NumberInputRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as NumberInputScrubber,
  type NumberInputScrubberBaseProps,
  type NumberInputScrubberProps,
} from './components/Scrubber.svelte'
export {
  default as NumberInputValueText,
  type NumberInputValueTextBaseProps,
  type NumberInputValueTextProps,
} from './components/ValueText.svelte'
export { NumberInputProvider, useNumberInputContext } from './hooks/use-number-input-context'
export type { UseNumberInputContext } from './hooks/use-number-input-context'
export { useNumberInput } from './hooks/use-number-input.svelte'
export type { UseNumberInputProps, UseNumberInputReturn } from './hooks/use-number-input.svelte'
export * as NumberInput from './namespace'

export type {
  FocusChangeDetails as NumberInputFocusChangeDetails,
  ValueChangeDetails as NumberInputValueChangeDetails,
  ValueInvalidDetails as NumberInputValueInvalidDetails,
} from '@destyler/number-input'
