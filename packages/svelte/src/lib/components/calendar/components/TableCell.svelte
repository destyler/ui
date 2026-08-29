<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import type { UseCalendarTableCellPropsContext } from '../hooks/use-calendar-table-cell-props-context.js'

  export interface CalendarTableCellBaseProps
    extends ReturnType<UseCalendarTableCellPropsContext>,
      PolymorphicProps<'td'> {}
  export interface CalendarTableCellProps extends Assign<HTMLProps<'td'>, CalendarTableCellBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import type { DayTableCellProps, TableCellProps } from '@destyler/calendar'
  import { createSplitProps } from '../../../utils/create-split-props.js'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { CalendarTableCellPropsProvider } from '../hooks/use-calendar-table-cell-props-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarTableCellProps = $props()

  const [cellProps, localProps] = $derived(
    createSplitProps<ReturnType<UseCalendarTableCellPropsContext>>()(props, [
      'disabled',
      'value',
      'visibleRange',
      'columns',
    ]),
  )

  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()

  const tableCellProps = $derived.by(() => {
    const view = viewProps().view
    if (view === 'day')
      return calendar().getDayTableCellProps(cellProps as DayTableCellProps)
    if (view === 'month')
      return calendar().getMonthTableCellProps(cellProps as TableCellProps)
    return calendar().getYearTableCellProps(cellProps as TableCellProps)
  })

  const mergedProps = $derived(mergeProps(tableCellProps, localProps))

  CalendarTableCellPropsProvider(() => cellProps)
</script>

<UI as="td" {...mergedProps} />
