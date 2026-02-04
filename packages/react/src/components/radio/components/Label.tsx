import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioLabelBaseProps extends PolymorphicProps {}
export interface RadioLabelProps extends HTMLProps<'label'>, RadioLabelBaseProps {}

export const RadioLabel = forwardRef<HTMLLabelElement, RadioLabelProps>((props, ref) => {
  const Radio = useRadioContext()
  const mergedProps = mergeProps(Radio.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

RadioLabel.displayName = 'RadioLabel'
