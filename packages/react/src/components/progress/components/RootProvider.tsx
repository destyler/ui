import type { UseProgressReturn } from '../hooks/use-progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ProgressProvider } from '../hooks/use-progress-context'

interface RootProviderProps {
  value: UseProgressReturn
}

export interface ProgressRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface ProgressRootProviderProps extends HTMLProps<'div'>, ProgressRootProviderBaseProps {}

export const ProgressRootProvider = forwardRef<HTMLDivElement, ProgressRootProviderProps>((props, ref) => {
  const [{ value: progress }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(progress.getRootProps(), localProps)

  return (
    <ProgressProvider value={progress}>
      <ui.div {...mergedProps} ref={ref} />
    </ProgressProvider>
  )
})

ProgressRootProvider.displayName = 'ProgressRootProvider'
