<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { TreeNode } from '../../collection'
  import type { UseTreeProps } from '../hooks/use-tree.svelte'

  export interface TreeRootBaseProps<T extends TreeNode>
    extends Optional<UseTreeProps<T>, 'id'>,
      RenderStrategyProps,
      PolymorphicProps<'div'> {}

  export interface TreeRootProps<T extends TreeNode> extends Assign<HTMLProps<'div'>, TreeRootBaseProps<T>> {}
</script>

<script lang="ts" generics="T extends TreeNode">
  import {
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
    type RenderStrategyProps,
  } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { splitTreeProps } from '../hooks/tree-split-props'
  import { TreeProvider } from '../hooks/use-tree-context'
  import { useTree } from '../hooks/use-tree.svelte'

  let {
    expandedValue = $bindable<string[]>(),
    selectedValue = $bindable<string[]>(),
    focusedValue = $bindable<string | null>(),
    ...props
  }: TreeRootProps<T> = $props()

  const [renderStrategyProps, treeProps] = $derived(splitRenderStrategyProps(props))
  const [useTreeProps, localProps] = $derived(splitTreeProps(treeProps))

  const id = $props.id()

  const machineProps = $derived.by<UseTreeProps<T>>(() => ({
    ...useTreeProps,
    id: useTreeProps.id ?? id,
    selectedValue,
    expandedValue,
    focusedValue,
    onExpandedChange: (details) => {
      useTreeProps.onExpandedChange?.(details)
      expandedValue = details.expandedValue
    },
    onFocusChange: (details) => {
      useTreeProps.onFocusChange?.(details)
      focusedValue = details.focusedValue
    },
    onSelectionChange: (details) => {
      useTreeProps.onSelectionChange?.(details)
      selectedValue = details.selectedValue
    },
  }))

  const tree = useTree(() => machineProps)
  const mergedProps = $derived(mergeProps(tree().getRootProps(), localProps))

  TreeProvider(() => tree())
  RenderStrategyPropsProvider(() => renderStrategyProps)
</script>

<UI as="div" {...mergedProps} />
