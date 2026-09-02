import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface SelectClearTriggerProps extends HTMLProps<'button'>, SelectClearTriggerBaseProps {}

export function SelectClearTrigger(props: SelectClearTriggerProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
