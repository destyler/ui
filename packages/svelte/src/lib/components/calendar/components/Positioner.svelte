<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarPositionerBaseProps extends PolymorphicProps<'div'> {}
  export interface CalendarPositionerProps extends Assign<HTMLProps<'div'>, CalendarPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { usePresenceContext } from '../../presence/index.js'

  const props: CalendarPositionerProps = $props()

  const calendar = useCalendarContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(calendar().getPositionerProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}
