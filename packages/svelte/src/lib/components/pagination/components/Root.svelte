<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UsePaginationProps } from '../hooks/use-pagination.svelte'

  export interface PaginationRootBaseProps extends Optional<UsePaginationProps, 'id'>, PolymorphicProps<'nav'> {}
  export interface PaginationRootProps extends Assign<HTMLProps<'nav'>, PaginationRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PaginationProvider } from '../hooks/use-pagination-context'
  import { usePagination } from '../hooks/use-pagination.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    page = $bindable(),
    page: pageProp,
    pageSize = $bindable(),
    pageSize: pageSizeProp,
    ...props
  }: PaginationRootProps = $props()
  const providedId = $props.id()

  const [paginationProps, localProps] = $derived(
    createSplitProps<Optional<UsePaginationProps, 'id'>>()(props, [
      'count',
      'defaultPage',
      'id',
      'ids',
      'onPageChange',
      'onPageSizeChange',
      'page',
      'pageSize',
    'defaultPageSize',
      'siblingCount',
      'translations',
      'type',
    ]),
  )

  const resolvedProps = $derived<UsePaginationProps>({
    ...paginationProps,
    id: paginationProps.id ?? providedId,
    page: pageProp,
    pageSize: pageSizeProp,
    onPageChange(details) {
      paginationProps.onPageChange?.(details)
      page = details.page
    },
    onPageSizeChange(details) {
      paginationProps.onPageSizeChange?.(details)
      pageSize = details.pageSize
    },
  })

  const pagination = usePagination(() => resolvedProps)
  const mergedProps = $derived(mergeProps(pagination().getRootProps(), localProps))

  PaginationProvider(() => pagination())
</script>

<UI as="nav" {...mergedProps} />
