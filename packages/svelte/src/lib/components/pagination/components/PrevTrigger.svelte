<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PaginationPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface PaginationPrevTriggerProps extends Assign<HTMLProps<'button'>, PaginationPrevTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const props: PaginationPrevTriggerProps = $props()
  const pagination = usePaginationContext()
  const mergedProps = $derived(mergeProps(pagination().getPrevTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
