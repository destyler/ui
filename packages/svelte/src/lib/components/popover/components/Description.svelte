<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface PopoverDescriptionBaseProps extends PolymorphicProps<'p'> {}
  export interface PopoverDescriptionProps extends Assign<HTMLProps<'p'>, PopoverDescriptionBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePopoverContext } from '../hooks/use-popover-context'

  const props: PopoverDescriptionProps = $props()

  const popover = usePopoverContext()
  const mergedProps = $derived(mergeProps(popover().getDescriptionProps(), props))
</script>

<UI as="p" {...mergedProps} />
