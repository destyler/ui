<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PaginationNextTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface PaginationNextTriggerProps extends Assign<HTMLProps<'button'>, PaginationNextTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const props: PaginationNextTriggerProps = $props()
  const pagination = usePaginationContext()
  const mergedProps = $derived(mergeProps(pagination().getNextTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
