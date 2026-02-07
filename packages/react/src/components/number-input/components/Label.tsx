import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputLabelBaseProps extends PolymorphicProps {}
export interface NumberInputLabelProps extends HTMLProps<'label'>, NumberInputLabelBaseProps {}

export const NumberInputLabel = forwardRef<HTMLLabelElement, NumberInputLabelProps>((props, ref) => {
  const numberInput = useNumberInputContext()
  const mergedProps = mergeProps(numberInput.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

NumberInputLabel.displayName = 'NumberInputLabel'
