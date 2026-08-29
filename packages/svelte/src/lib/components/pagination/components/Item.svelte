<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/pagination'

  export interface PaginationItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
  export interface PaginationItemProps extends Assign<HTMLProps<'button'>, PaginationItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const props: PaginationItemProps = $props()
  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['value', 'type']))
  const pagination = usePaginationContext()
  const mergedProps = $derived(mergeProps(pagination().getItemProps(itemProps), localProps))
</script>

<UI as="button" {...mergedProps} />
