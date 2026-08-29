<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseBreadcrumbsReturn } from '../hooks/use-breadcrumbs.svelte'

  export interface BreadcrumbsRootProviderBaseProps extends PolymorphicProps<'nav'> {
    value: UseBreadcrumbsReturn
  }
  export interface BreadcrumbsRootProviderProps
    extends Assign<HTMLProps<'nav'>, BreadcrumbsRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'

  const { value: breadcrumbs, ...props }: BreadcrumbsRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(breadcrumbs().getRootProps(), props))
  BreadcrumbsProvider(() => breadcrumbs())
</script>

<UI as="nav" {...mergedProps} />
