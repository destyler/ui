<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseBreadcrumbsProps } from '../hooks/use-breadcrumbs.svelte'

  export interface BreadcrumbsRootBaseProps extends Optional<UseBreadcrumbsProps, 'id'>, PolymorphicProps<'nav'> {}
  export interface BreadcrumbsRootProps extends Assign<HTMLProps<'nav'>, BreadcrumbsRootBaseProps> {}
</script>

<script lang="ts">
  import * as breadcrumbsMachine from '@destyler/breadcrumbs'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { BreadcrumbsProvider } from '../hooks/use-breadcrumbs-context'
  import { useBreadcrumbs } from '../hooks/use-breadcrumbs.svelte'

  const props: BreadcrumbsRootProps = $props()
  const providedId = $props.id()
  const [machineProps, localProps] = $derived(breadcrumbsMachine.splitProps(props as UseBreadcrumbsProps))
  const resolvedProps = $derived<UseBreadcrumbsProps>({ ...machineProps, id: machineProps.id ?? providedId })
  const breadcrumbs = useBreadcrumbs(() => resolvedProps)
  const mergedProps = $derived(mergeProps(breadcrumbs().getRootProps(), localProps))

  BreadcrumbsProvider(() => breadcrumbs())
</script>

<UI as="nav" {...mergedProps} />
