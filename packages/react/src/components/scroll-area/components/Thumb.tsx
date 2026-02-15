import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { ThumbProps } from '../types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaThumbBaseProps extends ThumbProps, PolymorphicProps {}
export interface ScrollAreaThumbProps extends Assign<HTMLProps<'div'>, ScrollAreaThumbBaseProps> {}

export const ScrollAreaThumb = forwardRef<HTMLDivElement, ScrollAreaThumbProps>((props, ref) => {
  const { orientation = 'vertical', ...restProps } = props
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(scrollArea.getThumbProps({ orientation }), restProps)

  return <ui.div {...mergedProps} ref={ref} />
})

ScrollAreaThumb.displayName = 'ScrollAreaThumb'
