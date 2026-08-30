import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxControlBaseProps extends PolymorphicProps<'div'> {}
export interface CheckboxControlProps extends HTMLProps<'div'>, CheckboxControlBaseProps {}

export function CheckboxControl(props: CheckboxControlProps) {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(() => checkbox().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
