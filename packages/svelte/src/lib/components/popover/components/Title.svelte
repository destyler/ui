<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverTitleBaseProps extends PolymorphicProps<'h2'> {}
  export interface PopoverTitleProps extends Assign<HTMLProps<'h2'>, PopoverTitleBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverTitleProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getTitleProps(), props))
</script>

<UI as="h2" {...mergedProps} />
