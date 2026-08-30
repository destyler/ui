import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Index } from 'solid-js'
import { ui } from '~/factory'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarMonthSelectBaseProps extends PolymorphicProps<'select'> {}
export interface CalendarMonthSelectProps
  extends HTMLProps<'select'>,
  CalendarMonthSelectBaseProps {}

export function CalendarMonthSelect(props: CalendarMonthSelectProps) {
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(() => calendar().getMonthSelectProps(), props)

  return (
    <ui.select {...mergedProps}>
      <Index each={calendar().getMonths()}>
        {month => <option value={month().value}>{month().label}</option>}
      </Index>
    </ui.select>
  )
}
