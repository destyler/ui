import type { UseTimerReturn } from '../hooks/use-timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { TimerProvider } from '../hooks/use-timer-context'

interface RootProviderProps {
  value: UseTimerReturn
}

export interface TimerRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
export interface TimerRootProviderProps extends HTMLProps<'div'>, TimerRootProviderBaseProps {}

export function TimerRootProvider(props: TimerRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const timer = () => providerProps.value()
  const mergedProps = mergeProps(() => timer().getRootProps(), localProps)

  return (
    <TimerProvider value={timer}>
      <ui.div {...mergedProps} />
    </TimerProvider>
  )
}
