<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CalendarPrevTriggerProps extends Assign<HTMLProps<'button'>, CalendarPrevTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { useCalendarViewPropsContext } from '../hooks/use-calendar-view-props-context.js'

  const props: CalendarPrevTriggerProps = $props()

  const calendar = useCalendarContext()
  const viewProps = useCalendarViewPropsContext()
  const mergedProps = $derived(mergeProps(calendar().getPrevTriggerProps(viewProps()), props))
</script>

<UI as="button" {...mergedProps} />
