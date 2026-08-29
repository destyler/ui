<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarClearTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CalendarClearTriggerProps extends Assign<HTMLProps<'button'>, CalendarClearTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarClearTriggerProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getClearTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
