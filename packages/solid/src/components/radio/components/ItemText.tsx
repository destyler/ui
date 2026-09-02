import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface RadioItemTextProps extends HTMLProps<'span'>, RadioItemTextBaseProps {}

export function RadioItemText(props: RadioItemTextProps) {
  const radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(() => radio().getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} />
}
