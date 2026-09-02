import type { InputProps } from '@destyler/calendar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCalendarContext } from '../hooks/use-calendar-context'

export interface CalendarInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
export interface CalendarInputProps extends HTMLProps<'input'>, CalendarInputBaseProps {}

export function CalendarInput(props: CalendarInputProps) {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index', 'fixOnBlur'])
  const calendar = useCalendarContext()
  const mergedProps = mergeProps(() => {
    const apiProps = calendar().getInputProps(inputProps)
    return { ...apiProps, readOnly: apiProps.readOnly }
  }, localProps)

  return <ui.input {...mergedProps} />
}
