import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetLegendBaseProps extends PolymorphicProps {}
export interface FieldsetLegendProps extends HTMLProps<'legend'>, FieldsetLegendBaseProps {}

export const FieldsetLegend = forwardRef<HTMLLegendElement, FieldsetLegendProps>((props, ref) => {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(fieldset.getLegendProps(), props)

  return <ui.legend {...mergedProps} ref={ref} />
})

FieldsetLegend.displayName = 'FieldsetLegend'
