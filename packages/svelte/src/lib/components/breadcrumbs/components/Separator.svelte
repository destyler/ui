<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  export interface BreadcrumbsSeparatorBaseProps extends PolymorphicProps<'span'> {}
  export interface BreadcrumbsSeparatorProps extends Assign<HTMLProps<'span'>, BreadcrumbsSeparatorBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  const props: BreadcrumbsSeparatorProps = $props()
  const breadcrumbs = useBreadcrumbsContext()
  const mergedProps = $derived(mergeProps(breadcrumbs().getSeparatorProps(), props))
</script>
<UI as="span" {...mergedProps} />
