<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeTreeBaseProps extends PolymorphicProps<'ul'> {}
  export interface TreeTreeProps extends Assign<HTMLProps<'ul'>, TreeTreeBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'

  const props: TreeTreeProps = $props()

  const tree = useTreeContext()
  const mergedProps = $derived(mergeProps(tree().getTreeProps(), props))
</script>

<UI as="div" {...mergedProps} />
