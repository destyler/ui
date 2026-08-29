<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarViewTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CalendarViewTriggerProps extends Assign<HTMLProps<'button'>, CalendarViewTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarViewTriggerProps = $props()

  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = $derived(mergeProps(calendar().getViewTriggerProps(viewProps()), props))
</script>

<UI as="button" {...mergedProps} />
