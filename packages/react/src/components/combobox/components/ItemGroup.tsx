import type { ItemGroupProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef, useId } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { ComboboxItemGroupPropsProvider } from '../hooks/use-combobox-item-group-props-context'

export interface ComboboxItemGroupBaseProps extends PolymorphicProps {}
export interface ComboboxItemGroupProps extends HTMLProps<'div'>, ComboboxItemGroupBaseProps {}

export const ComboboxItemGroup = forwardRef<HTMLDivElement, ComboboxItemGroupProps>((props, ref) => {
  const id = useId()
  const [_itemGroupProps, localProps] = createSplitProps<Partial<ItemGroupProps>>()(props, ['id'])
  const itemGroupProps = { id, ..._itemGroupProps }

  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getItemGroupProps(itemGroupProps), localProps)

  return (
    <ComboboxItemGroupPropsProvider value={itemGroupProps}>
      <ui.div {...mergedProps} ref={ref} />
    </ComboboxItemGroupPropsProvider>
  )
})

ComboboxItemGroup.displayName = 'ComboboxItemGroup'
