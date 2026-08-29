import type { Optional } from '$lib/types'
import type { TreeNode } from '../../collection'
import type { UseTreeProps } from './use-tree.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type TreeRootMachineProps = Optional<UseTreeProps<TreeNode>, 'id'>

const splitFn = createSplitProps<TreeRootMachineProps>()

export function splitTreeProps<T extends TreeRootMachineProps>(props: T) {
  return splitFn(props, [
    'collection',
    'defaultExpandedValue',
    'defaultSelectedValue',
    'expandedValue',
    'expandOnClick',
    'focusedValue',
    'id',
    'ids',
    'onExpandedChange',
    'onFocusChange',
    'onSelectionChange',
    'selectedValue',
    'selectionMode',
    'typeahead',
  ])
}
