import type { ItemGroupProps } from '@destyler/select'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSelectContext } from '../hooks/use-select-context'
import { SelectItemGroupPropsProvider } from '../hooks/use-select-item-group-props-context'

export interface SelectItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemGroupProps extends HTMLProps<'div'>, SelectItemGroupBaseProps {}

export function SelectItemGroup(props: SelectItemGroupProps) {
  const [_itemGroupProps, localProps] = createSplitProps<Partial<ItemGroupProps>>()(props, ['id'])
  const select = useSelectContext()
  const itemGroupProps = mergeProps({ id: createUniqueId() }, _itemGroupProps)
  const mergedProps = mergeProps(() => select().getItemGroupProps(itemGroupProps), localProps)

  return (
    <SelectItemGroupPropsProvider value={itemGroupProps}>
      <ui.div {...mergedProps} />
    </SelectItemGroupPropsProvider>
  )
}
