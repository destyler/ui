import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemInputBaseProps extends PolymorphicProps<'input'> {}
export interface DynamicItemInputProps extends HTMLProps<'input'>, DynamicItemInputBaseProps {}

export function DynamicItemInput(props: DynamicItemInputProps) {
  const api = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(() => api().getItemInputProps(itemProps), props)

  return <ui.input {...mergedProps} />
}
