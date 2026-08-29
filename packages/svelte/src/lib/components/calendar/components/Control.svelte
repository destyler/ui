<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarControlBaseProps extends PolymorphicProps<'div'> {}
  export interface CalendarControlProps extends Assign<HTMLProps<'div'>, CalendarControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarControlProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
