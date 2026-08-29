<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface PopoverCloseTriggerProps extends Assign<HTMLProps<'button'>, PopoverCloseTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverCloseTriggerProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getCloseTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
