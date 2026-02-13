import { Calendar } from '../index'

export function Range() {
  return (
    <Calendar.Root selectionMode="range">
      <Calendar.Label>Label</Calendar.Label>
      <Calendar.Control>
        <Calendar.Input index={0} />
        <Calendar.Input index={1} />
        <Calendar.Trigger>📅</Calendar.Trigger>
        <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
      </Calendar.Control>
      <Calendar.PresetTrigger value="last7Days">Last 7 days</Calendar.PresetTrigger>
      <Calendar.Positioner>
        <Calendar.Content>
          <Calendar.YearSelect />
          <Calendar.MonthSelect />
          <Calendar.View view="day">
            <Calendar.Context>
              {api => (
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
                        {api.weekDays.map((weekDay, id) => (
                          <Calendar.TableHeader key={id}>
                            {weekDay.short}
                          </Calendar.TableHeader>
                        ))}
                      </Calendar.TableRow>
                    </Calendar.TableHead>
                    <Calendar.TableBody>
                      {api.weeks.map((week, id) => (
                        <Calendar.TableRow key={id}>
                          {week.map((day, id) => (
                            <Calendar.TableCell key={id} value={day}>
                              <Calendar.TableCellTrigger>{day.day}</Calendar.TableCellTrigger>
                            </Calendar.TableCell>
                          ))}
                        </Calendar.TableRow>
                      ))}
                    </Calendar.TableBody>
                  </Calendar.Table>
                </>
              )}
            </Calendar.Context>
          </Calendar.View>
          <Calendar.View view="month">
            <Calendar.Context>
              {api => (
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
                      {api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, id) => (
                        <Calendar.TableRow key={id}>
                          {months.map((month, id) => (
                            <Calendar.TableCell key={id} value={month.value}>
                              <Calendar.TableCellTrigger>{month.label}</Calendar.TableCellTrigger>
                            </Calendar.TableCell>
                          ))}
                        </Calendar.TableRow>
                      ))}
                    </Calendar.TableBody>
                  </Calendar.Table>
                </>
              )}
            </Calendar.Context>
          </Calendar.View>
          <Calendar.View view="year">
            <Calendar.Context>
              {api => (
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
                      {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                        <Calendar.TableRow key={id}>
                          {years.map((year, id) => (
                            <Calendar.TableCell key={id} value={year.value}>
                              <Calendar.TableCellTrigger>{year.label}</Calendar.TableCellTrigger>
                            </Calendar.TableCell>
                          ))}
                        </Calendar.TableRow>
                      ))}
                    </Calendar.TableBody>
                  </Calendar.Table>
                </>
              )}
            </Calendar.Context>
          </Calendar.View>
        </Calendar.Content>
      </Calendar.Positioner>
    </Calendar.Root>
  )
}
