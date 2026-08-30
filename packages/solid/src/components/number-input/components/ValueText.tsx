import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface NumberInputValueTextProps
  extends HTMLProps<'span'>,
  NumberInputValueTextBaseProps {}

export function NumberInputValueText(props: NumberInputValueTextProps) {
  const numberInput = useNumberInputContext()
  const mergedProps = mergeProps(() => numberInput().getValueTextProps(), props)

  return <ui.span {...mergedProps} />
}
