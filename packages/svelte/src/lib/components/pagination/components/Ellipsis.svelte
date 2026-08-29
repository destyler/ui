<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { EllipsisProps } from '@destyler/pagination'

  export interface PaginationEllipsisBaseProps extends EllipsisProps, PolymorphicProps<'div'> {}
  export interface PaginationEllipsisProps extends Assign<HTMLProps<'div'>, PaginationEllipsisBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const props: PaginationEllipsisProps = $props()
  const pagination = usePaginationContext()
  const mergedProps = $derived(mergeProps(pagination().getEllipsisProps(props), props))
</script>

<UI as="div" {...mergedProps} />
