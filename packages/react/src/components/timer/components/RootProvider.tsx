import type { UseTimerReturn } from '../hooks/use-timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { TimerProvider } from '../hooks/use-timer-context'

interface RootProviderProps {
  value: UseTimerReturn
}

export interface TimerRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface TimerRootProviderProps extends HTMLProps<'div'>, TimerRootProviderBaseProps {}

export const TimerRootProvider = forwardRef<HTMLDivElement, TimerRootProviderProps>((props, ref) => {
  const [{ value: timer }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(timer.getRootProps(), localProps)

  return (
    <TimerProvider value={timer}>
      <ui.div {...mergedProps} ref={ref} />
    </TimerProvider>
  )
})

TimerRootProvider.displayName = 'TimerRootProvider'
