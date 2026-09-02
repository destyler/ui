import type { UseProgressProps } from '../hooks/use-progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useProgress } from '../hooks/use-progress'
import { ProgressProvider } from '../hooks/use-progress-context'

export interface ProgressRootBaseProps extends UseProgressProps, PolymorphicProps<'div'> {}
export interface ProgressRootProps extends HTMLProps<'div'>, ProgressRootBaseProps {}

export function ProgressRoot(props: ProgressRootProps) {
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

  const api = useProgress(progressProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <ProgressProvider value={api}>
      <ui.div {...mergedProps} />
    </ProgressProvider>
  )
}
