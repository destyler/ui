<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarTableBodyBaseProps extends PolymorphicProps<'tbody'> {}
  export interface CalendarTableBodyProps extends Assign<HTMLProps<'tbody'>, CalendarTableBodyBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarTableBodyProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getTableBodyProps(), props))
</script>

<UI as="tbody" {...mergedProps} />
