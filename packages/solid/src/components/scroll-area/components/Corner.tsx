import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaCornerBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaCornerProps
  extends HTMLProps<'div'>,
  ScrollAreaCornerBaseProps {}

export function ScrollAreaCorner(props: ScrollAreaCornerProps) {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(() => scrollArea().getCornerProps(), props)

  return <ui.div {...mergedProps} />
}
