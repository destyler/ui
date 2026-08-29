<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableCellTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CalendarTableCellTriggerProps
    extends Assign<HTMLProps<'button'>, CalendarTableCellTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import type { DayTableCellProps, TableCellProps } from '@destyler/calendar'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarTableCellPropsContext } from '../hooks/use-calendar-table-cell-props-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarTableCellTriggerProps = $props()

  const calendar = useCalendarContext()
  const cellProps = useCalendarTableCellPropsContext()
  const viewProps = useCalendarViewPropsContext()

  const triggerProps = $derived.by(() => {
    const view = viewProps().view
    if (view === 'day')
      return calendar().getDayTableCellTriggerProps(cellProps() as DayTableCellProps)
    if (view === 'month')
      return calendar().getMonthTableCellTriggerProps(cellProps() as TableCellProps)
    return calendar().getYearTableCellTriggerProps(cellProps() as TableCellProps)
  })

  const mergedProps = $derived(mergeProps(triggerProps, props))
</script>

<UI as="button" {...mergedProps} />
