import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxClearTriggerBaseProps extends PolymorphicProps {}
export interface ComboboxClearTriggerProps extends HTMLProps<'button'>, ComboboxClearTriggerBaseProps {}

export const ComboboxClearTrigger = forwardRef<HTMLButtonElement, ComboboxClearTriggerProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

ComboboxClearTrigger.displayName = 'ComboboxClearTrigger'
