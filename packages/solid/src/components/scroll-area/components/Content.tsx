import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaContentBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaContentProps
  extends HTMLProps<'div'>,
  ScrollAreaContentBaseProps {}

export function ScrollAreaContent(props: ScrollAreaContentProps) {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(() => scrollArea().getContentProps(), props)

  return <ui.div {...mergedProps} />
}
