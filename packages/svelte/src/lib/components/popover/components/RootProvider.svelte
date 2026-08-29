<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UsePopoverReturn } from '../hooks/use-popover.svelte'

  export interface PopoverRootProviderBaseProps extends UsePresenceProps, PolymorphicProps<'div'> {
    value: UsePopoverReturn
  }
  export interface PopoverRootProviderProps extends Assign<HTMLProps<'div'>, PopoverRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { PopoverProvider } from '../hooks/use-popover-context'

  let { value, ...props }: PopoverRootProviderProps = $props()
  const [presenceProps, localProps] = $derived(splitPresenceProps(props))
  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))

  PopoverProvider(() => value())
  PresenceProvider(() => presence())
</script>

<UI as="div" {...localProps} />
