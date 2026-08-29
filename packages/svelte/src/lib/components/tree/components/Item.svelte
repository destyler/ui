<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeItemBaseProps extends PolymorphicProps<'li'> {}
  export interface TreeItemProps extends Assign<HTMLProps<'li'>, TreeItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeItemProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = $derived(mergeProps(tree().getItemProps(nodeProps()), props))
</script>

<UI as="li" {...mergedProps} />
