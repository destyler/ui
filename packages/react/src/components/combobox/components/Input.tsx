import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxInputBaseProps extends PolymorphicProps {}
export interface ComboboxInputProps extends HTMLProps<'input'>, ComboboxInputBaseProps {}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

ComboboxInput.displayName = 'ComboboxInput'
