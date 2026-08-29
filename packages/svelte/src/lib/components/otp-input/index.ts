export { otpInputAnatomy } from './anatomy'
export { default as OtpInputContext, type OtpInputContextProps } from './components/Context.svelte'
export {
  default as OtpInputControl,
  type OtpInputControlBaseProps,
  type OtpInputControlProps,
} from './components/Control.svelte'
export {
  default as OtpInputHiddenInput,
  type OtpInputHiddenInputBaseProps,
  type OtpInputHiddenInputProps,
} from './components/HiddenInput.svelte'
export {
  default as OtpInputInput,
  type OtpInputInputBaseProps,
  type OtpInputInputProps,
} from './components/Input.svelte'
export {
  default as OtpInputLabel,
  type OtpInputLabelBaseProps,
  type OtpInputLabelProps,
} from './components/Label.svelte'
export { default as OtpInputRoot, type OtpInputRootBaseProps, type OtpInputRootProps } from './components/Root.svelte'
export {
  default as OtpInputRootProvider,
  type OtpInputRootProviderBaseProps,
  type OtpInputRootProviderProps,
} from './components/RootProvider.svelte'
export { useOtpInputContext, type UseOtpInputContext } from './hooks/use-otp-input-context'
export { useOtpInput, type UseOtpInputProps, type UseOtpInputReturn } from './hooks/use-otp-input.svelte'
export * as OtpInput from './namespace'

export type {
  ValueChangeDetails as OtpInputValueChangeDetails,
  ValueInvalidDetails as OtpInputValueInvalidDetails,
} from '@destyler/otp-input'
