import type { Optional } from '$lib/types'
import type { UseCheckboxProps } from './use-checkbox.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type CheckboxMachineProps = Optional<UseCheckboxProps, 'id'>

const splitFn = createSplitProps<CheckboxMachineProps>()

export function splitCheckboxProps<T extends CheckboxMachineProps>(props: T) {
  return splitFn(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'name',
    'onCheckedChange',
    'readOnly',
    'required',
    'value',
  ])
}
