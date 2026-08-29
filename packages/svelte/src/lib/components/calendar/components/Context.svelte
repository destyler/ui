<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseCalendarContext } from '../hooks/use-calendar-context.js'

  export interface CalendarContextProps {
    render: Snippet<[UseCalendarContext]>
  }
</script>

<script lang="ts">
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  let { render }: CalendarContextProps = $props()

  const context = useCalendarContext()
</script>

{@render render(context)}
