<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface TreeBranchIndicatorProps extends Assign<HTMLProps<'div'>, TreeBranchIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchIndicatorProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = $derived(mergeProps(tree().getBranchIndicatorProps(nodeProps()), props))
</script>

<UI as="div" {...mergedProps} />
