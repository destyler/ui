import { For } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Calendar } from '../'

export function ComponentUnderTest(props: Calendar.RootProps) {
  return (
    <Calendar.Root {...props}>
      <Calendar.Label>Label</Calendar.Label>
      <Calendar.Control>
        <Calendar.Input />
        <Calendar.Trigger>📅</Calendar.Trigger>
        <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
      </Calendar.Control>
      <Calendar.PresetTrigger value="last7Days">Last 7 days</Calendar.PresetTrigger>
      <Portal>
        <Calendar.Positioner data-testid="positioner">
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
                          <For each={context().weekDays}>
                            {weekDay => (
                              <Calendar.TableHeader>{weekDay.short}</Calendar.TableHeader>
                            )}
                          </For>
                        </Calendar.TableRow>
                      </Calendar.TableHead>
                      <Calendar.TableBody>
                        <For each={context().weeks}>
                          {week => (
                            <Calendar.TableRow>
                              <For each={week}>
                                {day => (
                                  <Calendar.TableCell value={day}>
                                    <Calendar.TableCellTrigger>{day.day}</Calendar.TableCellTrigger>
                                  </Calendar.TableCell>
                                )}
                              </For>
                            </Calendar.TableRow>
                          )}
                        </For>
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
                        <For each={context().getMonthsGrid({ columns: 4, format: 'short' })}>
                          {months => (
                            <Calendar.TableRow>
                              <For each={months}>
                                {month => (
                                  <Calendar.TableCell value={month.value}>
                                    <Calendar.TableCellTrigger>
                                      {month.label}
                                    </Calendar.TableCellTrigger>
                                  </Calendar.TableCell>
                                )}
                              </For>
                            </Calendar.TableRow>
                          )}
                        </For>
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
                        <For each={context().getYearsGrid({ columns: 4 })}>
                          {years => (
                            <Calendar.TableRow>
                              <For each={years}>
                                {year => (
                                  <Calendar.TableCell value={year.value}>
                                    <Calendar.TableCellTrigger>
                                      {year.label}
                                    </Calendar.TableCellTrigger>
                                  </Calendar.TableCell>
                                )}
                              </For>
                            </Calendar.TableRow>
                          )}
                        </For>
                      </Calendar.TableBody>
                    </Calendar.Table>
                  </>
                )}
              </Calendar.Context>
            </Calendar.View>
          </Calendar.Content>
        </Calendar.Positioner>
      </Portal>
    </Calendar.Root>
  )
}
