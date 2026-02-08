import type { UseOtpInputProps } from './use-otp-input'
import { createSplitProps } from '~/utils/create-split-props'

export function splitOtpInputProps<T extends UseOtpInputProps>(props: T) {
  return createSplitProps<UseOtpInputProps>()(props, [
    'autoFocus',
    'blurOnComplete',
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'mask',
    'name',
    'onValueChange',
    'onValueComplete',
    'onValueInvalid',
    'otp',
    'pattern',
    'placeholder',
    'readOnly',
    'required',
    'selectOnFocus',
    'translations',
    'type',
    'value',
  ])
}
