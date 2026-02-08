import type { TriggerProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxTriggerBaseProps extends TriggerProps, PolymorphicProps {}
export interface ComboboxTriggerProps extends HTMLProps<'button'>, ComboboxTriggerBaseProps {}

export const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

ComboboxTrigger.displayName = 'ComboboxTrigger'
