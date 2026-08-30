import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface NumberInputLabelProps extends HTMLProps<'label'>, NumberInputLabelBaseProps {}

export function NumberInputLabel(props: NumberInputLabelProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
