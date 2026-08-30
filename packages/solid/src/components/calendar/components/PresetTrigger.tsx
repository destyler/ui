import type { PresetTriggerProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarPresetTriggerBaseProps
  extends PresetTriggerProps,
  PolymorphicProps<'button'> {}
export interface CalendarPresetTriggerProps
  extends Assign<HTMLProps<'button'>, CalendarPresetTriggerBaseProps> {}

export function CalendarPresetTrigger(props: CalendarPresetTriggerProps) {
  const [presetTriggerProps, localProps] = createSplitProps<PresetTriggerProps>()(props, ['value'])
  const api = useCalendarContext()
  const mergedProps = mergeProps(() => api().getPresetTriggerProps(presetTriggerProps), localProps)

  return <ui.button {...mergedProps} />
}
