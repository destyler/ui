import type { ItemProps } from '@destyler/dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { DynamicItemProvider } from '../hooks/use-dynamic-item-context'
import { DynamicItemPropsProvider } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemBaseProps extends ItemProps, PolymorphicProps {}
export interface DynamicItemProps extends HTMLProps<'div'>, DynamicItemBaseProps {}

export const DynamicItem = forwardRef<HTMLDivElement, DynamicItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index', 'disabled', 'value'])
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getItemProps(itemProps), localProps)
  const dynamicItem = dynamic.getItemState(itemProps)

  return (
    <DynamicItemPropsProvider value={itemProps}>
      <DynamicItemProvider value={dynamicItem}>
        <ui.div {...mergedProps} ref={ref} />
      </DynamicItemProvider>
    </DynamicItemPropsProvider>
  )
})

DynamicItem.displayName = 'DynamicItem'
