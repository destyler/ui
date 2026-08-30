import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxLabelBaseProps extends PolymorphicProps<'span'> {}
export interface CheckboxLabelProps extends HTMLProps<'span'>, CheckboxLabelBaseProps {}

export function CheckboxLabel(props: CheckboxLabelProps) {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(() => checkbox().getLabelProps(), props)

  return <ui.span {...mergedProps} />
}
