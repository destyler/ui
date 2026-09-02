import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'
import { useCalendarTableCellContext } from '../hooks/use-calendar-table-cell-props-context'
import { useCalendarViewContext } from '../hooks/use-calendar-view-props-context'

export interface CalendarTableCellTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface CalendarTableCellTriggerProps
  extends HTMLProps<'div'>,
  CalendarTableCellTriggerBaseProps {}

export function CalendarTableCellTrigger(props: CalendarTableCellTriggerProps) {
  const api = useCalendarContext()
  const cellProps = useCalendarTableCellContext()
  const viewProps = useCalendarViewContext()

  const triggerProps = createMemo(() => {
    const viewMap = {
      day: api().getDayTableCellTriggerProps,
      month: api().getMonthTableCellTriggerProps,
      year: api().getYearTableCellTriggerProps,
    }

    const viewFn = viewMap[viewProps.view]

    // @ts-expect-error The selected view narrows the matching cell value at runtime.
    return viewFn(cellProps)
  })

  const mergedProps = mergeProps(triggerProps, props)

  return <ui.div {...mergedProps} />
}
