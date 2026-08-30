import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemControlBaseProps extends PolymorphicProps<'div'> {}
export interface RadioItemControlProps
  extends HTMLProps<'div'>,
  RadioItemControlBaseProps {}

export function RadioItemControl(props: RadioItemControlProps) {
  const radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(() => radio().getItemControlProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
