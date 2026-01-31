import type { UseProgressProps } from '../hooks/use-progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useProgress } from '../hooks/use-progress'
import { ProgressProvider } from '../hooks/use-progress-context'

export interface ProgressRootBaseProps extends UseProgressProps, PolymorphicProps {}
export interface ProgressRootProps extends Assign<HTMLProps<'div'>, ProgressRootBaseProps> {}

export const ProgressRoot = forwardRef<HTMLDivElement, ProgressRootProps>((props, ref) => {
  const [progressProps, localProps] = createSplitProps<UseProgressProps>()(props, [
    'defaultValue',
    'id',
    'ids',
    'max',
    'min',
    'onValueChange',
    'orientation',
    'translations',
    'value',
  ])
  const progress = useProgress(progressProps)
  const mergedProps = mergeProps(progress.getRootProps(), localProps)

  return (
    <ProgressProvider value={progress}>
      <ui.div {...mergedProps} ref={ref} />
    </ProgressProvider>
  )
})

ProgressRoot.displayName = 'ProgressRoot'
