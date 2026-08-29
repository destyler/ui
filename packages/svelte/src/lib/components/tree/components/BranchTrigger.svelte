<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface TreeBranchTriggerProps extends Assign<HTMLProps<'button'>, TreeBranchTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchTriggerProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const mergedProps = $derived(mergeProps(tree().getBranchTriggerProps(nodeProps()), props))
</script>

<UI as="button" {...mergedProps} />
