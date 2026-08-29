<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableBaseProps extends PolymorphicProps<'table'> {
    columns?: number
  }
  export interface CalendarTableProps extends Assign<HTMLProps<'table'>, CalendarTableBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { CalendarTablePropsProvider } from '../hooks/use-calendar-table-props-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const { columns, ...localProps }: CalendarTableProps = $props()
  const providedId = $props.id()

  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()

  const tableProps = $derived({ id: providedId, columns, ...viewProps() })
  const mergedProps = $derived(mergeProps(calendar().getTableProps(tableProps), localProps))

  CalendarTablePropsProvider(() => tableProps)
</script>

<UI as="table" {...mergedProps} />
