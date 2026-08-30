import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerControlBaseProps extends PolymorphicProps<'div'> {}
export interface TimerControlProps extends HTMLProps<'div'>, TimerControlBaseProps {}

export function TimerControl(props: TimerControlProps) {
  const timer = useTimerContext()
  const mergedProps = mergeProps(() => timer().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
