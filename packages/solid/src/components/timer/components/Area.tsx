import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerAreaBaseProps extends PolymorphicProps<'div'> {}
export interface TimerAreaProps extends HTMLProps<'div'>, TimerAreaBaseProps {}

export function TimerArea(props: TimerAreaProps) {
  const timer = useTimerContext()
  const mergedProps = mergeProps(() => timer().getAreaProps(), props)

  return <ui.div {...mergedProps} />
}
