import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioContentBaseProps extends PolymorphicProps<'div'> {}
export interface AspectRatioContentProps
  extends HTMLProps<'div'>,
  AspectRatioContentBaseProps {}

export function AspectRatioContent(props: AspectRatioContentProps) {
  const aspectRatio = useAspectRatioContext()
  const mergedProps = mergeProps(() => aspectRatio().getContentProps(), props)

  return <ui.div {...mergedProps} />
}
