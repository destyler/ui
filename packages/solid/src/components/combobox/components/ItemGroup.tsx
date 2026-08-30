import type { ItemGroupProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { ComboboxItemGroupPropsProvider } from '../hooks/use-combobox-item-group-props-context'

export interface ComboboxItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemGroupProps extends HTMLProps<'div'>, ComboboxItemGroupBaseProps {}

export function ComboboxItemGroup(props: ComboboxItemGroupProps) {
  const [_itemGroupProps, localProps] = createSplitProps<Partial<ItemGroupProps>>()(props, ['id'])
  const combobox = useComboboxContext()
  const itemGroupProps = mergeProps({ id: createUniqueId() }, _itemGroupProps)
  const mergedProps = mergeProps(() => combobox().getItemGroupProps(itemGroupProps), localProps)

  return (
    <ComboboxItemGroupPropsProvider value={itemGroupProps}>
      <ui.div {...mergedProps} />
    </ComboboxItemGroupPropsProvider>
  )
}
