<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchBaseProps extends PolymorphicProps<'li'> {}
  export interface TreeBranchProps extends Assign<HTMLProps<'li'>, TreeBranchBaseProps> {}
</script>

<script lang="ts">
  import { useRenderStrategyPropsContext } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { Collapsible } from '../../collapsible'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodeContext } from '../hooks/use-tree-node-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const nodeState = useTreeNodeContext()

  const renderStrategyProps = useRenderStrategyPropsContext()
  const mergedProps = $derived(mergeProps(tree().getBranchProps(nodeProps()), props))
  const branchContentProps = $derived(tree().getBranchContentProps(nodeProps()))
</script>

<Collapsible.Root
  open={nodeState().expanded}
  ids={{ content: branchContentProps.id! }}
  {...renderStrategyProps}
  {...mergedProps}
/>
