<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TabsListBaseProps extends PolymorphicProps<'div'> {}
  export interface TabsListProps extends Assign<HTMLProps<'div'>, TabsListBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTabsContext } from '../hooks/use-tabs-context'

  const props: TabsListProps = $props()
  const tabs = useTabsContext()

  const mergedProps = $derived(mergeProps(tabs().getListProps(), props))
</script>

<UI as="div" {...mergedProps} />
