import type { UseProgressReturn } from '../hooks/use-progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ProgressProvider } from '../hooks/use-progress-context'

interface RootProviderProps {
  value: UseProgressReturn
}

export interface ProgressRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface ProgressRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  ProgressRootProviderBaseProps {}

export function ProgressRootProvider(props: ProgressRootProviderProps) {
  const [{ value: progress }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => progress().getRootProps(), localProps)

  return (
    <ProgressProvider value={progress}>
      <ui.div {...mergedProps} />
    </ProgressProvider>
  )
}
