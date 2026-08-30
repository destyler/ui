import type { Orientation, ScrollbarProps } from '@destyler/scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'
import { ScrollAreaScrollbarProvider } from '../hooks/use-scroll-area-scrollbar-context'

export interface ScrollAreaScrollbarBaseProps extends PolymorphicProps<'div'> {
  /** @default 'vertical' */
  orientation?: Orientation
}
export interface ScrollAreaScrollbarProps
  extends Assign<HTMLProps<'div'>, ScrollAreaScrollbarBaseProps> {}

export function ScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const [scrollbarProps, localProps] = splitProps(props, ['orientation'])
  const scrollArea = useScrollAreaContext()
  const resolvedProps = createMemo<ScrollbarProps>(() => ({
    orientation: scrollbarProps.orientation ?? 'vertical',
  }))
  const mergedProps = mergeProps(
    () => scrollArea().getScrollbarProps(resolvedProps()),
    localProps,
  )

  return (
    <ScrollAreaScrollbarProvider value={resolvedProps}>
      <ui.div {...mergedProps} />
    </ScrollAreaScrollbarProvider>
  )
}
