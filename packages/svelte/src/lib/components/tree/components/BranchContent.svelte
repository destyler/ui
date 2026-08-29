<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchContentBaseProps extends PolymorphicProps<'ul'> {
    ref?: Element | null
  }
  export interface TreeBranchContentProps extends Assign<HTMLProps<'ul'>, TreeBranchContentBaseProps> {}

  interface VisibilityProps {
    hidden?: boolean
    'data-state'?: string
  }
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { Collapsible } from '../../collapsible'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchContentProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const contentProps = $derived(tree().getBranchContentProps(nodeProps()))

  const splitVisibilityProps = createSplitProps<VisibilityProps>()
  const [, branchContentProps] = $derived(splitVisibilityProps(contentProps as VisibilityProps, ['hidden', 'data-state']))

  const mergedProps = $derived(mergeProps(branchContentProps, props))
</script>

<Collapsible.Content {...mergedProps} />
