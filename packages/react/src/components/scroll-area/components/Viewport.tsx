import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaViewportBaseProps extends PolymorphicProps {}
export interface ScrollAreaViewportProps extends Assign<HTMLProps<'div'>, ScrollAreaViewportBaseProps> {}

export const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>((props, ref) => {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(scrollArea.getViewportProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ScrollAreaViewport.displayName = 'ScrollAreaViewport'
