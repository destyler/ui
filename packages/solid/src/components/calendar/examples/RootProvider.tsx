import { Calendar, useCalendar } from '@destyler-ui/solid/calendar'
import { Index, Portal } from 'solid-js/web'

export function RootProvider() {
  const calendar = useCalendar()

  return (
    <>
      <button onClick={() => calendar().clearValue()}>Clear</button>

      <Calendar.RootProvider value={calendar}>
        <Calendar.Label>Label</Calendar.Label>

        <Calendar.Control>
          <Calendar.Input />
          <Calendar.Trigger>📅</Calendar.Trigger>
          <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
        </Calendar.Control>

        <Portal>
          <Calendar.Positioner>
            <Calendar.Content>
              <Calendar.YearSelect />
              <Calendar.MonthSelect />
              <Calendar.View view="day">
                <Calendar.Context>
                  {context => (
                    <>
                      <Calendar.ViewControl>
                        <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
                        <Calendar.ViewTrigger>
                          <Calendar.RangeText />
                        </Calendar.ViewTrigger>
                        <Calendar.NextTrigger>Next</Calendar.NextTrigger>
                      </Calendar.ViewControl>

                      <Calendar.Table>
                        <Calendar.TableHead>
                          <Calendar.TableRow>
                            <Index each={context().weekDays}>
                              {weekDay => (
                                <Calendar.TableHeader>{weekDay().short}</Calendar.TableHeader>
                              )}
                            </Index>
                          </Calendar.TableRow>
                        </Calendar.TableHead>

                        <Calendar.TableBody>
                          <Index each={context().weeks}>
                            {week => (
                              <Calendar.TableRow>
                                <Index each={week()}>
                                  {day => (
                                    <Calendar.TableCell value={day()}>
                                      <Calendar.TableCellTrigger>
                                        {day().day}
                                      </Calendar.TableCellTrigger>
                                    </Calendar.TableCell>
                                  )}
                                </Index>
                              </Calendar.TableRow>
                            )}
                          </Index>
                        </Calendar.TableBody>
                      </Calendar.Table>
                    </>
                  )}
                </Calendar.Context>
              </Calendar.View>

              <Calendar.View view="month">
                <Calendar.Context>
                  {context => (
                    <>
                      <Calendar.ViewControl>
                        <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
                        <Calendar.ViewTrigger>
                          <Calendar.RangeText />
                        </Calendar.ViewTrigger>
                        <Calendar.NextTrigger>Next</Calendar.NextTrigger>
                      </Calendar.ViewControl>

                      <Calendar.Table>
                        <Calendar.TableBody>
                          <Index each={context().getMonthsGrid({ columns: 4, format: 'short' })}>
                            {months => (
                              <Calendar.TableRow>
                                <Index each={months()}>
                                  {month => (
                                    <Calendar.TableCell value={month().value}>
                                      <Calendar.TableCellTrigger>
                                        {month().label}
                                      </Calendar.TableCellTrigger>
                                    </Calendar.TableCell>
                                  )}
                                </Index>
                              </Calendar.TableRow>
                            )}
                          </Index>
                        </Calendar.TableBody>
                      </Calendar.Table>
                    </>
                  )}
                </Calendar.Context>
              </Calendar.View>

              <Calendar.View view="year">
                <Calendar.Context>
                  {context => (
                    <>
                      <Calendar.ViewControl>
                        <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
                        <Calendar.ViewTrigger>
                          <Calendar.RangeText />
                        </Calendar.ViewTrigger>
                        <Calendar.NextTrigger>Next</Calendar.NextTrigger>
                      </Calendar.ViewControl>

                      <Calendar.Table>
                        <Calendar.TableBody>
                          <Index each={context().getYearsGrid({ columns: 4 })}>
                            {years => (
                              <Calendar.TableRow>
                                <Index each={years()}>
                                  {year => (
                                    <Calendar.TableCell value={year().value}>
                                      <Calendar.TableCellTrigger>
                                        {year().label}
                                      </Calendar.TableCellTrigger>
                                    </Calendar.TableCell>
                                  )}
                                </Index>
                              </Calendar.TableRow>
                            )}
                          </Index>
                        </Calendar.TableBody>
                      </Calendar.Table>
                    </>
                  )}
                </Calendar.Context>
              </Calendar.View>
            </Calendar.Content>
          </Calendar.Positioner>
        </Portal>
      </Calendar.RootProvider>
    </>
  )
}
