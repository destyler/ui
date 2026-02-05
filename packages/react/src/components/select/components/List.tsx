import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectListBaseProps extends PolymorphicProps {}
export interface SelectListProps extends HTMLProps<'div'>, SelectListBaseProps {}

export const SelectList = forwardRef<HTMLDivElement, SelectListProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getListProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SelectList.displayName = 'SelectList'
