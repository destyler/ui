import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectLabelBaseProps extends PolymorphicProps {}
export interface SelectLabelProps extends HTMLProps<'label'>, SelectLabelBaseProps {}

export const SelectLabel = forwardRef<HTMLLabelElement, SelectLabelProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

SelectLabel.displayName = 'SelectLabel'
