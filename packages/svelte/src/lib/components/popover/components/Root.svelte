<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { Optional } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UsePopoverProps } from '../hooks/use-popover.svelte'

  export interface PopoverRootBaseProps extends Optional<UsePopoverProps, 'id'>, UsePresenceProps {}
  export interface PopoverRootProps extends PopoverRootBaseProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { PopoverProvider } from '../hooks/use-popover-context'
  import { usePopover } from '../hooks/use-popover.svelte'

  let { open = $bindable(), children, ...props }: PopoverRootProps = $props()

  const providedId = $props.id()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))

  const machineProps = $derived.by<UsePopoverProps>(() => {
    return {
      ...localProps,
      id: localProps.id ?? providedId,
      open,
      onOpenChange(details) {
        localProps.onOpenChange?.(details)
        if (open !== undefined) open = details.open
      },
    }
  })

  const popover = usePopover(() => machineProps)

  const presenceMachineProps = $derived<UsePresenceProps>(
    mergeProps({ present: popover().open }, presenceProps),
  )

  const presence = usePresence(() => presenceMachineProps)

  PopoverProvider(() => popover())
  PresenceProvider(() => presence())
</script>

{@render children?.()}
