<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TabsIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface TabsIndicatorProps extends Assign<HTMLProps<'div'>, TabsIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTabsContext } from '../hooks/use-tabs-context'

  const props: TabsIndicatorProps = $props()
  const tabs = useTabsContext()
  const mergedProps = $derived(mergeProps(tabs().getIndicatorProps(), props))
</script>

<UI as="div" {...mergedProps} />
