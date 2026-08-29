<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  export interface BreadcrumbsListBaseProps extends PolymorphicProps<'ol'> {}
  export interface BreadcrumbsListProps extends Assign<HTMLProps<'ol'>, BreadcrumbsListBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  const props: BreadcrumbsListProps = $props()
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = $derived(mergeProps(breadcrumbs().getListProps(), props))
</script>
<UI as="ol" {...mergedProps} />
