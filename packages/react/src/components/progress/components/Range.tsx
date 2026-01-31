import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressRangeBaseProps extends PolymorphicProps {}
export interface ProgressRangeProps extends HTMLProps<'div'>, ProgressRangeBaseProps {}

export const ProgressRange = forwardRef<HTMLDivElement, ProgressRangeProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getRangeProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ProgressRange.displayName = 'ProgressRange'
