<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/pagination'

  export interface PaginationItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
  export interface PaginationItemProps extends Assign<HTMLProps<'button'>, PaginationItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const props: PaginationItemProps = $props()
  const pagination = usePaginationContext()
  const mergedProps = $derived(mergeProps(pagination().getItemProps(props), props))
</script>

<UI as="button" {...mergedProps} />
