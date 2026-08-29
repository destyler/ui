import type { UseCheckboxGroupProps } from './use-checkbox-group.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

const splitFn = createSplitProps<UseCheckboxGroupProps>()

export function splitCheckboxGroupProps<T extends UseCheckboxGroupProps>(props: T) {
  return splitFn(props, ['defaultValue', 'value', 'onValueChange', 'disabled', 'invalid', 'readOnly', 'name'])
}
