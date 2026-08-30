import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'

export interface RadioIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface RadioIndicatorProps extends HTMLProps<'div'>, RadioIndicatorBaseProps {}

export function RadioIndicator(props: RadioIndicatorProps) {
  const radio = useRadioContext()
  const mergedProps = mergeProps(() => radio().getIndicatorProps(), props)

  return <ui.div {...mergedProps} />
}
