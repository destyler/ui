import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectControlBaseProps extends PolymorphicProps<'div'> {}
export interface SelectControlProps extends HTMLProps<'div'>, SelectControlBaseProps {}

export function SelectControl(props: SelectControlProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
