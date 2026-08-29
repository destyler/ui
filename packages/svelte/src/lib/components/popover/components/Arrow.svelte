<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverArrowBaseProps extends PolymorphicProps<'div'> {}
  export interface PopoverArrowProps extends Assign<HTMLProps<'div'>, PopoverArrowBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverArrowProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getArrowProps(), props))
</script>

<UI as="div" {...mergedProps} />
