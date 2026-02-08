import type { ItemProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { ComboboxItemProvider } from '../hooks/use-combobox-item-context'
import { ComboboxItemPropsProvider } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemBaseProps extends ItemProps, PolymorphicProps {}
export interface ComboboxItemProps extends HTMLProps<'div'>, ComboboxItemBaseProps {}

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus'])
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getItemProps(itemProps), localProps)
  const itemState = combobox.getItemState(itemProps)

  return (
    <ComboboxItemPropsProvider value={itemProps}>
      <ComboboxItemProvider value={itemState}>
        <ui.div {...mergedProps} ref={ref} />
      </ComboboxItemProvider>
    </ComboboxItemPropsProvider>
  )
})

ComboboxItem.displayName = 'ComboboxItem'
