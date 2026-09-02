export { otpInputAnatomy } from './anatomy'
export { OtpInputContext, type OtpInputContextProps } from './components/Context'
export {
  OtpInputControl,
  type OtpInputControlBaseProps,
  type OtpInputControlProps,
} from './components/Control'
export {
  OtpInputHiddenInput,
  type OtpInputHiddenInputBaseProps,
  type OtpInputHiddenInputProps,
} from './components/HiddenInput'
export {
  OtpInputInput,
  type OtpInputInputBaseProps,
  type OtpInputInputProps,
} from './components/Input'
export {
  OtpInputLabel,
  type OtpInputLabelBaseProps,
  type OtpInputLabelProps,
} from './components/Label'
export { OtpInputRoot, type OtpInputRootBaseProps, type OtpInputRootProps } from './components/Root'
export {
  OtpInputRootProvider,
  type OtpInputRootProviderBaseProps,
  type OtpInputRootProviderProps,
} from './components/RootProvider'
export { useOtpInput, type UseOtpInputProps, type UseOtpInputReturn } from './hooks/use-otp-input'
export { useOtpInputContext, type UseOtpInputContext } from './hooks/use-otp-input-context'
export * as OtpInput from './namespace'

export type {
  ValueChangeDetails as OtpInputValueChangeDetails,
  ValueInvalidDetails as OtpInputValueInvalidDetails,
} from '@destyler/otp-input'
