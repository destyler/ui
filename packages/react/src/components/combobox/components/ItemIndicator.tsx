import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemIndicatorBaseProps extends PolymorphicProps {}
export interface ComboboxItemIndicatorProps extends HTMLProps<'div'>, ComboboxItemIndicatorBaseProps {}

export const ComboboxItemIndicator = forwardRef<HTMLDivElement, ComboboxItemIndicatorProps>((props, ref) => {
  const combobox = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = mergeProps(combobox.getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ComboboxItemIndicator.displayName = 'ComboboxItemIndicator'
