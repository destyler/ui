import type { UseTimerProps } from '../hooks/use-timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTimer } from '../hooks/use-timer'
import { TimerProvider } from '../hooks/use-timer-context'

export interface TimerRootBaseProps extends UseTimerProps, PolymorphicProps {}

export interface TimerRootProps extends HTMLProps<'div'>, TimerRootBaseProps {}

export const TimerRoot = forwardRef<HTMLDivElement, TimerRootProps>((props, ref) => {
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
  const mergedProps = mergeProps(timer.getRootProps(), localProps)

  return (
    <TimerProvider value={timer}>
      <ui.div {...mergedProps} ref={ref} />
    </TimerProvider>
  )
})

TimerRoot.displayName = 'TimerRoot'
