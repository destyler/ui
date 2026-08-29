<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface CalendarLabelProps extends Assign<HTMLProps<'label'>, CalendarLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarLabelProps = $props()

  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
