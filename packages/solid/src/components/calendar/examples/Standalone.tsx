import { Calendar } from '@destyler-ui/solid/calendar'
import { Index } from 'solid-js'

export function Standalone() {
  return (
    <Calendar.Root open>
      <Calendar.Context>
        {context => (
          <>
            <Calendar.View view="day">
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
                              <Calendar.TableCellTrigger>{day().day}</Calendar.TableCellTrigger>
                            </Calendar.TableCell>
                          )}
                        </Index>
                      </Calendar.TableRow>
                    )}
                  </Index>
                </Calendar.TableBody>
              </Calendar.Table>
            </Calendar.View>
          </>
        )}
      </Calendar.Context>
    </Calendar.Root>
  )
}
