import type { ItemProps } from '@destyler/steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useStepsContext } from '../hooks/use-steps-context'
import { StepsItemProvider } from '../hooks/use-steps-item-context'
import { StepsItemPropsProvider } from '../hooks/use-steps-item-props-context'

export interface StepsItemBaseProps extends ItemProps, PolymorphicProps {}
export interface StepsItemProps extends HTMLProps<'div'>, StepsItemBaseProps {}

export const StepsItem = forwardRef<HTMLDivElement, StepsItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index'])
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getItemProps(itemProps), localProps)
  const itemState = steps.getItemState(itemProps)

  return (
    <StepsItemPropsProvider value={itemProps}>
      <StepsItemProvider value={itemState}>
        <ui.div {...mergedProps} ref={ref} />
      </StepsItemProvider>
    </StepsItemPropsProvider>
  )
})

StepsItem.displayName = 'StepsItem'
