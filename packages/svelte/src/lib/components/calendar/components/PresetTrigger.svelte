<script module lang="ts">
  import type { PresetTriggerProps } from '@destyler/calendar'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface CalendarPresetTriggerBaseProps extends PresetTriggerProps, PolymorphicProps<'button'> {}
  export interface CalendarPresetTriggerProps extends Assign<HTMLProps<'button'>, CalendarPresetTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props.js'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'

  const props: CalendarPresetTriggerProps = $props()

  const [presetTriggerProps, localProps] = $derived(createSplitProps<PresetTriggerProps>()(props, ['value']))
  const calendar = useCalendarContext()
  const mergedProps = $derived(mergeProps(calendar().getPresetTriggerProps(presetTriggerProps), localProps))
</script>

<UI as="button" {...mergedProps} />
