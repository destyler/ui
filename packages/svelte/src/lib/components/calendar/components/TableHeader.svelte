<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableHeaderBaseProps extends PolymorphicProps<'th'> {}
  export interface CalendarTableHeaderProps extends Assign<HTMLProps<'th'>, CalendarTableHeaderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context.js'

  const props: CalendarTableHeaderProps = $props()

  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()

  const mergedProps = $derived(mergeProps(calendar().getTableHeaderProps(tableProps()), props))
</script>

<UI as="th" {...mergedProps} />
