import type { ItemProps } from '@destyler/steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useStepsContext } from '../hooks/use-steps-context'
import { StepsItemProvider } from '../hooks/use-steps-item-context'
import { StepsItemPropsProvider } from '../hooks/use-steps-item-props-context'

export interface StepsItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface StepsItemProps extends HTMLProps<'div'>, StepsItemBaseProps {}

export function StepsItem(props: StepsItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index'])
  const steps = useStepsContext()
  const mergedProps = mergeProps(() => steps().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => steps().getItemState(itemProps))

  return (
    <StepsItemPropsProvider value={itemProps}>
      <StepsItemProvider value={itemState}>
        <ui.div {...mergedProps} />
      </StepsItemProvider>
    </StepsItemPropsProvider>
  )
}
