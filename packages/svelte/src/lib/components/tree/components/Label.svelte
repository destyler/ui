<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeLabelBaseProps extends PolymorphicProps<'h3'> {}
  export interface TreeLabelProps extends Assign<HTMLProps<'h3'>, TreeLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'

  const props: TreeLabelProps = $props()

  const tree = useTreeContext()
  const mergedProps = $derived(mergeProps(tree().getLabelProps(), props))
</script>

<UI as="h3" {...mergedProps} />
