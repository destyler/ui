import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string
}
export interface SelectValueTextProps extends HTMLProps<'span'>, SelectValueTextBaseProps {}

export function SelectValueText(props: SelectValueTextProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getValueTextProps(), props)

  return <ui.span {...mergedProps}>{select().valueAsString || props.placeholder}</ui.span>
}
