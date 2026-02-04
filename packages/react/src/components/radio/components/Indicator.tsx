import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioIndicatorBaseProps extends PolymorphicProps {}
export interface RadioIndicatorProps extends HTMLProps<'div'>, RadioIndicatorBaseProps {}

export const RadioIndicator = forwardRef<HTMLDivElement, RadioIndicatorProps>((props, ref) => {
  const Radio = useRadioContext()
  const mergedProps = mergeProps(Radio.getIndicatorProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

RadioIndicator.displayName = 'RadioIndicator'
