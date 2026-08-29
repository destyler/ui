<script module lang="ts">
  import type { Optional } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseHoverCardProps } from '../hooks/use-hover-card.svelte'

  export interface HoverCardRootBaseProps extends Optional<UseHoverCardProps, 'id'>, UsePresenceProps {
    children?: Snippet
  }
  export interface HoverCardRootProps extends HoverCardRootBaseProps {}
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { HoverCardProvider } from '../hooks/use-hover-card-context'
  import { useHoverCard } from '../hooks/use-hover-card.svelte'

  let { open = $bindable<boolean>(), ...props }: HoverCardRootProps = $props()
  const providedId = $props.id()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))

  const resolvedProps = $derived<UseHoverCardProps>({
    ...localProps,
    id: localProps.id ?? providedId,
    open,
    onOpenChange(details) {
      localProps.onOpenChange?.(details)
      if (open !== undefined) open = details.open
    },
  })

  const hoverCard = useHoverCard(() => resolvedProps)
  const presence = usePresence(() => mergeProps({ present: hoverCard().open }, presenceProps))

  HoverCardProvider(() => hoverCard())
  PresenceProvider(() => presence())
</script>

{@render props.children?.()}
