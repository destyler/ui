<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableHeadBaseProps extends PolymorphicProps<'thead'> {}
  export interface CalendarTableHeadProps extends Assign<HTMLProps<'thead'>, CalendarTableHeadBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarTablePropsContext } from '../hooks/use-calendar-table-props-context.js'

  const props: CalendarTableHeadProps = $props()

  const calendar = useCalendarContext()
  const tableProps = useCalendarTablePropsContext()

  const mergedProps = $derived(mergeProps(calendar().getTableHeadProps(tableProps()), props))
</script>

<UI as="thead" {...mergedProps} />
