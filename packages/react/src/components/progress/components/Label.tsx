import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressLabelBaseProps extends PolymorphicProps {}
export interface ProgressLabelProps extends HTMLProps<'label'>, ProgressLabelBaseProps {}

export const ProgressLabel = forwardRef<HTMLLabelElement, ProgressLabelProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

ProgressLabel.displayName = 'ProgressLabel'
