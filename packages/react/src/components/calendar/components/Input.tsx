import type { InputProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarInputBaseProps extends InputProps, PolymorphicProps {}
export interface CalendarInputProps extends HTMLProps<'input'>, CalendarInputBaseProps {}

export const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>((props, ref) => {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index', 'fixOnBlur'])
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(calendar.getInputProps(inputProps), localProps)

  return <ui.input {...mergedProps} ref={ref} />
})

CalendarInput.displayName = 'CalendarInput'
