import type { ItemProps } from '@destyler/steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsContentBaseProps extends PolymorphicProps, ItemProps {}
export interface StepsContentProps extends HTMLProps<'div'>, StepsContentBaseProps {}

export const StepsContent = forwardRef<HTMLDivElement, StepsContentProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index'])
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getContentProps(itemProps), localProps)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsContent.displayName = 'StepsContent'
