<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverArrowTipBaseProps extends PolymorphicProps<'div'> {}
  export interface PopoverArrowTipProps extends Assign<HTMLProps<'div'>, PopoverArrowTipBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverArrowTipProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getArrowTipProps(), props))
</script>

<UI as="div" {...mergedProps} />
