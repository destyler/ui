import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectValueTextBaseProps extends PolymorphicProps {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string
}
export interface SelectValueTextProps extends HTMLProps<'span'>, SelectValueTextBaseProps {}

export const SelectValueText = forwardRef<HTMLSpanElement, SelectValueTextProps>((props, ref) => {
  const { children, placeholder, ...localprops } = props
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getValueTextProps(), localprops)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {children || select.valueAsString || placeholder}
    </ui.span>
  )
})

SelectValueText.displayName = 'SelectValueText'
