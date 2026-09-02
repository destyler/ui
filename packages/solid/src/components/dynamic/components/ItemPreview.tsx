import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemPreviewBaseProps extends PolymorphicProps<'div'> {}
export interface DynamicItemPreviewProps
  extends HTMLProps<'div'>,
  DynamicItemPreviewBaseProps {}

export function DynamicItemPreview(props: DynamicItemPreviewProps) {
  const api = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(() => api().getItemPreviewProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
