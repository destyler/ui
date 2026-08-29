<script module lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  export interface BreadcrumbsLinkBaseProps extends PolymorphicProps<'a'> { item: BreadcrumbItem }
  export interface BreadcrumbsLinkProps extends Assign<HTMLProps<'a'>, BreadcrumbsLinkBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  const { item, ...props }: BreadcrumbsLinkProps = $props()
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = $derived(mergeProps(breadcrumbs().getLinkProps(item), props))
</script>
<UI as="a" {...mergedProps} />
