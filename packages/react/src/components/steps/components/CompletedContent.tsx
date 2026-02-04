import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsCompletedContentBaseProps extends PolymorphicProps {}
export interface StepsCompletedContentProps extends HTMLProps<'div'>, StepsCompletedContentBaseProps {}

export const StepsCompletedContent = forwardRef<HTMLDivElement, StepsCompletedContentProps>((props, ref) => {
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getContentProps({ index: steps.count }), props)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsCompletedContent.displayName = 'StepsCompletedContent'
