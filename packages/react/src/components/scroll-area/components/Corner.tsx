import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaCornerBaseProps extends PolymorphicProps {}
export interface ScrollAreaCornerProps extends Assign<HTMLProps<'div'>, ScrollAreaCornerBaseProps> {}

export const ScrollAreaCorner = forwardRef<HTMLDivElement, ScrollAreaCornerProps>((props, ref) => {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(scrollArea.getCornerProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ScrollAreaCorner.displayName = 'ScrollAreaCorner'
