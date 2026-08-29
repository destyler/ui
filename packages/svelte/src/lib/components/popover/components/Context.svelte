<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UsePopoverContext } from '../hooks/use-popover-context'

  export interface PopoverContextProps {
    render?: Snippet<[UsePopoverContext]>
  }
</script>

<script lang="ts">
  import { usePopoverContext } from '../hooks/use-popover-context'

  const { render }: PopoverContextProps = $props()

  const context = usePopoverContext()
</script>

{@render render?.(context)}
