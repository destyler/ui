import type { ItemGroupProps } from '@destyler/select'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef, useId } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSelectContext } from '../hooks/use-select-context'
import { SelectItemGroupPropsProvider } from '../hooks/use-select-item-group-props'

export interface SelectItemGroupBaseProps extends PolymorphicProps {}
export interface SelectItemGroupProps extends HTMLProps<'div'>, SelectItemGroupBaseProps {}

export const SelectItemGroup = forwardRef<HTMLDivElement, SelectItemGroupProps>((props, ref) => {
  const id = useId()
  const [_itemGroupProps, localProps] = createSplitProps<Partial<ItemGroupProps>>()(props, ['id'])
  const itemGroupProps = { id, ..._itemGroupProps }

  const select = useSelectContext()
  const mergedProps = mergeProps(select.getItemGroupProps(itemGroupProps), localProps)

  return (
    <SelectItemGroupPropsProvider value={itemGroupProps}>
      <ui.div {...mergedProps} ref={ref} />
    </SelectItemGroupPropsProvider>
  )
})

SelectItemGroup.displayName = 'SelectItemGroup'
