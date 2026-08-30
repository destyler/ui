import type { UseSplitterProps } from '../hooks/use-splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSplitter } from '../hooks/use-splitter'
import { SplitterProvider } from '../hooks/use-splitter-context'

export interface SplitterRootBaseProps extends UseSplitterProps, PolymorphicProps<'div'> {}
export interface SplitterRootProps extends HTMLProps<'div'>, SplitterRootBaseProps {}

export function SplitterRoot(props: SplitterRootProps) {
  const [useSplitterProps, localProps] = createSplitProps<UseSplitterProps>()(props, [
    'defaultSize',
    'id',
    'ids',
    'onSizeChange',
    'onSizeChangeEnd',
    'orientation',
    'size',
  ])
  const api = useSplitter(useSplitterProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <SplitterProvider value={api}>
      <ui.div {...mergedProps} />
    </SplitterProvider>
  )
}
