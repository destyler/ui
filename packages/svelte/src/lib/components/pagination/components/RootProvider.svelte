<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { Snippet } from 'svelte'
  import type { UsePaginationReturn } from '../hooks/use-pagination.svelte'

  export interface RootProviderProps {
    value: UsePaginationReturn
    children?: Snippet
  }

  export interface PaginationRootProviderBaseProps extends PolymorphicProps<'nav'>, RootProviderProps {}
  export interface PaginationRootProviderProps extends Assign<HTMLProps<'nav'>, PaginationRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PaginationProvider } from '../hooks/use-pagination-context'

  let { value, ...props }: PaginationRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  PaginationProvider(() => value())
</script>

<UI as="nav" {...mergedProps} />
