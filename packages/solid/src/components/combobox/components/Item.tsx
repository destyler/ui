import type { ItemProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { ComboboxItemProvider } from '../hooks/use-combobox-item-context'
import { ComboboxItemPropsProvider } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface ComboboxItemProps extends HTMLProps<'div'>, ComboboxItemBaseProps {}

export function ComboboxItem(props: ComboboxItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus'])
  const api = useComboboxContext()
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => api().getItemState(itemProps))

  return (
    <ComboboxItemPropsProvider value={itemProps}>
      <ComboboxItemProvider value={itemState}>
        <ui.div {...mergedProps} />
      </ComboboxItemProvider>
    </ComboboxItemPropsProvider>
  )
}
