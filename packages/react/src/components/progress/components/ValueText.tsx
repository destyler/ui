import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressValueTextBaseProps extends PolymorphicProps {}
export interface ProgressValueTextProps extends HTMLProps<'span'>, ProgressValueTextBaseProps {}

export const ProgressValueText = forwardRef<HTMLSpanElement, ProgressValueTextProps>((props, ref) => {
  const { children, ...rest } = props
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getValueTextProps(), rest)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {children || progress.percentAsString}
    </ui.span>
  )
})

ProgressValueText.displayName = 'ProgressValueText'
