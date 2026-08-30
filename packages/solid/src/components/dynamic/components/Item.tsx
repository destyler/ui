import type { ItemProps } from '@destyler/dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { DynamicItemProvider } from '../hooks/use-dynamic-item-context'
import { DynamicItemPropsProvider } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface DynamicItemProps extends HTMLProps<'div'>, DynamicItemBaseProps {}

export function DynamicItem(props: DynamicItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'disabled',
    'index',
    'value',
  ])
  const api = useDynamicContext()
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => api().getItemState(itemProps))

  return (
    <DynamicItemPropsProvider value={itemProps}>
      <DynamicItemProvider value={itemState}>
        <ui.div {...mergedProps} />
      </DynamicItemProvider>
    </DynamicItemPropsProvider>
  )
}
