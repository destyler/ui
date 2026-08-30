import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectLabelBaseProps extends PolymorphicProps<'label'> {}
export interface SelectLabelProps extends HTMLProps<'label'>, SelectLabelBaseProps {}

export function SelectLabel(props: SelectLabelProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
