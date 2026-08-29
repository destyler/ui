<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarViewControlBaseProps extends PolymorphicProps<'div'> {}
  export interface CalendarViewControlProps extends Assign<HTMLProps<'div'>, CalendarViewControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarViewControlProps = $props()

  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = $derived(mergeProps(calendar().getViewControlProps(viewProps()), props))
</script>

<UI as="div" {...mergedProps} />
