import type { ScrollbarProps } from '../types'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaScrollbarBaseProps extends ScrollbarProps, PolymorphicProps {}
export interface ScrollAreaScrollbarProps extends Assign<HTMLProps<'div'>, ScrollAreaScrollbarBaseProps> {}

export const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>((props, ref) => {
  const { orientation = 'vertical', ...restProps } = props
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(scrollArea.getScrollbarProps({ orientation }), restProps)

  return <ui.div {...mergedProps} ref={ref} />
})

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar'
