<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarRangeTextBaseProps extends PolymorphicProps<'div'> {}
  export interface CalendarRangeTextProps extends Assign<HTMLProps<'div'>, CalendarRangeTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { uniq } from '@destyler/utils'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarRangeTextProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getRangeTextProps(), props))

  const visibleRangeText = $derived.by(() => {
    const { start, end } = calendar().visibleRangeText
    return uniq([start, end]).filter(Boolean).join(' - ')
  })
</script>

<UI as="div" {...mergedProps}>
  {visibleRangeText}
</UI>
