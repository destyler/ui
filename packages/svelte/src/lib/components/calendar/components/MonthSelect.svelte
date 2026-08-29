<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarMonthSelectBaseProps extends PolymorphicProps<'select'> {}
  export interface CalendarMonthSelectProps extends Assign<HTMLProps<'select'>, CalendarMonthSelectBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarMonthSelectProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getMonthSelectProps(), props))
</script>

<UI as="select" {...mergedProps}>
  {#each calendar().getMonths() as month}
    <option value={month.value}>
      {month.label}
    </option>
  {/each}
</UI>
