import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarLabelBaseProps extends PolymorphicProps {}
export interface CalendarLabelProps extends HTMLProps<'label'>, CalendarLabelBaseProps {}

export const CalendarLabel = forwardRef<HTMLLabelElement, CalendarLabelProps>((props, ref) => {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

CalendarLabel.displayName = 'CalendarLabel'
