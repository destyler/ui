import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectListBaseProps extends PolymorphicProps<'div'> {}
export interface SelectListProps extends HTMLProps<'div'>, SelectListBaseProps {}

export function SelectList(props: SelectListProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getListProps(), props)

  return <ui.div {...mergedProps} />
}
