import type { ItemProps } from '@destyler/collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { splitItemProps } from '@destyler/collapse'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { Collapsible } from '~/components'
import { useRenderStrategyPropsContext } from '~/utils/render-strategy'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { CollapseItemProvider } from '../hooks/use-collapse-item-context'
import { CollapseItemPropsProvider } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemBaseProps extends ItemProps, PolymorphicProps {}
export interface CollapseItemProps extends HTMLProps<'div'>, CollapseItemBaseProps {}

export const CollapseItem = forwardRef<HTMLDivElement, CollapseItemProps>((props, ref) => {
  const [itemProps, localProps] = splitItemProps(props)
  const collapse = useCollapseContext()
  const renderStrategy = useRenderStrategyPropsContext()
  const mergedProps = mergeProps(collapse.getItemProps(itemProps), localProps)
  const item = collapse.getItemState(itemProps)
  const itemContentProps = collapse.getItemContentProps(itemProps)

  return (
    <CollapseItemPropsProvider value={itemProps}>
      <CollapseItemProvider value={item}>
        <Collapsible.Root
          ref={ref}
          open={item.expanded}
          ids={{ content: itemContentProps.id }}
          {...renderStrategy}
          {...mergedProps}
        />
      </CollapseItemProvider>
    </CollapseItemPropsProvider>
  )
})

CollapseItem.displayName = 'CollapseItem'
