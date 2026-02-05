import type { ItemProps } from '@destyler/select'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSelectContext } from '../hooks/use-select-context'
import { SelectItemProvider } from '../hooks/use-select-item-context'
import { SelectItemPropsProvider } from '../hooks/use-select-item-props-context'

export interface SelectItemBaseProps extends ItemProps, PolymorphicProps {}
export interface SelectItemProps extends HTMLProps<'div'>, SelectItemBaseProps {}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus'])
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getItemProps(itemProps), localProps)
  const itemState = select.getItemState(itemProps)

  return (
    <SelectItemPropsProvider value={itemProps}>
      <SelectItemProvider value={itemState}>
        <ui.div {...mergedProps} ref={ref} />
      </SelectItemProvider>
    </SelectItemPropsProvider>
  )
})

SelectItem.displayName = 'SelectItem'
