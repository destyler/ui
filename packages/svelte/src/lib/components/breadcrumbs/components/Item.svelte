<script module lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  export interface BreadcrumbsItemBaseProps extends PolymorphicProps<'li'> { item: BreadcrumbItem }
  export interface BreadcrumbsItemProps extends Assign<HTMLProps<'li'>, BreadcrumbsItemBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  const { item, ...props }: BreadcrumbsItemProps = $props()
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = $derived(mergeProps(breadcrumbs().getItemProps(item), props))
</script>
<UI as="li" {...mergedProps} />
