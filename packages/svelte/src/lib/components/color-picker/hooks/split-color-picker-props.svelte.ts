import type { Optional } from '$lib/types'
import type { UseColorPickerProps } from './use-color-picker.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type ColorPickerMachineProps = Optional<UseColorPickerProps, 'id'>

const splitFn = createSplitProps<ColorPickerMachineProps>()

export function splitColorPickerProps<T extends ColorPickerMachineProps>(props: T) {
  return splitFn(props, [
    'closeOnSelect',
    'defaultOpen',
    'defaultValue',
    'disabled',
    'format',
    'id',
    'ids',
    'initialFocusEl',
    'invalid',
    'name',
    'onFocusOutside',
    'onFormatChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onValueChange',
    'onValueChangeEnd',
    'open',
    'openAutoFocus',
    'positioning',
    'readOnly',
    'required',
    'value',
  ])
}
