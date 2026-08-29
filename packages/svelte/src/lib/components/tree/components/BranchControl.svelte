<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchControlBaseProps extends PolymorphicProps<'div'> {}
  export interface TreeBranchControlProps extends Assign<HTMLProps<'div'>, TreeBranchControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchControlProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = $derived(mergeProps(tree().getBranchControlProps(nodeProps()), props))
</script>

<UI as="div" {...mergedProps} />
