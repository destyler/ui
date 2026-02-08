import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxLabelBaseProps extends PolymorphicProps {}
export interface ComboboxLabelProps extends HTMLProps<'label'>, ComboboxLabelBaseProps {}

export const ComboboxLabel = forwardRef<HTMLLabelElement, ComboboxLabelProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

ComboboxLabel.displayName = 'ComboboxLabel'
