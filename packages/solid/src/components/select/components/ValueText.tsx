import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { splitProps } from 'solid-js'
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
  const [localProps, restProps] = splitProps(props, ['children', 'placeholder'])
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getValueTextProps(), restProps)

  return (
    <ui.span {...mergedProps}>
      {localProps.children ?? (select().valueAsString || localProps.placeholder)}
    </ui.span>
  )
}
