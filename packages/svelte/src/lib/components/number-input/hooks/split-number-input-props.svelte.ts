import type { Optional } from '$lib/types'
import type { UseNumberInputProps } from './use-number-input.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type NumberInputRootMachineProps = Optional<UseNumberInputProps, 'id'>

const splitFn = createSplitProps<NumberInputRootMachineProps>()

export function splitNumberInputProps<T extends NumberInputRootMachineProps>(props: T) {
  return splitFn(props, [
    'allowMouseWheel',
    'allowOverflow',
    'clampValueOnBlur',
    'defaultValue',
    'disabled',
    'focusInputOnChange',
    'form',
    'formatOptions',
    'id',
    'ids',
    'inputMode',
    'invalid',
    'locale',
    'max',
    'min',
    'name',
    'onFocusChange',
    'onValueChange',
    'onValueInvalid',
    'pattern',
    'readOnly',
    'required',
    'spinOnPress',
    'step',
    'translations',
    'value',
  ])
}
