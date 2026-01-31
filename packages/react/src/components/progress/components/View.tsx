import type { ViewProps } from '@destyler/progress'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressViewBaseProps extends ViewProps, PolymorphicProps {}
export interface ProgressViewProps extends HTMLProps<'span'>, ProgressViewBaseProps {}

export const ProgressView = forwardRef<HTMLSpanElement, ProgressViewProps>((props, ref) => {
  const [viewProps, localProps] = createSplitProps<ViewProps>()(props, ['state'])
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getViewProps(viewProps), localProps)

  return <ui.span {...mergedProps} ref={ref} />
})

ProgressView.displayName = 'ProgressView'
