<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TooltipArrowBaseProps extends PolymorphicProps<'div'> {}
  export interface TooltipArrowProps extends Assign<HTMLProps<'div'>, TooltipArrowBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTooltipContext } from '../hooks/use-tooltip-context'

  const props: TooltipArrowProps = $props()
  const tooltip = useTooltipContext()
  const mergedProps = $derived(mergeProps(tooltip().getArrowProps(), props))
</script>

<UI as="div" {...mergedProps} />
