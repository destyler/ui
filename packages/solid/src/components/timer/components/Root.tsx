import type { UseTimerProps } from '../hooks/use-timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTimer } from '../hooks/use-timer'
import { TimerProvider } from '../hooks/use-timer-context'

export interface TimerRootBaseProps extends UseTimerProps, PolymorphicProps<'div'> {}
export interface TimerRootProps extends HTMLProps<'div'>, TimerRootBaseProps {}

export function TimerRoot(props: TimerRootProps) {
  const [useTimerProps, localProps] = createSplitProps<UseTimerProps>()(props, [
    'id',
    'ids',
    'autoStart',
    'interval',
    'countdown',
    'startMs',
    'targetMs',
    'onComplete',
    'onTick',
  ])

  const timer = useTimer(useTimerProps)
  const mergedProps = mergeProps(() => timer().getRootProps(), localProps)

  return (
    <TimerProvider value={timer}>
      <ui.div {...mergedProps} />
    </TimerProvider>
  )
}
