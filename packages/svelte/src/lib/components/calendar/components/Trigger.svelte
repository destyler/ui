<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CalendarTriggerProps extends Assign<HTMLProps<'button'>, CalendarTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarTriggerProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
