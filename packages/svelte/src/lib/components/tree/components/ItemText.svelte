<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeItemTextBaseProps extends PolymorphicProps<'span'> {}
  export interface TreeItemTextProps extends Assign<HTMLProps<'span'>, TreeItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeItemTextProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const mergedProps = $derived(mergeProps(tree().getItemTextProps(nodeProps()), props))
</script>

<UI as="span" {...mergedProps} />
