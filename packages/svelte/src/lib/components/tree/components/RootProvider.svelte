<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { TreeNode } from '../../collection'
  import type { UseTreeReturn } from '../hooks/use-tree.svelte'

  export interface TreeRootProviderBaseProps<T extends TreeNode>
    extends RenderStrategyProps,
      PolymorphicProps<'div'> {
    value: UseTreeReturn<T>
  }
  export interface TreeRootProviderProps<T extends TreeNode>
    extends Assign<HTMLProps<'div'>, TreeRootProviderBaseProps<T>> {}
</script>

<script lang="ts" generics="T extends TreeNode">
  import {
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
    type RenderStrategyProps,
  } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { TreeProvider } from '../hooks/use-tree-context'

  const { value, ...props }: TreeRootProviderProps<T> = $props()

  const [renderStrategyProps, treeProps] = $derived(splitRenderStrategyProps(props))
  const mergedProps = $derived(mergeProps(value().getRootProps(), treeProps))

  TreeProvider(() => value())
  RenderStrategyPropsProvider(() => renderStrategyProps)
</script>

<UI as="div" {...mergedProps} />
