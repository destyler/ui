import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface RadioItemHiddenInputProps
  extends HTMLProps<'input'>,
  RadioItemHiddenInputBaseProps {}

export function RadioItemHiddenInput(props: RadioItemHiddenInputProps) {
  const radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(() => radio().getItemHiddenInputProps(itemProps), props)

  return <ui.input {...mergedProps} />
}
