import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemGroupPropsContext } from '../hooks/use-combobox-item-group-props-context'

export interface ComboboxItemGroupLabelBaseProps extends PolymorphicProps {}
export interface ComboboxItemGroupLabelProps extends HTMLProps<'div'>, ComboboxItemGroupLabelBaseProps {}

export const ComboboxItemGroupLabel = forwardRef<HTMLDivElement, ComboboxItemGroupLabelProps>((props, ref) => {
  const combobox = useComboboxContext()
  const itemGroupProps = useComboboxItemGroupPropsContext()
  const mergedProps = mergeProps(combobox.getItemGroupLabelProps({ htmlFor: itemGroupProps.id }), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ComboboxItemGroupLabel.displayName = 'ComboboxItemGroupLabel'
