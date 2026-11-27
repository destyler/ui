<script lang="ts">
  import type { CalendarFixtureMode } from '../../../../utils/test/browser-smoke/suite'
  import type { CalendarValueChangeDetails, DateValue } from '../lib/components/calendar'
  import { Calendar, parseDate } from '../lib/components/calendar'

  let { mode }: { mode: CalendarFixtureMode } = $props()
  const seed = [parseDate('2026-01-15')]
  let value = $state<DateValue[]>(seed)
  let events = $state<string[]>([])
  const inline = $derived(mode.startsWith('inline'))
  const controlled = $derived(mode === 'inline-controlled')
  const modeProps = $derived(mode === 'popup-default' ? {} : { inline })
  function onValueChange(details: CalendarValueChangeDetails) {
    events.push(details.value.map(date => date.toString()).join(','))
    if (controlled)
      value = details.value
  }
</script>

{#snippet grid()}
  <Calendar.View view="day">
    <Calendar.Context>
      {#snippet render(api)}
        <Calendar.Table>
          <Calendar.TableHead><Calendar.TableRow>
            {#each api().weekDays as day}<Calendar.TableHeader>{day.short}</Calendar.TableHeader>{/each}
          </Calendar.TableRow></Calendar.TableHead>
          <Calendar.TableBody>
            {#each api().weeks as week}
              <Calendar.TableRow>
                {#each week as day}
                  <Calendar.TableCell value={day}><Calendar.TableCellTrigger>{day.day}</Calendar.TableCellTrigger></Calendar.TableCell>
                {/each}
              </Calendar.TableRow>
            {/each}
          </Calendar.TableBody>
        </Calendar.Table>
        <output data-testid="calendar-value">{api().value.map(date => date.toString()).join(',')}</output>
      {/snippet}
    </Calendar.Context>
  </Calendar.View>
{/snippet}

<Calendar.Root {...modeProps} defaultValue={seed} value={controlled ? value : undefined} {onValueChange}>
  <output data-testid="calendar-events">{JSON.stringify(events)}</output>
  {#if controlled}<output data-testid="calendar-model">{value.map(date => date.toString()).join(',')}</output>{/if}
  {#if inline}
    <Calendar.ClearTrigger>Clear</Calendar.ClearTrigger>
    {@render grid()}
  {:else}
    <Calendar.Label>Date</Calendar.Label>
    <Calendar.Control>
      <Calendar.Input />
      <Calendar.Trigger>Open calendar</Calendar.Trigger>
    </Calendar.Control>
    <Calendar.Positioner>
      <Calendar.Content>{@render grid()}</Calendar.Content>
    </Calendar.Positioner>
  {/if}
</Calendar.Root>
