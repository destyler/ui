import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioLabelBaseProps extends PolymorphicProps<'label'> {}
export interface RadioLabelProps extends HTMLProps<'label'>, RadioLabelBaseProps {}

export function RadioLabel(props: RadioLabelProps) {
  const radio = useRadioContext()
  const mergedProps = mergeProps(() => radio().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
