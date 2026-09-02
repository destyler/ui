import type { ViewProps } from '@destyler/progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressViewBaseProps extends ViewProps, PolymorphicProps<'span'> {}
export interface ProgressViewProps extends HTMLProps<'span'>, ProgressViewBaseProps {}

export function ProgressView(props: ProgressViewProps) {
  const [state, localProps] = createSplitProps<ViewProps>()(props, ['state'])
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getViewProps(state), localProps)

  return <ui.span {...mergedProps} />
}
