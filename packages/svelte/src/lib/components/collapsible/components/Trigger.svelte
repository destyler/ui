<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CollapsibleTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CollapsibleTriggerProps extends Assign<HTMLProps<'button'>, CollapsibleTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCollapsibleContext } from '../hooks/use-collapsible-context'

  const props: CollapsibleTriggerProps = $props()
  const collapsible = useCollapsibleContext()
  const mergedProps = $derived(mergeProps(collapsible().getTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
