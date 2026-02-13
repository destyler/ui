import type { PresetTriggerProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarPresetTriggerBaseProps extends PresetTriggerProps, PolymorphicProps {}
export interface CalendarPresetTriggerProps extends Assign<HTMLProps<'button'>, CalendarPresetTriggerBaseProps> {}

export const CalendarPresetTrigger = forwardRef<HTMLButtonElement, CalendarPresetTriggerProps>((props, ref) => {
  const [presetTriggerProps, localProps] = createSplitProps<PresetTriggerProps>()(props, ['value'])
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getPresetTriggerProps(presetTriggerProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

CalendarPresetTrigger.displayName = 'CalendarPresetTrigger'
