import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerSeparatorBaseProps extends PolymorphicProps<'div'> {}
export interface TimerSeparatorProps extends HTMLProps<'div'>, TimerSeparatorBaseProps {}

export function TimerSeparator(props: TimerSeparatorProps) {
  const timer = useTimerContext()

  const mergedProps = mergeProps(() => timer().getSeparatorProps(), props)

  return <ui.div {...mergedProps} />
}
