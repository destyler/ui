import type { Optional } from '$lib/types'
import type { UseEditProps } from './use-edit.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type EditMachineProps = Optional<UseEditProps, 'id'>

const splitFn = createSplitProps<EditMachineProps>()
export function splitEditProps<T extends EditMachineProps>(props: T) {
  return splitFn(props, [
    'activationMode',
    'autoResize',
    'defaultEdit',
    'defaultValue',
    'disabled',
    'edit',
    'finalFocusEl',
    'form',
    'id',
    'ids',
    'invalid',
    'maxLength',
    'name',
    'onEditChange',
    'onFocusOutside',
    'onInteractOutside',
    'onPointerDownOutside',
    'onValueChange',
    'onValueCommit',
    'onValueRevert',
    'placeholder',
    'readOnly',
    'required',
    'selectOnFocus',
    'submitMode',
    'translations',
    'value',
  ])
}
