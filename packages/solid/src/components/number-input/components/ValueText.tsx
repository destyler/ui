import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface NumberInputValueTextProps
  extends HTMLProps<'span'>,
  NumberInputValueTextBaseProps {}

export function NumberInputValueText(props: NumberInputValueTextProps) {
  const [localProps, restProps] = splitProps(props, ['children'])
  const numberInput = useNumberInputContext()
  const mergedProps = mergeProps(() => numberInput().getValueTextProps(), restProps)

  return <ui.span {...mergedProps}>{localProps.children ?? numberInput().value}</ui.span>
}
