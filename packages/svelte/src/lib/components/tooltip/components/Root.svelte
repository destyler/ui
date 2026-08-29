<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { Optional } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseTooltipProps } from '../hooks/use-tooltip.svelte'

  export interface TooltipRootBaseProps extends Optional<UseTooltipProps, 'id'>, UsePresenceProps {}
  export interface TooltipRootProps extends TooltipRootBaseProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { TooltipProvider } from '../hooks/use-tooltip-context'
  import { useTooltip } from '../hooks/use-tooltip.svelte'

  let { open = $bindable(), ...props }: TooltipRootProps = $props()
  const providedId = $props.id()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))
  const { children, ...useTooltipProps } = $derived(localProps)

  const resolvedProps = $derived<UseTooltipProps>({
    ...useTooltipProps,
    id: useTooltipProps.id ?? providedId,
    open,
    onOpenChange(details) {
      useTooltipProps.onOpenChange?.(details)
      if (open !== undefined) open = details.open
    },
  })

  const tooltip = useTooltip(() => resolvedProps)
  const machineProps = $derived<UsePresenceProps>(
    mergeProps({ present: tooltip().open }, presenceProps),
  )

  const presence = usePresence(() => machineProps)

  TooltipProvider(tooltip)
  PresenceProvider(() => presence())
</script>

{@render children?.()}
