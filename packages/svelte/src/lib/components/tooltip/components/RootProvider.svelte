<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UsePresenceProps } from '../../presence'
  import type { UseTooltipReturn } from '../hooks/use-tooltip.svelte'

  interface RootProviderProps {
    value: UseTooltipReturn
  }

  export interface TooltipRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
  export interface TooltipRootProviderProps extends TooltipRootProviderBaseProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { TooltipProvider } from '../hooks/use-tooltip-context'

  const props: TooltipRootProviderProps = $props()

  const [presenceProps, rootProviderProps] = $derived(splitPresenceProps(props))

  const machineProps = $derived<UsePresenceProps>(
    mergeProps({ present: rootProviderProps.value().open }, presenceProps),
  )

  const presence = usePresence(() => machineProps)

  TooltipProvider(() => rootProviderProps.value())
  PresenceProvider(() => presence())
</script>

{@render props.children?.()}
