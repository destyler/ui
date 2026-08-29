<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarYearSelectBaseProps extends PolymorphicProps<'select'> {}
  export interface CalendarYearSelectProps extends Assign<HTMLProps<'select'>, CalendarYearSelectBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarYearSelectProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getYearSelectProps(), props))
</script>

<UI as="select" {...mergedProps}>
  {#each calendar().getYears() as year}
    <option value={year.value}>
      {year.label}
    </option>
  {/each}
</UI>
