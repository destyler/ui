import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectIndicatorBaseProps extends PolymorphicProps {}
export interface SelectIndicatorProps extends HTMLProps<'div'>, SelectIndicatorBaseProps {}

export const SelectIndicator = forwardRef<HTMLDivElement, SelectIndicatorProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getIndicatorProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SelectIndicator.displayName = 'SelectIndicator'
