<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TooltipPositionerBaseProps extends PolymorphicProps<'div'> {}
  export interface TooltipPositionerProps extends Assign<HTMLProps<'div'>, TooltipPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useTooltipContext } from '../hooks/use-tooltip-context'

  const props: TooltipPositionerProps = $props()
  const tooltip = useTooltipContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(tooltip().getPositionerProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}
