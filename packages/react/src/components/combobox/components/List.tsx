import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxListBaseProps extends PolymorphicProps {}
export interface ComboboxListProps extends HTMLProps<'div'>, ComboboxListBaseProps {}

export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>((props, ref) => {
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(combobox.getListProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ComboboxList.displayName = 'ComboboxList'
