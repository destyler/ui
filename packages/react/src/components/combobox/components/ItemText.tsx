import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemTextBaseProps extends PolymorphicProps {}
export interface ComboboxItemTextProps extends HTMLProps<'span'>, ComboboxItemTextBaseProps {}

export const ComboboxItemText = forwardRef<HTMLDivElement, ComboboxItemTextProps>((props, ref) => {
  const combobox = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = mergeProps(combobox.getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

ComboboxItemText.displayName = 'ComboboxItemText'
