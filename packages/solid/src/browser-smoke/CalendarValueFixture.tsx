import type { CalendarFixtureMode } from '../../../../utils/test/browser-smoke/suite'
import { createSignal, Index } from 'solid-js'
import { Calendar, parseDate } from '../components/calendar'

export function CalendarValueFixture(props: { mode: CalendarFixtureMode }) {
  const seed = [parseDate('2026-01-15')]
  const [value, setValue] = createSignal<Calendar.DateValue[]>(seed)
  const [events, setEvents] = createSignal<string[]>([])
  const inline = props.mode.startsWith('inline')
  const controlled = props.mode === 'inline-controlled'
  const modeProps = props.mode === 'popup-default' ? {} : { inline }
  const grid = () => (
    <Calendar.View view="day">
      <Calendar.Context>
        {api => (
          <>
            <Calendar.Table>
              <Calendar.TableHead>
                <Calendar.TableRow>
                  <Index each={api().weekDays}>{day => <Calendar.TableHeader>{day().short}</Calendar.TableHeader>}</Index>
                </Calendar.TableRow>
              </Calendar.TableHead>
              <Calendar.TableBody>
                <Index each={api().weeks}>
                  {week => (
                    <Calendar.TableRow>
                      <Index each={week()}>
                        {day => (
                          <Calendar.TableCell value={day()}>
                            <Calendar.TableCellTrigger>{day().day}</Calendar.TableCellTrigger>
                          </Calendar.TableCell>
                        )}
                      </Index>
                    </Calendar.TableRow>
                  )}
                </Index>
              </Calendar.TableBody>
            </Calendar.Table>
            <output data-testid="calendar-value">{api().value.map(date => date.toString()).join(',')}</output>
          </>
        )}
      </Calendar.Context>
    </Calendar.View>
  )
  return (
    <Calendar.Root
      {...modeProps}
      defaultValue={seed}
      value={controlled ? value() : undefined}
      onValueChange={(details) => {
        setEvents(previous => [...previous, details.value.map(date => date.toString()).join(',')])
        if (controlled)
          setValue(details.value)
      }}
    >
      <output data-testid="calendar-events">{JSON.stringify(events())}</output>
      {controlled && <output data-testid="calendar-model">{value().map(date => date.toString()).join(',')}</output>}
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
