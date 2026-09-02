import type { ItemProps } from '@destyler/select'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSelectContext } from '../hooks/use-select-context'
import { SelectItemProvider } from '../hooks/use-select-item-context'
import { SelectItemPropsProvider } from '../hooks/use-select-item-props-context'

export interface SelectItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface SelectItemProps extends HTMLProps<'div'>, SelectItemBaseProps {}

export function SelectItem(props: SelectItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus'])
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => select().getItemState(itemProps))

  return (
    <SelectItemPropsProvider value={itemProps}>
      <SelectItemProvider value={itemState}>
        <ui.div {...mergedProps} />
      </SelectItemProvider>
    </SelectItemPropsProvider>
  )
}
