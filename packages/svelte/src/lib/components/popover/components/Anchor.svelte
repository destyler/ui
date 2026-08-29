<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverAnchorBaseProps extends PolymorphicProps<'div'> {}
  export interface PopoverAnchorProps extends Assign<HTMLProps<'div'>, PopoverAnchorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverAnchorProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getAnchorProps(), props))
</script>

<UI as="div" {...mergedProps} />
