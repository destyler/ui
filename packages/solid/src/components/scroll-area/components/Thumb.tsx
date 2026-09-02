import type { Orientation, ScrollbarProps } from '@destyler/scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'
import { useScrollAreaScrollbarContext } from '../hooks/use-scroll-area-scrollbar-context'

export interface ScrollAreaThumbBaseProps extends PolymorphicProps<'div'> {
  /** Overrides the containing scrollbar orientation when provided. */
  orientation?: Orientation
}
export interface ScrollAreaThumbProps
  extends Assign<HTMLProps<'div'>, ScrollAreaThumbBaseProps> {}

export function ScrollAreaThumb(props: ScrollAreaThumbProps) {
  const [thumbProps, localProps] = splitProps(props, ['orientation'])
  const scrollArea = useScrollAreaContext()
  const scrollbarProps = useScrollAreaScrollbarContext()
  const resolvedProps = createMemo<ScrollbarProps>(() => ({
    orientation: thumbProps.orientation ?? scrollbarProps().orientation,
  }))
  const mergedProps = mergeProps(
    () => scrollArea().getThumbProps(resolvedProps()),
    localProps,
  )

  return <ui.div {...mergedProps} />
}
