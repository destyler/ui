import type { ItemProps } from '@destyler/collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { Collapsible } from '~/components/collapsible'
import { createSplitProps } from '~/utils/create-split-props'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { CollapseItemProvider } from '../hooks/use-collapse-item-context'
import { CollapseItemPropsProvider } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface CollapseItemProps extends HTMLProps<'div'>, CollapseItemBaseProps {}

export function CollapseItem(props: CollapseItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'disabled'])
  const collapse = useCollapseContext()
  const renderStrategyProps = useRenderStrategyContext()
  const mergedProps = mergeProps(() => collapse().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => collapse().getItemState(itemProps))
  const itemContentProps = createMemo(() => collapse().getItemContentProps(itemProps))

  return (
    <CollapseItemPropsProvider value={itemProps}>
      <CollapseItemProvider value={itemState}>
        <Collapsible.Root
          open={itemState().expanded}
          ids={{ content: itemContentProps().id }}
          {...renderStrategyProps}
          {...mergedProps}
        />
      </CollapseItemProvider>
    </CollapseItemPropsProvider>
  )
}
