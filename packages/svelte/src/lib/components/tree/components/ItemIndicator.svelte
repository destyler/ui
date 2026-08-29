<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface TreeItemIndicatorProps extends Assign<HTMLProps<'div'>, TreeItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeItemIndicatorProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const mergedProps = $derived(mergeProps(tree().getItemIndicatorProps(nodeProps()), props))
</script>

<UI as="div" {...mergedProps} />
