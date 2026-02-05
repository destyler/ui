import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectControlBaseProps extends PolymorphicProps {}
export interface SelectControlProps extends HTMLProps<'div'>, SelectControlBaseProps {}

export const SelectControl = forwardRef<HTMLDivElement, SelectControlProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SelectControl.displayName = 'SelectControl'
