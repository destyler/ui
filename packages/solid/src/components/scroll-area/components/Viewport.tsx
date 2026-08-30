import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaViewportBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaViewportProps
  extends HTMLProps<'div'>,
  ScrollAreaViewportBaseProps {}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(() => scrollArea().getViewportProps(), props)

  return <ui.div {...mergedProps} />
}
