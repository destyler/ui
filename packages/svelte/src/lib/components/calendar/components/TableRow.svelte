<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableRowBaseProps extends PolymorphicProps<'tr'> {}
  export interface CalendarTableRowProps extends Assign<HTMLProps<'tr'>, CalendarTableRowBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context.js'

  const props: CalendarTableRowProps = $props()

  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()

  const mergedProps = $derived(mergeProps(calendar().getTableRowProps(tableProps()), props))
</script>

<UI as="tr" {...mergedProps} />
