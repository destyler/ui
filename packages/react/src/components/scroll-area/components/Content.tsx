import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'

export interface ScrollAreaContentBaseProps extends PolymorphicProps {}
export interface ScrollAreaContentProps extends Assign<HTMLProps<'div'>, ScrollAreaContentBaseProps> {}

export const ScrollAreaContent = forwardRef<HTMLDivElement, ScrollAreaContentProps>((props, ref) => {
  const scrollArea = useScrollAreaContext()
  const mergedProps = mergeProps(scrollArea.getContentProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ScrollAreaContent.displayName = 'ScrollAreaContent'
