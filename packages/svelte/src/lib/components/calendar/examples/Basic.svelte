<script module lang="ts">
  import type { UsePresenceProps } from '../../presence'

  export interface BasicProps extends UsePresenceProps {}
</script>

<script lang="ts">
  import { Calendar } from '../index'

  let { ...props }: BasicProps = $props()
</script>

{#snippet calendarViews()}
  <Calendar.YearSelect />
  <Calendar.MonthSelect />
  <Calendar.View view="day">
    <Calendar.Context>
      {#snippet render(calendar)}
        <Calendar.ViewControl>
          <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
          <Calendar.ViewTrigger><Calendar.RangeText /></Calendar.ViewTrigger>
          <Calendar.NextTrigger>Next</Calendar.NextTrigger>
        </Calendar.ViewControl>
        <Calendar.Table>
          <Calendar.TableHead><Calendar.TableRow>
            {#each calendar().weekDays as weekDay}<Calendar.TableHeader>{weekDay.short}</Calendar.TableHeader>{/each}
          </Calendar.TableRow></Calendar.TableHead>
          <Calendar.TableBody>
            {#each calendar().weeks as week}<Calendar.TableRow>
              {#each week as day}<Calendar.TableCell value={day}><Calendar.TableCellTrigger>{day.day}</Calendar.TableCellTrigger></Calendar.TableCell>{/each}
            </Calendar.TableRow>{/each}
          </Calendar.TableBody>
        </Calendar.Table>
      {/snippet}
    </Calendar.Context>
  </Calendar.View>
  <Calendar.View view="month">
    <Calendar.Context>
      {#snippet render(calendar)}
        <Calendar.ViewControl><Calendar.PrevTrigger>Prev</Calendar.PrevTrigger><Calendar.ViewTrigger><Calendar.RangeText /></Calendar.ViewTrigger><Calendar.NextTrigger>Next</Calendar.NextTrigger></Calendar.ViewControl>
        <Calendar.Table><Calendar.TableBody>
          {#each calendar().getMonthsGrid({ columns: 4, format: 'short' }) as months}<Calendar.TableRow>
            {#each months as month}<Calendar.TableCell value={month.value}><Calendar.TableCellTrigger>{month.label}</Calendar.TableCellTrigger></Calendar.TableCell>{/each}
          </Calendar.TableRow>{/each}
        </Calendar.TableBody></Calendar.Table>
      {/snippet}
    </Calendar.Context>
  </Calendar.View>
  <Calendar.View view="year">
    <Calendar.Context>
      {#snippet render(calendar)}
        <Calendar.ViewControl><Calendar.PrevTrigger>Prev</Calendar.PrevTrigger><Calendar.ViewTrigger><Calendar.RangeText /></Calendar.ViewTrigger><Calendar.NextTrigger>Next</Calendar.NextTrigger></Calendar.ViewControl>
        <Calendar.Table><Calendar.TableBody>
          {#each calendar().getYearsGrid({ columns: 4 }) as years}<Calendar.TableRow>
            {#each years as year}<Calendar.TableCell value={year.value}><Calendar.TableCellTrigger>{year.label}</Calendar.TableCellTrigger></Calendar.TableCell>{/each}
          </Calendar.TableRow>{/each}
        </Calendar.TableBody></Calendar.Table>
      {/snippet}
    </Calendar.Context>
  </Calendar.View>
{/snippet}

<Calendar.Root {...props}>
  <Calendar.Label>Label</Calendar.Label>
  <Calendar.Control>
    <Calendar.Input />
    <Calendar.Context>
      {#snippet render(calendar)}
        <Calendar.Trigger>{calendar().open ? 'Close calendar' : 'Open calendar'}</Calendar.Trigger>
      {/snippet}
    </Calendar.Context>
    <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
  </Calendar.Control>
  <Calendar.PresetTrigger value="last7Days">Last 7 days</Calendar.PresetTrigger>
  <Calendar.Positioner data-testid="positioner">
    <Calendar.Content>
      {@render calendarViews()}
    </Calendar.Content>
  </Calendar.Positioner>
</Calendar.Root>
