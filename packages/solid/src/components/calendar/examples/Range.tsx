import { Calendar } from '@destyler-ui/solid/calendar'
import { createMemo, Index } from 'solid-js'
import { Portal } from 'solid-js/web'

export function Range() {
  return (
    <Calendar.Root selectionMode="range" numOfMonths={2}>
      <Calendar.Label>Label</Calendar.Label>

      <Calendar.Control>
        <Calendar.Input index={0} />
        <Calendar.Input index={1} />
        <Calendar.Trigger>📅</Calendar.Trigger>
        <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
      </Calendar.Control>

      <Calendar.PresetTrigger value="last7Days">Last 7 days</Calendar.PresetTrigger>

      <Portal>
        <Calendar.Positioner>
          <Calendar.Content>
            <Calendar.YearSelect />
            <Calendar.MonthSelect />

            <div style={{ display: 'flex', gap: '10px' }}>
              <Calendar.Context>
                {context => (
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
                )}
              </Calendar.Context>

              <Calendar.Context>
                {(context) => {
                  const offset = createMemo(() => context().getOffset({ months: 1 }))
                  return (
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
                        <Index each={offset().weeks}>
                          {week => (
                            <Calendar.TableRow>
                              <Index each={week()}>
                                {day => (
                                  <Calendar.TableCell
                                    value={day()}
                                    visibleRange={offset().visibleRange}
                                  >
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
                  )
                }}
              </Calendar.Context>
            </div>
          </Calendar.Content>
        </Calendar.Positioner>
      </Portal>
    </Calendar.Root>
  )
}
