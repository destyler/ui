<script module lang="ts">
  import type { ViewProps } from '@destyler/calendar'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarViewBaseProps extends Required<ViewProps>, PolymorphicProps<'div'> {}
  export interface CalendarViewProps extends Assign<HTMLProps<'div'>, CalendarViewBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props.js'
  import { UI } from '../../factory/index.js'
  import { calendarAnatomy } from '../anatomy.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { CalendarViewPropsProvider } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarViewProps = $props()

  const [viewProps, localProps] = $derived(createSplitProps<Required<ViewProps>>()(props, ['view']))
  const calendar = useCalendarContext()
  const mergedProps = $derived(
    mergeProps(calendarAnatomy.build().view.attrs, { hidden: calendar().view !== viewProps.view }, localProps),
  )

  CalendarViewPropsProvider(() => viewProps)
</script>

<UI as="div" {...mergedProps} />
