import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxControlBaseProps extends PolymorphicProps {}
export interface ComboboxControlProps extends HTMLProps<'div'>, ComboboxControlBaseProps {}

export const ComboboxControl = forwardRef<HTMLDivElement, ComboboxControlProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ComboboxControl.displayName = 'ComboboxControl'
