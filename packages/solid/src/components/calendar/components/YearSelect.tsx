import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Index } from 'solid-js'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarYearSelectBaseProps extends PolymorphicProps<'select'> {}
export interface CalendarYearSelectProps
  extends HTMLProps<'select'>,
  CalendarYearSelectBaseProps {}

export function CalendarYearSelect(props: CalendarYearSelectProps) {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(() => calendar().getYearSelectProps(), props)

  return (
    <ui.select {...mergedProps}>
      <Index each={calendar().getYears()}>
        {year => <option value={year().value}>{year().label}</option>}
      </Index>
    </ui.select>
  )
}
