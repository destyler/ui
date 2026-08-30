import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface SelectIndicatorProps extends HTMLProps<'div'>, SelectIndicatorBaseProps {}

export function SelectIndicator(props: SelectIndicatorProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getIndicatorProps(), props)

  return <ui.div {...mergedProps} />
}
