import type { CalendarFixtureMode } from '../../../../utils/test/browser-smoke/suite'
import type { DateValue } from '../components/calendar'
import { useState } from 'react'
import { Calendar, parseDate } from '../components/calendar'

const seed = [parseDate('2026-01-15')]

export function CalendarValueFixture({ mode }: { mode: CalendarFixtureMode }) {
  const [value, setValue] = useState<DateValue[]>(seed)
  const [events, setEvents] = useState<string[]>([])
  const inline = mode.startsWith('inline')
  const controlled = mode === 'inline-controlled'
  const modeProps = mode === 'popup-default' ? {} : { inline }
  const grid = () => (
    <Calendar.View view="day">
      <Calendar.Context>
        {api => (
          <>
            <Calendar.Table>
              <Calendar.TableHead>
                <Calendar.TableRow>
                  {api.weekDays.map((day, index) => <Calendar.TableHeader key={index}>{day.short}</Calendar.TableHeader>)}
                </Calendar.TableRow>
              </Calendar.TableHead>
              <Calendar.TableBody>
                {api.weeks.map((week, i) => (
                  <Calendar.TableRow key={i}>
                    {week.map(day => (
                      <Calendar.TableCell key={day.toString()} value={day}>
                        <Calendar.TableCellTrigger>{day.day}</Calendar.TableCellTrigger>
                      </Calendar.TableCell>
                    ))}
                  </Calendar.TableRow>
                ))}
              </Calendar.TableBody>
            </Calendar.Table>
            <output data-testid="calendar-value">{api.value.map(date => date.toString()).join(',')}</output>
          </>
        )}
      </Calendar.Context>
    </Calendar.View>
  )
  return (
    <Calendar.Root
      {...modeProps}
      defaultValue={seed}
      value={controlled ? value : undefined}
      onValueChange={(details) => {
        setEvents(previous => [...previous, details.value.map(date => date.toString()).join(',')])
        if (controlled)
          setValue(details.value)
      }}
    >
      <output data-testid="calendar-events">{JSON.stringify(events)}</output>
      {controlled && <output data-testid="calendar-model">{value.map(date => date.toString()).join(',')}</output>}
      {inline
        ? (
            <>
              <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
              {grid()}
            </>
          )
        : (
            <>
              <Calendar.Label>Date</Calendar.Label>
              <Calendar.Control>
                <Calendar.Input />
                <Calendar.Trigger>Open calendar</Calendar.Trigger>
              </Calendar.Control>
              <Calendar.Positioner>
                <Calendar.Content>{grid()}</Calendar.Content>
              </Calendar.Positioner>
            </>
          )}
    </Calendar.Root>
  )
}
